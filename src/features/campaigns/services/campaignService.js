import { supabase } from '../../../lib/supabaseClient';
import { getEbookByCampaign, getEbookCoverPublicUrl } from '../../ebooks/services/ebookService';

export async function getCampaigns() {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const userId = session?.user?.id;

  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  const campaigns = data ?? [];

  const campaignsWithStats = await Promise.all(
    campaigns.map(async (campaign) => {
      const { count: entriesCount, error: entriesError } = await supabase
        .from('entries')
        .select('*', { count: 'exact', head: true })
        .eq('campaign_id', campaign.id);

      if (entriesError) {
        throw entriesError;
      }

      const { data: downloadTokens, error: downloadsError } = await supabase
        .from('download_tokens')
        .select('download_count')
        .eq('campaign_id', campaign.id);

      if (downloadsError) {
        throw downloadsError;
      }

      const downloads = (downloadTokens ?? []).reduce(
        (sum, token) => sum + (token.download_count ?? 0),
        0
      );

      return {
        ...campaign,
        entries: entriesCount ?? 0,
        downloads
      };
    })
  );

  return campaignsWithStats;
}

export async function getCampaignById(campaignId) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('id', campaignId)
    .single();

  if (error) {
    throw error;
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
    ...data,
    entries: entriesCount ?? 0,
    downloads
  };
}

const DEFAULT_PUBLIC_COVER =
  'https://placehold.co/300x450?text=Ebook+Cover';

export async function getCampaignBySlug(slug) {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/** Campaign row plus `bookTitle` and `coverUrl` for public giveaway UI. */
export async function getCampaignBySlugForPublic(slug) {
  const campaign = await getCampaignBySlug(slug);
  const ebook = await getEbookByCampaign(campaign.id);
  const coverUrl =
    getEbookCoverPublicUrl(ebook?.cover_image_path) ?? DEFAULT_PUBLIC_COVER;

  return {
    ...campaign,
    bookTitle: ebook?.title ?? campaign.title,
    coverUrl
  };
}

export async function createCampaign(payload) {
  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const user = session?.user;

  if (!user) {
    throw new Error(
      'No active login session found. Make sure you are logged in and, if email confirmation is enabled, confirm your email first.'
    );
  }

  const { data, error } = await supabase
  .from('campaigns')
  .insert({
    user_id: user.id,
    title: payload.title,
    slug: payload.slug,
    description: payload.description,
    status: 'published',
    giveaway_type: payload.giveawayType ?? 'instant',
    start_at: payload.startAt || null,
    end_at: payload.endAt || null
  })
  .select()
  .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteCampaign(campaignId) {
  if (!campaignId) {
    throw new Error('Campaign id is required.');
  }

  const {
    data: { session },
    error: sessionError
  } = await supabase.auth.getSession();

  if (sessionError) {
    throw sessionError;
  }

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error('You must be logged in to delete a campaign.');
  }

  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('id, user_id')
    .eq('id', campaignId)
    .eq('user_id', userId)
    .maybeSingle();

  if (campaignError) {
    throw campaignError;
  }

  if (!campaign) {
    throw new Error('Campaign not found or access denied.');
  }

  const { data: ebooks, error: ebooksError } = await supabase
    .from('ebooks')
    .select('id, file_path, cover_image_path')
    .eq('campaign_id', campaignId);

  if (ebooksError) {
    throw ebooksError;
  }

  const filePaths = (ebooks ?? []).map((ebook) => ebook.file_path).filter(Boolean);
  const coverPaths = (ebooks ?? []).map((ebook) => ebook.cover_image_path).filter(Boolean);

  if (filePaths.length > 0) {
    const { error: storageError } = await supabase.storage.from('ebook-files').remove(filePaths);
    if (storageError) {
      throw storageError;
    }
  }

  if (coverPaths.length > 0) {
    const { error: coverStorageError } = await supabase.storage
      .from('ebook-covers')
      .remove(coverPaths);
    if (coverStorageError) {
      throw coverStorageError;
    }
  }

  const { error: downloadTokensError } = await supabase
    .from('download_tokens')
    .delete()
    .eq('campaign_id', campaignId);

  if (downloadTokensError) {
    throw downloadTokensError;
  }

  const { error: entriesError } = await supabase
    .from('entries')
    .delete()
    .eq('campaign_id', campaignId);

  if (entriesError) {
    throw entriesError;
  }

  const { error: ebooksDeleteError } = await supabase
    .from('ebooks')
    .delete()
    .eq('campaign_id', campaignId);

  if (ebooksDeleteError) {
    throw ebooksDeleteError;
  }

  const { error: campaignDeleteError } = await supabase
    .from('campaigns')
    .delete()
    .eq('id', campaignId)
    .eq('user_id', userId);

  if (campaignDeleteError) {
    throw campaignDeleteError;
  }
}