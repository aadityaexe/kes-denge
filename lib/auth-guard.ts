import { NextResponse } from "next/server";
import { getSession, SessionPayload } from "./auth";

export type AuthResult =
  | { authorized: true; session: SessionPayload; response?: undefined }
  | { authorized: false; response: NextResponse; session?: undefined };

export async function requireAdminSession(): Promise<AuthResult> {
  const session = await getSession();
  if (!session || !session.userId) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Unauthorized. Please log in as an administrator." },
        { status: 401 }
      ),
    };
  }
  return { authorized: true, session };
}
