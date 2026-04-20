import { supabase } from '../../../lib/supabaseClient';

function generateTokenString() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `dl_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export async function createDownloadToken({ campaignId, entryId }) {
  const { data: ebook, error: ebookError } = await supabase
    .from('ebooks')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (ebookError) {
    throw ebookError;
  }

  if (!ebook) {
    throw new Error(
      'No ebook is attached to this campaign yet. Upload an ebook before testing downloads.'
    );
  }

  const tokenValue = generateTokenString();
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString();

  const { data, error } = await supabase
    .from('download_tokens')
    .insert({
      campaign_id: campaignId,
      entry_id: entryId,
      ebook_id: ebook.id,
      token: tokenValue,
      expires_at: expiresAt,
      max_downloads: 3,
      download_count: 0
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data.token;
}

export async function getValidDownloadToken(token) {
  const { data, error } = await supabase
    .from('download_tokens')
    .select('*')
    .eq('token', token)
    .single();

  if (error) {
    throw error;
  }

  const now = new Date();
  const expiresAt = new Date(data.expires_at);

  if (expiresAt < now) {
    throw new Error('This download link has expired.');
  }

  if (data.download_count >= data.max_downloads) {
    throw new Error('This download link has reached its download limit.');
  }

  return data;
}

export async function incrementDownloadCount(downloadTokenId, currentCount) {
  const { error } = await supabase
    .from('download_tokens')
    .update({
      download_count: currentCount + 1
    })
    .eq('id', downloadTokenId);

  if (error) {
    throw error;
  }
}