
-- Fix RLS Policy untuk Public Insert
-- Hapus policy lama yang terlalu restrictive
DROP POLICY IF EXISTS "Public can insert reports" ON public.reports;

-- Buat policy baru yang membolehkan siapa saja (anon & authenticated) untuk insert
CREATE POLICY "Anyone can insert reports"
ON public.reports FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy untuk SELECT tetap sama (hanya bisa lihat laporan sendiri jika authenticated)
-- Tapi kita perlu tambahkan policy untuk anon user yang tracking via server action
-- Server action akan menggunakan service role, jadi tidak perlu policy khusus untuk tracking

-- Fix untuk report_attachments juga
DROP POLICY IF EXISTS "Reporter can view own attachments" ON public.report_attachments;

-- Biarkan siapa saja upload attachment (akan di-handle di aplikasi logic)
CREATE POLICY "Anyone can insert attachments"
ON public.report_attachments FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Untuk SELECT attachments, kita handle via service role di server side
CREATE POLICY "Anyone can view attachments"
ON public.report_attachments FOR SELECT
TO anon, authenticated
USING (true);
