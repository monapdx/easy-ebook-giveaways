import { supabase } from '../../../lib/supabaseClient';

export async function getCampaigns() {
  const { data, error } = await supabase
    .from('campaigns')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
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

  return data;
}

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