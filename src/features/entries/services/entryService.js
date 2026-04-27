import { supabase } from '../../../lib/supabaseClient';
import { createDownloadToken } from '../../downloads/services/downloadService';

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

  const { data: emailResult, error: emailError } = await supabase.functions.invoke(
    'send-download-email',
    {
      body: {
        entry_id: entry.id
      }
    }
  );

  if (emailError) {
    throw new Error(emailError.message || 'Failed to send your download email.');
  }

  if (!emailResult?.ok) {
    throw new Error(emailResult?.error || 'Failed to send your download email.');
  }

  let token = emailResult?.token;

  // Fallback for environments where send-download-email is not yet deployed
  // with the new response payload that includes `token`.
  if (!token) {
    token = await createDownloadToken({
      campaignId: payload.campaignId,
      entryId: entry.id
    });
  }

  return {
    entry,
    token
  };
}