import { supabase } from '../../../lib/supabaseClient';

export async function getCampaignAnalytics({ campaignId, userId }) {
  if (!campaignId || !userId) {
    return {
      pageViews: 0,
      entries: 0,
      downloads: 0
    };
  }

  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('id, user_id, page_views')
    .eq('id', campaignId)
    .eq('user_id', userId)
    .maybeSingle();

  if (campaignError) {
    throw campaignError;
  }

  if (!campaign) {
    throw new Error('Campaign not found for the logged-in user.');
  }

  const { count: entriesCount, error: entriesError } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId);

  if (entriesError) {
    throw entriesError;
  }

  const { data: downloadTokens, error: downloadsError } = await supabase
    .from('download_tokens')
    .select('download_count')
    .eq('campaign_id', campaignId);

  if (downloadsError) {
    throw downloadsError;
  }

  const downloads = (downloadTokens ?? []).reduce(
    (sum, token) => sum + (token.download_count ?? 0),
    0
  );

  return {
    pageViews: campaign.page_views ?? 0,
    entries: entriesCount ?? 0,
    downloads
  };
}
