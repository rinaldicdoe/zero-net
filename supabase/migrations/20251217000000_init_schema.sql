
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Enums
CREATE TYPE report_type_enum AS ENUM ('akademik', 'fasilitas', 'kekerasan_perundungan_pelecehan', 'administrasi');
CREATE TYPE feedback_channel_enum AS ENUM ('wa', 'dashboard', 'email');
CREATE TYPE report_status_enum AS ENUM ('masuk', 'sedang_diproses', 'terverifikasi', 'ditolak', 'selesai_tertangani');
CREATE TYPE sent_via_enum AS ENUM ('wa', 'dashboard', 'email');

-- 2. Create Tables

-- Reports Table
CREATE TABLE public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_code TEXT UNIQUE NOT NULL,
    category_column INT CHECK (category_column IN (1, 2, 3)),
    report_type report_type_enum,
    reporter_name TEXT NOT NULL,
    study_program TEXT NOT NULL,
    nim TEXT NOT NULL,
    incident_time TIMESTAMPTZ NOT NULL,
    whatsapp TEXT,
    email TEXT,
    chronology TEXT NOT NULL,
    status report_status_enum DEFAULT 'masuk',
    preferred_feedback_channel feedback_channel_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    reporter_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL -- Nullable for public reports
);

-- Report Attachments Table
CREATE TABLE public.report_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    file_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Report Feedback Table
CREATE TABLE public.report_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    admin_user_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    visible_to_reporter BOOLEAN DEFAULT TRUE,
    sent_via sent_via_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAI Filantropi Table
CREATE TABLE public.fai_filantropi (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    study_program TEXT NOT NULL,
    transfer_amount NUMERIC NOT NULL,
    transfer_proof_path TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Row Level Security (RLS) policies

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fai_filantropi ENABLE ROW LEVEL SECURITY;

-- Reports Policies
-- Reporter can view their own reports (if logged in)
CREATE POLICY "Reporter can view own reports"
ON public.reports FOR SELECT
TO authenticated
USING (auth.uid() = reporter_user_id);

-- Reporter can insert reports (allow anyone to insert? or just authenticated? Prompt says public pelapor options)
-- We'll allow public insert because "tanpa login" is an option.
CREATE POLICY "Public can insert reports"
ON public.reports FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Admins can do everything
-- Note: In a real app we'd have a roles table. Ideally strictly check a role. 
-- For now, we'll assume admins have a specific email domain or we manually assign a role.
-- Or we just assume Service Role usage for Admin Dashboard in Next.js.
-- Let's add a basic check assuming all authenticated users aren't admins. 
-- For simplicity in this SQL, I'll rely on the app logic or service role usage for Admin tasks. 
-- But I will add a policy allowing full access if the user metadata has role 'admin'.

-- (Optional) Policy for admin if we use client-side fetching for admin
-- CREATE POLICY "Admins full access" ON public.reports FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Attachments Policies
-- Viewable by owner of report (complex join needed in RLS or handled via storage buckets mostly)
-- Storage objects are separate. This table just tracks them.

CREATE POLICY "Reporter can view own attachments"
ON public.report_attachments FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.reports R 
        WHERE R.id = report_attachments.report_id 
        AND R.reporter_user_id = auth.uid()
    )
);

-- Feedback Policies
CREATE POLICY "Reporter can view feedback"
ON public.report_feedback FOR SELECT
TO authenticated
USING (
    visible_to_reporter = true
    AND EXISTS (
        SELECT 1 FROM public.reports R 
        WHERE R.id = report_feedback.report_id 
        AND R.reporter_user_id = auth.uid()
    )
);

-- 4. Storage Buckets (Concept for Setup)
-- Insert a row into storage.buckets if needed or rely on dashboard setup.
-- INSERT INTO storage.buckets (id, name, public) VALUES ('attachments', 'attachments', false);
-- Policy for storage.objects...
