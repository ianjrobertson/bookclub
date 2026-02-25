"use client";

import { useState } from "react";
import type { PostNode } from "@/lib/data";
import { createPost } from "@/app/board/actions";

export default function Post({
  node,
  boardId,
  depth = 0,
}: {
  node: PostNode;
  boardId: string;
  depth?: number;
}) {
  const [replying, setReplying] = useState(false);
  const replyAction = createPost.bind(null, node.discussion_id, node.id, boardId);

  return (
    <div style={{ marginLeft: depth * 24 }} className="py-2">
      <div className="text-sm font-semibold">{node.user_handle}</div>
      <div>{node.content}</div>
      <div className="flex items-center gap-3 mt-1">
        <span className="text-xs text-muted-foreground">
          {new Date(node.created_at).toLocaleString()}
        </span>
        <button
          onClick={() => setReplying((v) => !v)}
          className="text-xs text-muted-foreground hover:underline"
        >
          {replying ? "cancel" : "reply"}
        </button>
      </div>
      {replying && (
        <form action={replyAction} className="mt-2 flex flex-col gap-2">
          <textarea
            name="content"
            required
            autoFocus
            rows={3}
            className="border rounded px-3 py-2 text-sm w-full max-w-lg resize-none"
            placeholder="Write a reply..."
          />
          <button type="submit" className="self-start text-sm underline underline-offset-4">
            Post reply
          </button>
        </form>
      )}
      {node.children.map((child) => (
        <Post key={child.id} node={child} boardId={boardId} depth={depth + 1} />
      ))}
    </div>
  );
}
