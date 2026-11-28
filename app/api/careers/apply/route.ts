import { NextRequest, NextResponse, after } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Job from "@/models/Job";
import JobApplication from "@/models/JobApplication";
import Setting from "@/models/Setting";
import {
  extractClientIp,
  isValidObjectId,
  isValidEmail,
  isNonEmptyString,
  sanitizeText,
  safeErrorMessage,
} from "@/lib/validation";
import { isSafeUrl } from "@/lib/schemas";
import { rateLimit, rateLimitExceededResponse } from "@/lib/rate-limit";
import { logEvent, hashIdentifier } from "@/lib/logger";

const MAX_APPLY_BODY_BYTES = 32 * 1024; // 32 KB

async function sendApplicationEmail(params: {
  to: string;
  jobTitle: string;
  applicantName: string;
  email: string;
  phone: string;
  resumeUrl: string;
  coverLetter: string;
  applicationId: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const from = process.env.RESEND_FROM_EMAIL || "MARK2 Careers <noreply@mark2.in>";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        reply_to: params.email,
        subject: `New Job Application: ${params.jobTitle} — ${params.applicantName}`,
        text: [
          `Application ID: ${params.applicationId}`,
          `Role: ${params.jobTitle}`,
          `Applicant: ${params.applicantName}`,
          `Email: ${params.email}`,
          params.phone ? `Phone: ${params.phone}` : "",
          params.resumeUrl ? `Resume: ${params.resumeUrl}` : "",
          "",
          "Cover Letter / Note:",
          params.coverLetter,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });
    if (!res.ok) {
      logEvent("error", "careers.apply.email_failed", {
        status: res.status,
        applicationId: params.applicationId,
      });
    }
  } catch (err) {
    logEvent("error", "careers.apply.email_error", {
      applicationId: params.applicationId,
      error: err instanceof Error ? err.message : "unknown",
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = extractClientIp(req);
    const rl = await rateLimit(`careers-apply:${ip}`, 5, 15 * 60 * 1000, {
      failClosed: true,
    });
    if (!rl.allowed) {
      return rateLimitExceededResponse(
        rl,
        `Too many applications submitted. Please try again in ${Math.max(
          1,
          Math.ceil((rl.retryAfterMs ?? 60_000) / 1000)
        )} seconds.`
      );
    }

    const contentLength = req.headers.get("content-length");
    if (contentLength && Number(contentLength) > MAX_APPLY_BODY_BYTES) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    const raw = await req.text();
    if (Buffer.byteLength(raw, "utf8") > MAX_APPLY_BODY_BYTES) {
      return NextResponse.json({ error: "Request body too large" }, { status: 413 });
    }

    const body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
    const {
      jobId,
      applicantName,
      email,
      phone,
      location,
      currentRole,
      experienceYears,
      noticePeriod,
      portfolioUrl,
      linkedinUrl,
      resumeUrl,
      coverLetter,
    } = body;

    if (!isValidObjectId(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }
    if (!isNonEmptyString(applicantName, 120)) {
      return NextResponse.json({ error: "Full name is required" }, { status: 400 });
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "A valid email address is required" }, { status: 400 });
    }
    if (!isNonEmptyString(coverLetter, 8000)) {
      return NextResponse.json(
        { error: "Please include a cover letter or note about why you'd be a great fit" },
        { status: 400 }
      );
    }

    for (const [label, val] of [
      ["Portfolio URL", portfolioUrl],
      ["LinkedIn URL", linkedinUrl],
      ["Resume URL", resumeUrl],
    ] as const) {
      if (val && (typeof val !== "string" || !isSafeUrl(val))) {
        return NextResponse.json({ error: `${label} must be a valid http(s) URL` }, { status: 400 });
      }
    }

    await connectToDatabase();

    const job = await Job.findOne({ _id: jobId, status: "open" }).lean();
    if (!job) {
      return NextResponse.json(
        { error: "This job opening is no longer accepting applications" },
        { status: 404 }
      );
    }

    const cleanName = sanitizeText(applicantName, 120);
    const cleanEmail = String(email).trim().toLowerCase().slice(0, 254);
    const cleanPhone = typeof phone === "string" ? sanitizeText(phone, 40) : "";
    const cleanLocation = typeof location === "string" ? sanitizeText(location, 120) : "";
    const cleanCurrentRole = typeof currentRole === "string" ? sanitizeText(currentRole, 120) : "";
    const cleanExp = typeof experienceYears === "string" ? sanitizeText(experienceYears, 40) : "";
    const cleanNotice = typeof noticePeriod === "string" ? sanitizeText(noticePeriod, 60) : "";
    const cleanPortfolio = typeof portfolioUrl === "string" ? portfolioUrl.trim().slice(0, 500) : "";
    const cleanLinkedin = typeof linkedinUrl === "string" ? linkedinUrl.trim().slice(0, 500) : "";
    const cleanResume = typeof resumeUrl === "string" ? resumeUrl.trim().slice(0, 500) : "";
    const cleanCoverLetter = sanitizeText(coverLetter, 8000);

    const application = await JobApplication.create({
      jobId: job._id,
      jobTitle: job.title,
      jobSlug: job.slug,
      applicantName: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      location: cleanLocation,
      currentRole: cleanCurrentRole,
      experienceYears: cleanExp,
      noticePeriod: cleanNotice,
      portfolioUrl: cleanPortfolio,
      linkedinUrl: cleanLinkedin,
      resumeUrl: cleanResume,
      coverLetter: cleanCoverLetter,
      status: "new",
    });

    logEvent("info", "careers.application.submitted", {
      applicationId: String(application._id),
      jobSlug: job.slug,
      ipHash: hashIdentifier(ip),
    });

    const settings = await Setting.findOne().select("contactEmail").lean();
    const notifyTo =
      (settings && typeof settings.contactEmail === "string" && settings.contactEmail) ||
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      "hello@mark2.in";

    after(() =>
      sendApplicationEmail({
        to: notifyTo,
        jobTitle: job.title,
        applicantName: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        resumeUrl: cleanResume,
        coverLetter: cleanCoverLetter,
        applicationId: String(application._id),
      })
    );

    return NextResponse.json(
      {
        success: true,
        message: "Your application has been submitted! Our team will review it shortly.",
        applicationId: application._id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: safeErrorMessage(error, "Failed to submit application") },
      { status: 500 }
    );
  }
}
