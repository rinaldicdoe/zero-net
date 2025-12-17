
-- TEMPORARY: Disable RLS for testing
-- Jalankan ini di Supabase SQL Editor untuk testing

ALTER TABLE public.reports DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_attachments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_feedback DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.fai_filantropi DISABLE ROW LEVEL SECURITY;

-- Setelah testing berhasil, kita akan enable lagi dan fix policy yang benar
