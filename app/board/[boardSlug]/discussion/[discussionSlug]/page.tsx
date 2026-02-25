export const dynamic = "force-dynamic";

import Post from "@/components/post";
import { getBoard, getDicussion, getPosts } from "@/lib/data";
import { createPost } from "@/app/board/actions";
import Link from "next/link";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

const secret = () => new TextEncoder().encode(process.env.INVITE_SECRET!);

export default async function Page({
  params,
}: {
  params: Promise<{ boardSlug: string; discussionSlug: string }>;
}) {
  const { boardSlug, discussionSlug } = await params;
  const posts = await getPosts(discussionSlug);
  const rootAction = createPost.bind(null, discussionSlug, null, boardSlug);
  const board = await getBoard(boardSlug);
  const discussion = await getDicussion(discussionSlug);

  const cookieStore = await cookies();
  const cookie = cookieStore.get("book_club_session");
  let handle: string | null = null;
  if (cookie) {
    try {
      const { payload } = await jwtVerify(cookie.value, secret());
      handle = (payload as { handle: string }).handle ?? null;
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-5 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href={`/board/${boardSlug}`} className="text-sm hover:underline">← Back</Link>
        <div>{board.name}: {discussion.title}</div>
        {handle && <span className="text-sm text-muted-foreground">Commenting as <strong>{handle}</strong></span>}
      </div>
      <div className="flex flex-col">
        {posts.map((post) => (
          <Post key={post.id} node={post} boardId={boardSlug} />
        ))}
      </div>
      <form action={rootAction} className="flex flex-col gap-2 border-t pt-4">
        <textarea
          name="content"
          required
          rows={4}
          className="border rounded px-3 py-2 text-sm w-full resize-none"
          placeholder="Add a comment..."
        />
        <button type="submit" className="self-start text-sm underline underline-offset-4">
          Post
        </button>
      </form>
    </div>
  );
}
