-- Seed data for local development
-- Run with: supabase db reset  (applies migrations + seed)
-- Or standalone: psql $DATABASE_URL -f supabase/seed.sql

-- Fixed UUIDs so links are stable across resets
DO $$
DECLARE
  board_id1 UUID := 'aaaaaaaa-0000-0000-0000-000000000001';
  board_id2 UUID := 'aaaaaaaa-0000-0000-0000-000000000002';

  disc_id1  UUID := 'bbbbbbbb-0000-0000-0000-000000000001';
  disc_id2  UUID := 'bbbbbbbb-0000-0000-0000-000000000002';
  disc_id3  UUID := 'bbbbbbbb-0000-0000-0000-000000000003';

  post_id1  UUID := 'cccccccc-0000-0000-0000-000000000001';
  post_id2  UUID := 'cccccccc-0000-0000-0000-000000000002';
  post_id3  UUID := 'cccccccc-0000-0000-0000-000000000003';
  post_id4  UUID := 'cccccccc-0000-0000-0000-000000000004';
  post_id5  UUID := 'cccccccc-0000-0000-0000-000000000005';
  post_id6  UUID := 'cccccccc-0000-0000-0000-000000000006';
  post_id7  UUID := 'cccccccc-0000-0000-0000-000000000007';

  user_alice UUID := 'dddddddd-0000-0000-0000-000000000001';
  user_bob   UUID := 'dddddddd-0000-0000-0000-000000000002';
  user_carol UUID := 'dddddddd-0000-0000-0000-000000000003';
BEGIN

-- ── Boards ────────────────────────────────────────────────────────────────────
INSERT INTO boards (id, name, created_at) VALUES
  (board_id1, 'The Left Hand of Darkness', '2026-01-01 10:00:00+00'),
  (board_id2, 'Piranesi',                  '2026-01-15 10:00:00+00');

-- ── Discussions ───────────────────────────────────────────────────────────────
INSERT INTO discussions (id, board_id, title, created_at) VALUES
  (disc_id1, board_id1, 'Chapters 1–5: Arriving on Winter',       '2026-01-02 10:00:00+00'),
  (disc_id2, board_id1, 'Chapters 6–10: The Road to Orgoreyn',    '2026-01-09 10:00:00+00'),
  (disc_id3, board_id2, 'The House and its Halls',                 '2026-01-16 10:00:00+00');

-- ── Posts (disc_id1 — threaded conversation) ──────────────────────────────────
--
-- Thread structure:
--   post_id1  (root) alice
--     post_id2  (reply to 1) bob
--       post_id4  (reply to 2) alice
--       post_id5  (reply to 2) carol
--     post_id3  (reply to 1) carol
--   post_id6  (root) bob
--     post_id7  (reply to 6) alice

INSERT INTO posts (id, discussion_id, parent_id, content, user_handle, user_id, created_at) VALUES
  (post_id1, disc_id1, NULL,
   'The opening chapters do such a good job of keeping us disoriented alongside Genly — we don''t really know the rules of Gethen any more than he does.',
   'alice', user_alice, '2026-01-02 11:00:00+00'),

  (post_id2, disc_id1, post_id1,
   'Exactly. The shifgrethor concept took me a few chapters to even notice was happening. Le Guin slips it in so quietly.',
   'bob', user_bob, '2026-01-02 12:00:00+00'),

  (post_id4, disc_id1, post_id2,
   'The word itself is never fully defined, which I think is intentional. We''re supposed to feel the gap.',
   'alice', user_alice, '2026-01-02 13:30:00+00'),

  (post_id5, disc_id1, post_id2,
   'It maps a bit onto "face" in East Asian cultures but it''s clearly not the same thing. Le Guin is building something new.',
   'carol', user_carol, '2026-01-02 14:00:00+00'),

  (post_id3, disc_id1, post_id1,
   'I was struck by how Genly keeps reading people through a gender lens even when he knows it doesn''t apply. Says a lot about how deep those assumptions run.',
   'carol', user_carol, '2026-01-02 12:30:00+00'),

  (post_id6, disc_id1, NULL,
   'Can we talk about Estraven? The diary excerpts feel like a completely different novel — much more intimate.',
   'bob', user_bob, '2026-01-03 09:00:00+00'),

  (post_id7, disc_id1, post_id6,
   'The dual narration is doing a lot of work. By the time we get Estraven''s perspective we realize how much Genly has been misreading him.',
   'alice', user_alice, '2026-01-03 10:00:00+00');

END $$;
