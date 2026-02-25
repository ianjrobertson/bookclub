import { SignJWT, jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "book_club_session";
const MAX_AGE = 60 * 60 * 24 * 90; // 90 days

export type MemberSession = {
  board_id: string;
  handle: string;
  user_id: string;
  granted_at: number;
};

const secret = () => {
  const s = process.env.INVITE_SECRET;
  if (!s) throw new Error("INVITE_SECRET is not set");
  return new TextEncoder().encode(s);
};

export async function getMemberSession(
  request: NextRequest,
): Promise<MemberSession | null> {
  const cookie = request.cookies.get(COOKIE_NAME);
  if (!cookie) return null;

  try {
    const { payload } = await jwtVerify(cookie.value, secret());
    return payload as unknown as MemberSession;
  } catch {
    return null;
  }
}

export async function setMemberSession(
  response: NextResponse,
  session: MemberSession,
): Promise<NextResponse> {
  const token = await new SignJWT(session as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("90d")
    .sign(secret());

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  return response;
}
