-- Enable RLS
ALTER TABLE boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Boards: anyone can read, only admin (authenticated Supabase user) can write
CREATE POLICY "boards_select" ON boards FOR SELECT USING (true);
CREATE POLICY "boards_insert" ON boards FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "boards_update" ON boards FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "boards_delete" ON boards FOR DELETE USING (auth.role() = 'authenticated');

-- Discussions: same pattern as boards
CREATE POLICY "discussions_select" ON discussions FOR SELECT USING (true);
CREATE POLICY "discussions_insert" ON discussions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "discussions_update" ON discussions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "discussions_delete" ON discussions FOR DELETE USING (auth.role() = 'authenticated');

-- Posts: anyone can read and insert (app layer validates board access via cookie),
-- only admin can delete
CREATE POLICY "posts_select" ON posts FOR SELECT USING (true);
CREATE POLICY "posts_insert" ON posts FOR INSERT WITH CHECK (true);
CREATE POLICY "posts_delete" ON posts FOR DELETE USING (auth.role() = 'authenticated');
