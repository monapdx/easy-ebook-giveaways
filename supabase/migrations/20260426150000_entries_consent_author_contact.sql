-- Affirmative consent: reader agrees ebook delivery and author may contact them.
ALTER TABLE entries
  ADD COLUMN IF NOT EXISTS consent_author_contact boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN entries.consent_author_contact IS 'User affirmed sharing email with author/creator for ebook delivery and direct contact.';
