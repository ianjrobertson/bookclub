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

  let handle: string;
  let user_id: string;

  if (cookie) {
    try {
      const { payload } = await jwtVerify(cookie.value, secret());
      ({ handle, user_id } = payload as { handle: string; user_id: string });
    } catch {
      redirect("/auth/error");
    }
  } else {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/error");
    handle = user.email!;
    user_id = user.id;
  }

  const content = (formData.get("content") as string)?.trim();
  if (!content) redirect(`/board/${boardId}/discussion/${discussionId}`);

  const supabase = await createClient();
  const { error } = await supabase.from("posts").insert({
    discussion_id: discussionId,
    parent_id: parentId,
    content,
    user_handle: handle,
    user_id,
  });
  if (error) throw new Error(error.message);

  redirect(`/board/${boardId}/discussion/${discussionId}`);
}
