-- Ebook cover images: metadata on ebooks + public storage bucket with owner-scoped paths.

ALTER TABLE public.ebooks
  ADD COLUMN IF NOT EXISTS cover_image_path text;

INSERT INTO storage.buckets (id, name, public)
VALUES ('ebook-covers', 'ebook-covers', true)
ON CONFLICT (id) DO UPDATE SET public = excluded.public;

-- Public landing pages read cover objects (bucket is public; RLS still governs object access).
DROP POLICY IF EXISTS "ebook_covers_select_public" ON storage.objects;
CREATE POLICY "ebook_covers_select_public"
ON storage.objects FOR SELECT
USING (bucket_id = 'ebook-covers');

DROP POLICY IF EXISTS "ebook_covers_insert_owner" ON storage.objects;
CREATE POLICY "ebook_covers_insert_owner"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'ebook-covers'
  AND array_length(string_to_array(name, '/'), 1) >= 2
  AND EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = (string_to_array(name, '/'))[1]::uuid
      AND c.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "ebook_covers_update_owner" ON storage.objects;
CREATE POLICY "ebook_covers_update_owner"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'ebook-covers'
  AND array_length(string_to_array(name, '/'), 1) >= 2
  AND EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = (string_to_array(name, '/'))[1]::uuid
      AND c.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "ebook_covers_delete_owner" ON storage.objects;
CREATE POLICY "ebook_covers_delete_owner"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'ebook-covers'
  AND array_length(string_to_array(name, '/'), 1) >= 2
  AND EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = (string_to_array(name, '/'))[1]::uuid
      AND c.user_id = auth.uid()
  )
);
