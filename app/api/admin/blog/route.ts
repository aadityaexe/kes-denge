import { NextRequest, NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/auth-guard";
import { connectToDatabase } from "@/lib/mongodb";
import BlogPost from "@/models/Blog";
import { isNonEmptyString, isValidSlug, sanitizeText, safeErrorMessage } from "@/lib/validation";
import { sanitizeBlogContent } from "@/lib/blog-sanitize";

export async function GET() {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    await connectToDatabase();
    const posts = await BlogPost.find().select("-content").sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, posts });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to fetch blog posts") },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminSession();
  if (!auth.authorized) return auth.response;

  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      featuredImage,
      category,
      tags,
      author,
      status,
      metaTitle,
      metaDescription,
      readTime,
    } = body;

    if (!isNonEmptyString(title, 200) || !isNonEmptyString(slug, 200) || !isNonEmptyString(excerpt, 2000) || !isNonEmptyString(content, 100000)) {
      return NextResponse.json({ error: "Missing or invalid required blog post fields" }, { status: 400 });
    }

    const sanitizedSlug = slug.toLowerCase().trim().replace(/\s+/g, "-");
    if (!isValidSlug(sanitizedSlug)) {
      return NextResponse.json({ error: "Invalid slug format" }, { status: 400 });
    }

    await connectToDatabase();
    const existing = await BlogPost.findOne({ slug: sanitizedSlug });
    if (existing) {
      return NextResponse.json({ error: "A blog post with this slug already exists" }, { status: 400 });
    }

    const post = await BlogPost.create({
      title: sanitizeText(title, 200),
      slug: sanitizedSlug,
      excerpt: sanitizeText(excerpt, 2000),
      content: sanitizeBlogContent(content), // Sanitize HTML to prevent stored XSS
      featuredImage: typeof featuredImage === "string" ? featuredImage.slice(0, 1000) : "",
      category: isNonEmptyString(category, 100) ? sanitizeText(category, 100) : "Engineering",
      tags: Array.isArray(tags) ? tags.map((t: unknown) => sanitizeText(t, 50)).filter(Boolean) : [],
      author: {
        name: sanitizeText(author?.name || "MARK 2 Team", 100),
        role: sanitizeText(author?.role || "Technical Architect", 100),
        avatar: typeof author?.avatar === "string" ? author.avatar.slice(0, 500) : undefined,
      },
      status: ["published", "draft"].includes(status) ? status : "draft",
      metaTitle: sanitizeText(metaTitle || title, 200),
      metaDescription: sanitizeText(metaDescription || excerpt, 500),
      readTime: sanitizeText(readTime || "5 min read", 50),
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to create blog post") },
      { status: 500 }
    );
  }
}
