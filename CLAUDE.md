# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint

# Supabase local
supabase start       # Start local Supabase (Postgres + Auth + Studio)
supabase stop        # Stop local Supabase
supabase db reset    # Re-run all migrations from scratch
```

Supabase Studio runs at `http://localhost:54323` when local instance is active.

## Architecture

### Two-tier auth

There are two user classes, each with a different auth mechanism:

- **Admin** — Supabase email/password. Session managed by `@supabase/ssr`. Checked in `lib/supabase/proxy.ts` for any route not explicitly public or member-scoped.
- **Members** — Invite link (`/join?token=<JWT>`) + self-chosen handle. On join, a `book_club_session` JWT cookie is issued (90-day expiry). No Supabase account is created.

Both token types are signed with `INVITE_SECRET` (HS256 via `jose`). Required in `.env.local`.

### Route protection (`proxy.ts` → `lib/supabase/proxy.ts`)

Next.js 16 uses `proxy.ts` instead of `middleware.ts`. All requests pass through `updateSession`:

| Route pattern | Protection |
|---|---|
| `/`, `/join`, `/auth/*` | Public |
| `/board/*`, `/discussion/*` | `book_club_session` cookie (member) |
| Everything else (incl. `/admin/*`) | Supabase admin session |

### Key lib files

- `lib/invite-token.ts` — `signInviteToken(boardId)` / `verifyInviteToken(token)` — 30-day JWT for invite links
- `lib/member-session.ts` — `getMemberSession(request)` / `setMemberSession(response, session)` — reads/writes the `book_club_session` cookie; `MemberSession` type is `{ board_id, handle, user_id, granted_at }`
- `lib/supabase/proxy.ts` — request-time auth routing logic
- `lib/utils.ts` — `cn()` for Tailwind class merging; `hasEnvVars` guard used to skip auth checks when env vars are missing

### Data model

Three tables in Supabase (see `supabase/migrations/`):

- **boards** — represents a book
- **discussions** — chapters within a board (`board_id` FK)
- **posts** — comments on a discussion (`discussion_id` FK), optionally replying to another post (`parent_id` FK). Posts are stored/returned in pre-order DFS (full depth of a thread before next root comment). `user_id` is a UUID generated at join time (not a Supabase auth UID).

### Join flow

1. Admin calls `signInviteToken(boardId)` to get a link
2. Member visits `/join?token=<JWT>`
3. `app/join/page.tsx` (client component) shows a handle form
4. Submit calls `joinBoard(token, handle)` server action (`app/join/actions.ts`)
5. Action verifies token → generates `user_id` → sets `book_club_session` cookie → redirects to `/board/<id>`

### Supabase client conventions

- Use `createServerClient` (from `@supabase/ssr`) in server components/actions
- Never store the client in a module-level variable — always create a new instance per request (Fluid compute requirement)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are the env var names (note: `PUBLISHABLE_KEY`, not `ANON_KEY`)
