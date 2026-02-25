import type { PostNode } from "@/lib/data";

export default function Post({ node, depth = 0 }: { node: PostNode; depth?: number }) {
  return (
    <div style={{ marginLeft: depth * 24 }} className="py-2">
      <div className="text-sm font-semibold">{node.user_handle}</div>
      <div>{node.content}</div>
      <div className="text-xs text-muted-foreground">
        {new Date(node.created_at).toLocaleString()}
      </div>
      {node.children.map((child) => (
        <Post key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}
