-- Atomic increment for resolve-download: avoids 409 races when two requests
-- hit the same token (e.g. React StrictMode double-invoking useEffect).

CREATE OR REPLACE FUNCTION public.claim_download_resolution(token_param text)
RETURNS TABLE (
  id uuid,
  ebook_id uuid,
  expires_at timestamptz,
  max_downloads int,
  download_count int
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE download_tokens dt
  SET download_count = dt.download_count + 1
  WHERE dt.token = token_param
    AND dt.expires_at > now()
    AND dt.download_count < dt.max_downloads
  RETURNING dt.id, dt.ebook_id, dt.expires_at, dt.max_downloads, dt.download_count;
$$;

REVOKE ALL ON FUNCTION public.claim_download_resolution(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_download_resolution(text) TO service_role;
