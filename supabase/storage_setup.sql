
-- 1. Enable Storage
-- Make sure the storage extension is enabled (usually default in Supabase)

-- 2. Create the 'attachments' bucket
-- We create a PRIVATE bucket for security, but we will allow public uploads.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('attachments', 'attachments', false, 5242880, '{image/*,application/pdf}'); 
-- 5MB limit, images and pdfs only

-- 3. Storage Policies

-- Allow ANYONE (including anonymous) to UPLOAD files to the 'attachments' bucket
CREATE POLICY "Public Uploads" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'attachments' );

-- Allow Signed URL access / Authenticated access
-- For Anon reporters tracking via Ticket Code, the system (Server Actions) can generate Signed URLs.
-- So we don't necessarily need a public SELECT policy if we use Signed URLs in the frontend.
-- But if you want to allow direct viewing if they have the link (Public Read), set 'public' to true in step 2.
-- STRICT MODE (Recommended):
CREATE POLICY "Authenticated Select"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'attachments' );

-- Give Admins full control (if you have a Service Role or Admin usage)
-- Usually Service Role bypasses RLS, so this might be redundant for backend admin actions.
