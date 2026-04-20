import { supabase } from '../../../lib/supabaseClient';

export async function uploadEbook({ file, campaignId, title }) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${campaignId}-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('ebook-files')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data, error } = await supabase
    .from('ebooks')
    .insert({
      campaign_id: campaignId,
      title: title || file.name,
      file_path: filePath,
      format: fileExt
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getEbookByCampaign(campaignId) {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('No ebook found for this campaign.');
  }

  return data;
}

export async function getEbookById(ebookId) {
  const { data, error } = await supabase
    .from('ebooks')
    .select('*')
    .eq('id', ebookId)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getDownloadUrl(value, isEbookId = false) {
  let filePath = value;

  if (isEbookId) {
    const ebook = await getEbookById(value);
    filePath = ebook.file_path;
  }

  const { data, error } = await supabase.storage
    .from('ebook-files')
    .createSignedUrl(filePath, 60 * 60);

  if (error) {
    throw error;
  }

  return data.signedUrl;
}