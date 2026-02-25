"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { joinBoard } from "./actions";

export default function JoinPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [handle, setHandle] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await joinBoard(token, handle.trim());
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <h1 className="text-2xl font-semibold">Join the book club</h1>
        <label htmlFor="handle" className="text-sm font-medium">
          What should we call you?
        </label>
        <input
          id="handle"
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          required
          minLength={1}
          className="border rounded px-3 py-2 text-sm"
          placeholder="Your name or handle"
        />
        <button
          type="submit"
          disabled={!token || !handle.trim()}
          className="bg-primary text-primary-foreground rounded px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          Join
        </button>
        {!token && (
          <p className="text-sm text-destructive">
            Missing invite token. Use the link from your invitation.
          </p>
        )}
      </form>
    </div>
  );
}
