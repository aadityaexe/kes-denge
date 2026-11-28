import { describe, it, expect, beforeAll } from "vitest";
import {
  isValidObjectId,
  isValidSlug,
  isValidEmail,
  sanitizeText,
  escapeRegex,
  isAllowedFileType,
  verifyFileMagicBytes,
  detectMimeFromMagicBytes,
} from "@/lib/validation";
import { sanitizeBlogContent } from "@/lib/blog-sanitize";
import { safeJsonLd } from "@/lib/json-ld";
import { isSafeUrl, safeHref, settingsUpdateSchema } from "@/lib/schemas";
import { encrypt, decrypt } from "@/lib/auth";

beforeAll(() => {
  process.env.JWT_SECRET =
    "test-jwt-secret-key-minimum-32-chars-long-123456";
});

describe("validation.ts", () => {
  it("isValidObjectId rejects 12-char non-hex strings and accepts 24-char hex", () => {
    expect(isValidObjectId("123456789012")).toBe(false); // 12-char trap!
    expect(isValidObjectId("hello-world!")).toBe(false);
    expect(isValidObjectId("507f1f77bcf86cd799439011")).toBe(true);
    expect(isValidObjectId("507F1F77BCF86CD799439011")).toBe(true);
    expect(isValidObjectId(null)).toBe(false);
  });

  it("sanitizeText preserves legitimate < and > characters without data loss", () => {
    const msg = "budget < 5k and timeline > 2 months";
    expect(sanitizeText(msg)).toBe(msg);
  });

  it("escapeRegex escapes regex metacharacters", () => {
    expect(escapeRegex("a+b*(c)?[d]")).toBe("a\\+b\\*\\(c\\)\\?\\[d\\]");
  });

  it("isValidSlug & isValidEmail", () => {
    expect(isValidSlug("valid-slug-123")).toBe(true);
    expect(isValidSlug("Invalid Slug!")).toBe(false);
    expect(isValidEmail("user@example.com")).toBe(true);
    expect(isValidEmail("not-an-email")).toBe(false);
  });
});

describe("upload magic bytes & MIME detection", () => {
  it("rejects an .exe (MZ header) renamed to .png", () => {
    const mzBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00]);
    const check = verifyFileMagicBytes(mzBuffer, "image/png");
    expect(check.valid).toBe(false);
    expect(detectMimeFromMagicBytes(mzBuffer)).toBeNull();
  });

  it("accepts a real PNG signature and detects image/png", () => {
    const pngBuf = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00]);
    expect(verifyFileMagicBytes(pngBuf, "image/png").valid).toBe(true);
    expect(detectMimeFromMagicBytes(pngBuf)).toBe("image/png");
  });

  it("disambiguates MP4 ftypisom from AVIF ftypavif", () => {
    // ftypisom at offset 4
    const mp4Buf = Buffer.from([
      0x00, 0x00, 0x00, 0x18,
      0x66, 0x74, 0x79, 0x70,
      0x69, 0x73, 0x6f, 0x6d,
    ]);
    expect(verifyFileMagicBytes(mp4Buf, "image/avif").valid).toBe(false);
    expect(verifyFileMagicBytes(mp4Buf, "video/mp4").valid).toBe(true);
    expect(detectMimeFromMagicBytes(mp4Buf)).toBe("video/mp4");

    // ftypavif at offset 4
    const avifBuf = Buffer.from([
      0x00, 0x00, 0x00, 0x18,
      0x66, 0x74, 0x79, 0x70,
      0x61, 0x76, 0x69, 0x66,
    ]);
    expect(verifyFileMagicBytes(avifBuf, "image/avif").valid).toBe(true);
    expect(detectMimeFromMagicBytes(avifBuf)).toBe("image/avif");
  });

  it("blocks dangerous extensions like .svg and .exe", () => {
    expect(isAllowedFileType("image/svg+xml", "icon.svg").valid).toBe(false);
    expect(isAllowedFileType("image/png", "malware.exe").valid).toBe(false);
  });
});

describe("blog-sanitize.ts XSS payload suite", () => {
  it("strips script tags, event handlers, style tags, and javascript: URLs", () => {
    const payloads = [
      `<p>Hello</p><script>alert(1)</script>`,
      `<img src=x onerror=alert(1)>`,
      `<a href="javascript:alert(1)" onclick="steal()">Click</a>`,
      `<style>body{display:none}</style><p>Safe</p>`,
      `<iframe src="https://evil.example"></iframe>`,
    ];

    for (const p of payloads) {
      const clean = sanitizeBlogContent(p);
      expect(clean).not.toMatch(/<script/i);
      expect(clean).not.toMatch(/onerror=/i);
      expect(clean).not.toMatch(/onclick=/i);
      expect(clean).not.toMatch(/javascript:/i);
      expect(clean).not.toMatch(/<style/i);
      expect(clean).not.toMatch(/<iframe/i);
    }

    // External link gets rel="noopener noreferrer"
    const linkClean = sanitizeBlogContent(`<a href="https://example.com">Link</a>`);
    expect(linkClean).toContain('rel="noopener noreferrer"');
  });
});

describe("json-ld.tsx safeJsonLd", () => {
  it("escapes script-breakout sequences", () => {
    const evil = { text: `</script><script>alert(1)</script>&\u2028\u2029` };
    const out = safeJsonLd(evil);
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<script>");
    expect(out).toContain("\\u003c/script\\u003e");
    expect(out).toContain("\\u0026");
  });
});

describe("schemas.ts URL & settings validation", () => {
  it("blocks javascript: and data: URLs", () => {
    expect(isSafeUrl("javascript:alert(1)")).toBe(false);
    expect(isSafeUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    expect(isSafeUrl("https://mark2.in")).toBe(true);
    expect(isSafeUrl("/contact")).toBe(true);
    expect(safeHref("javascript:alert(1)")).toBe("#");
  });

  it("settingsUpdateSchema rejects unknown keys and dangerous URLs", () => {
    const bad = settingsUpdateSchema.safeParse({
      siteName: "MARK2",
      unknownInjectedKey: "evil",
    });
    expect(bad.success).toBe(false);

    const badUrl = settingsUpdateSchema.safeParse({
      socialLinks: { github: "javascript:alert(1)" },
    });
    expect(badUrl.success).toBe(false);

    const good = settingsUpdateSchema.safeParse({
      siteName: "MARK2",
      socialLinks: { github: "https://github.com/mark2" },
    });
    expect(good.success).toBe(true);
  });
});

describe("auth.ts JWT sign & verify", () => {
  it("signs and verifies a valid session payload, rejects tampered tokens", async () => {
    const token = await encrypt({
      userId: "507f1f77bcf86cd799439011",
      email: "admin@mark2.in",
      role: "admin",
      tokenVersion: 1,
    });
    const decoded = await decrypt(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.email).toBe("admin@mark2.in");
    expect(decoded?.role).toBe("admin");
    expect(decoded?.tokenVersion).toBe(1);

    // Tampered token
    const tampered = token.slice(0, -4) + "abcd";
    expect(await decrypt(tampered)).toBeNull();
  });
});
