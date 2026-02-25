import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBoard } from "@/app/admin/actions";

export default function NewBoardPage() {
  return (
    <div className="max-w-sm space-y-6">
      <h2 className="text-lg font-medium">New board</h2>
      <form action={createBoard} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required />
        </div>
        <Button type="submit">Create board</Button>
      </form>
    </div>
  );
}
