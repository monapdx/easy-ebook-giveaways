-- Tracks successful Brevo sends and short-lived send locks to prevent duplicate / parallel sends.
ALTER TABLE download_tokens
  ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_send_locked_at TIMESTAMPTZ;

COMMENT ON COLUMN download_tokens.email_sent_at IS 'Set when Brevo successfully sent the download email for this token.';
COMMENT ON COLUMN download_tokens.email_send_locked_at IS 'Short-lived lock while an email send is in progress.';

-- Serialized "claim" for sending so two concurrent invocations do not double-email.
CREATE OR REPLACE FUNCTION public.try_lock_download_email_send(p_token_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  updated int;
BEGIN
  UPDATE download_tokens
  SET email_send_locked_at = now()
  WHERE id = p_token_id
    AND email_sent_at IS NULL
    AND (
      email_send_locked_at IS NULL
      OR email_send_locked_at < now() - interval '2 minutes'
    );
  GET DIAGNOSTICS updated = ROW_COUNT;
  RETURN updated > 0;
END;
$$;

REVOKE ALL ON FUNCTION public.try_lock_download_email_send(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.try_lock_download_email_send(uuid) TO service_role;
