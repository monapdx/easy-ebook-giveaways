import { supabase } from '../../../lib/supabaseClient';

/**
 * Triggers the send-ebook-email Edge Function (Brevo).
 * Fails quietly for UX: entry + redirect still succeed if email fails.
 */
export async function sendDownloadLinkEmail(downloadToken) {
  if (!downloadToken) {
    return;
  }

  const { data, error } = await supabase.functions.invoke('send-ebook-email', {
    body: { downloadToken }
  });

  if (error) {
    throw new Error(error.message || 'Failed to send download email.');
  }

  if (data?.error) {
    throw new Error(data.error);
  }
}
