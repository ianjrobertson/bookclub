import { SignJWT, jwtVerify } from "jose";

const secret = () => {
  const s = process.env.INVITE_SECRET;
  if (!s) throw new Error("INVITE_SECRET is not set");
  return new TextEncoder().encode(s);
};

export async function signInviteToken(boardId: string): Promise<string> {
  return new SignJWT({ board_id: boardId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret());
}

export async function verifyInviteToken(
  token: string,
): Promise<{ board_id: string }> {
  const { payload } = await jwtVerify(token, secret());
  if (typeof payload.board_id !== "string") {
    throw new Error("Invalid token payload");
  }
  return { board_id: payload.board_id };
}
