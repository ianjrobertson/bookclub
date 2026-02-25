"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signInviteToken } from "@/lib/invite-token";

export async function createBoard(formData: FormData) {
  const name = formData.get("name") as string;
  const supabase = await createClient();
  const { data: board, error } = await supabase
    .from("boards")
    .insert({ name })
    .select()
    .single();
  if (error) throw new Error(error.message);
  redirect(`/admin/boards/${board.id}`);
}

export async function createDiscussion(boardId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const supabase = await createClient();
  const { error } = await supabase
    .from("discussions")
    .insert({ board_id: boardId, title })
    .select()
    .single();
  if (error) throw new Error(error.message);
  redirect(`/admin/boards/${boardId}`);
}

export async function generateInviteLink(boardId: string) {
  const token = await signInviteToken(boardId);
  redirect(`/admin/boards/${boardId}?invite=${token}`);
}
