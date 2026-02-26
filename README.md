# Book Club

A minimal private discussion app for book clubs. An admin creates boards (books) and discussions (chapters), then shares invite links with members. Members join with a display handle and can comment in threaded discussions.

## Features

- **Boards** — one per book, each with its own invite link
- **Discussions** — chapters or topics within a board; admins can add a starter prompt to give members focus
- **Threaded posts** — comments nest like Hacker News; reply to any post
- **No sign-up for members** — join via an invite link, pick a handle, start posting
- **Admin panel** — create boards/discussions, generate invite links, edit starter prompts
- **Two-tier auth** — admin uses Supabase email/password; members get a 90-day session cookie on join

## Stack

- [Next.js](https://nextjs.org) (App Router)
- [Supabase](https://supabase.com) (Postgres + Auth)
- [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- Deployed on [Vercel](https://vercel.com)

## Setup

### Prerequisites

- Node.js 18+
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- A Supabase project (or run locally with `supabase start`)

### 1. Clone and install

```bash
git clone <repo>
cd bookclub
npm install
```

### 2. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=<your Supabase project URL>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your Supabase publishable/anon key>
INVITE_SECRET=<any long random string>
```

`INVITE_SECRET` is used to sign invite link JWTs and member session cookies. Generate one with `openssl rand -hex 32`.

### 3. Run the database migrations

**Local Supabase:**

```bash
supabase start
supabase db reset   # applies all migrations in supabase/migrations/
```

**Remote Supabase project:**

```bash
supabase db push
```

### 4. Create an admin account

Go to your Supabase dashboard → Authentication → Users → Invite user (or add one manually). This email/password is what you use to log in to `/admin`.

### 5. Start the dev server

```bash
npm run dev
```

App runs at `http://localhost:3000`. Supabase Studio (local) is at `http://localhost:54323`.

## Usage

1. Log in at `/auth/login` with your admin credentials
2. Create a board for the book you're reading
3. Add discussions for chapters or topics; optionally write a starter prompt for each
4. Generate an invite link from the board admin page and share it with your group
5. Members click the link, pick a handle, and land on the board ready to post
