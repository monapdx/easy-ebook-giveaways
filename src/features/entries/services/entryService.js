import { supabase } from '../../../lib/supabaseClient';
import { createDownloadToken } from '../../downloads/services/downloadService';
import { sendDownloadLinkEmail } from '../../email/services/emailService';

export async function getEntriesByCampaign(campaignId) {
  if (!campaignId) {
    return [];
  }

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function submitEntry(payload) {
  const insertPayload = {
    campaign_id: payload.campaignId,
    name: payload.name,
    email: payload.email,
    consent_newsletter: payload.consentNewsletter,
    consent_author_contact: payload.consentAuthorShare
  };

  let { data: entry, error } = await supabase
    .from('entries')
    .insert(insertPayload)
    .select()
    .single();

  const isMissingConsentAuthorContactColumn =
    !!error &&
    (error.code === 'PGRST204' ||
      error.message?.includes("'consent_author_contact'") ||
      error.message?.includes('schema cache'));

  // Backward-compatible fallback for environments where the migration has not run yet.
  if (isMissingConsentAuthorContactColumn) {
    const { consent_author_contact, ...fallbackPayload } = insertPayload;
    ({ data: entry, error } = await supabase
      .from('entries')
      .insert(fallbackPayload)
      .select()
      .single());
  }

  if (error) {
    throw error;
  }

  const token = await createDownloadToken({
    campaignId: payload.campaignId,
    entryId: entry.id
  });

  try {
    await sendDownloadLinkEmail(token);
  } catch (err) {
    console.warn('send-ebook-email failed:', err?.message || err);
  }

  return {
    entry,
    token
  };
}