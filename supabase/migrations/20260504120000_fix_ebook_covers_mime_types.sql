-- Bucket allowlist used invalid types (e.g. img/png); browsers send image/png and uploads failed.
UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/x-png',
  'image/pjpeg'
]::text[]
WHERE id = 'ebook-covers';
