import { NextRequest, NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/auth";

function performLogout(request: NextRequest) {
  const acceptHeader = request.headers.get("accept") || "";
  const contentType = request.headers.get("content-type") || "";
  const isJsonApi =
    (acceptHeader.includes("application/json") &&
      !acceptHeader.includes("text/html")) ||
    contentType.includes("application/json");

  const loginUrl = new URL("/admin/login", request.url);

  const response = isJsonApi
    ? NextResponse.json({ success: true, message: "Logged out successfully" })
    : NextResponse.redirect(loginUrl, { status: 303 });

  clearSessionCookie(response);
  return response;
}

export async function POST(request: NextRequest) {
  return performLogout(request);
}

// GET logout is intentionally NOT exported to prevent CSRF logout via <img> tags.
