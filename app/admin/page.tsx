export const dynamic = "force-dynamic";

import Link from "next/link";
import { getBoards } from "@/lib/data";

export default async function AdminPage() {
  const boards = await getBoards();

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Boards</h2>
        <Link href="/admin/boards/new" className="text-sm underline underline-offset-4">
          New board
        </Link>
      </div>
      {boards.length === 0 ? (
        <p className="text-sm text-muted-foreground">No boards yet.</p>
      ) : (
        <ul className="space-y-2">
          {boards.map((board) => (
            <li key={board.id}>
              <Link
                href={`/admin/boards/${board.id}`}
                className="text-sm underline underline-offset-4"
              >
                {board.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
