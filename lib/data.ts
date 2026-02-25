import { createClient } from "@/lib/supabase/server";

export type Board = { id: string; name: string; created_at: string };
export type Discussion = { id: string; board_id: string; title: string; created_at: string };
export type Post = {
  id: string;
  discussion_id: string;
  parent_id: string | null;
  content: string;
  user_handle: string;
  user_id: string;
  created_at: string;
};
export type PostNode = Post & { children: PostNode[] };

export async function getBoards(): Promise<Board[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("boards").select("*").order("created_at");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getDiscussions(boardId: string): Promise<Discussion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("discussions")
    .select("*")
    .eq("board_id", boardId)
    .order("created_at");
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPosts(discussionId: string): Promise<PostNode[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("discussion_id", discussionId)
    .order("created_at");
  if (error) throw new Error(error.message);
  return buildPostTree(data ?? []);
}

function buildPostTree(posts: Post[]): PostNode[] {
  const nodeMap = new Map<string, PostNode>();
  for (const post of posts) {
    nodeMap.set(post.id, { ...post, children: [] });
  }

  const roots: PostNode[] = [];
  for (const post of posts) {
    const node = nodeMap.get(post.id)!;
    if (post.parent_id === null) {
      roots.push(node);
    } else {
      const parent = nodeMap.get(post.parent_id);
      if (parent) {
        parent.children.push(node);
      }
      // Silently drop orphans (can't happen with ON DELETE CASCADE)
    }
  }

  return roots;
}
