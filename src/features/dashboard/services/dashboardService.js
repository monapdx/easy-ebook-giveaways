import { supabase } from '../../../lib/supabaseClient';

function countOrThrow(error, count, fallbackMessage) {
  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getDashboardStats(userId) {
  if (!userId) {
    return {
      activeCampaigns: 0,
      totalEntries: 0,
      downloads: 0
    };
  }

  const { count: activeCampaignsCount, error: activeCampaignsError } = await supabase
    .from('campaigns')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('status', 'published');

  const activeCampaigns = countOrThrow(
    activeCampaignsError,
    activeCampaignsCount,
    'Failed to load active campaigns.'
  );

  const { data: campaigns, error: campaignsError } = await supabase
    .from('campaigns')
    .select('id')
    .eq('user_id', userId);

  if (campaignsError) {
    throw campaignsError;
  }

  const campaignIds = (campaigns ?? []).map((campaign) => campaign.id);

  if (campaignIds.length === 0) {
    return {
      activeCampaigns,
      totalEntries: 0,
      downloads: 0
    };
  }

  const { count: totalEntriesCount, error: totalEntriesError } = await supabase
    .from('entries')
    .select('*', { count: 'exact', head: true })
    .in('campaign_id', campaignIds);

  const totalEntries = countOrThrow(
    totalEntriesError,
    totalEntriesCount,
    'Failed to load total entries.'
  );

  const { data: downloadTokens, error: downloadTokensError } = await supabase
    .from('download_tokens')
    .select('download_count')
    .in('campaign_id', campaignIds);

  if (downloadTokensError) {
    throw downloadTokensError;
  }

  const downloads = (downloadTokens ?? []).reduce(
    (sum, token) => sum + (token.download_count ?? 0),
    0
  );

  return {
    activeCampaigns,
    totalEntries,
    downloads
  };
}
