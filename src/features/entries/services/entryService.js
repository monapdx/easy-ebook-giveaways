import { supabase } from '../../../lib/supabaseClient';
import { createDownloadToken } from '../../downloads/services/downloadService';

export async function submitEntry(payload) {
  const { data: entry, error } = await supabase
    .from('entries')
    .insert({
      campaign_id: payload.campaignId,
      name: payload.name,
      email: payload.email,
      consent_newsletter: payload.consentNewsletter
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  const token = await createDownloadToken({
    campaignId: payload.campaignId,
    entryId: entry.id
  });

  return {
    entry,
    token
  };
}