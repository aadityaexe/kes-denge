import { NextRequest, NextResponse } from "next/server";

function performLogout(request: NextRequest) {
  const acceptHeader = request.headers.get("accept") || "";
  const isJsonApi =
    acceptHeader.includes("application/json") && !acceptHeader.includes("text/html");

  const loginUrl = new URL("/admin/login", request.url);

  const response = isJsonApi
    ? NextResponse.json({ success: true, message: "Logged out successfully" })
    : NextResponse.redirect(loginUrl, { status: 303 });

  response.cookies.delete("admin_session");
  response.cookies.set("admin_session", "", {
    path: "/",
    expires: new Date(0),
    httpOnly: true,
    sameSite: "lax",
  });

  return response;
}

export async function POST(request: NextRequest) {
  return performLogout(request);
}

export async function GET(request: NextRequest) {
  return performLogout(request);
}

