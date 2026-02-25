export const dynamic = "force-dynamic";

import Post from "@/components/post";
import { getPosts } from "@/lib/data";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ boardSlug: string; discussionSlug: string }>;
}) {
  const { boardSlug, discussionSlug } = await params;
  const posts = await getPosts(discussionSlug);

  return (
    <div className="max-w-5xl mx-auto p-5 flex flex-col gap-4">
      <Link href={`/board/${boardSlug}`} className="text-sm hover:underline">← Back</Link>
      <div className="flex flex-col">
        {posts.map((post) => (
          <Post key={post.id} node={post} />
        ))}
      </div>
    </div>
  );
}
