"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { createClient } from "@/lib/supabase/server";

const COOKIE_NAME = "book_club_session";
const secret = () => new TextEncoder().encode(process.env.INVITE_SECRET!);

export async function createPost(
  discussionId: string,
  parentId: string | null,
  boardId: string,
  formData: FormData,
) {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) redirect("/auth/error");

  let session: { handle: string; user_id: string };
  try {
    const { payload } = await jwtVerify(cookie.value, secret());
    session = payload as typeof session;
  } catch {
    redirect("/auth/error");
  }

  const content = (formData.get("content") as string)?.trim();
  if (!content) redirect(`/board/${boardId}/discussion/${discussionId}`);

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({
    discussion_id: discussionId,
    parent_id: parentId,
    content,
    user_handle: session.handle,
    user_id: session.user_id,
  });
  if (error) throw new Error(error.message);

  redirect(`/board/${boardId}/discussion/${discussionId}`);
}
