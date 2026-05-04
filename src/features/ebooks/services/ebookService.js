import { supabase } from '../../../lib/supabaseClient';

const COVER_BUCKET = 'ebook-covers';
const EBOOK_BUCKET = 'ebook-files';

const ALLOWED_COVER_MIMES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif'
]);

/** Browsers/OSes sometimes send legacy or empty types for valid PNG/JPEG files. */
const COVER_MIME_ALIASES = {
  'image/x-png': 'image/png',
  'image/pjpeg': 'image/jpeg'
};

const COVER_EXT_TO_MIME = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif'
};

function getCanonicalCoverMime(file) {
  const raw = (file.type || '').trim().toLowerCase();
  const fromType = COVER_MIME_ALIASES[raw] || raw;
  if (fromType && ALLOWED_COVER_MIMES.has(fromType)) {
    return fromType;
  }
  const ext = (file.name.split('.').pop() || '').toLowerCase();
  return COVER_EXT_TO_MIME[ext] || null;
}

export function getEbookCoverPublicUrl(coverImagePath) {
  if (!coverImagePath) {
    return null;
  }
  const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(coverImagePath);
  return data?.publicUrl ?? null;
}

function assertValidCoverFile(file) {
  if (!file || !getCanonicalCoverMime(file)) {
    throw new Error('Cover must be a JPEG, PNG, WebP, or GIF image.');
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Cover image must be 10 MB or smaller.');
  }
}

async function uploadCoverToStorage(coverFile, campaignId) {
  assertValidCoverFile(coverFile);
  const mime = getCanonicalCoverMime(coverFile);
  const extFromName = (coverFile.name.split('.').pop() || '').toLowerCase();
  const ext =
    extFromName && COVER_EXT_TO_MIME[extFromName]
      ? extFromName
      : mime === 'image/png'
        ? 'png'
        : mime === 'image/webp'
          ? 'webp'
          : mime === 'image/gif'
            ? 'gif'
            : 'jpg';
  const path = `${campaignId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(path, coverFile, { contentType: mime });

  if (uploadError) {
    throw uploadError;
  }

  return path;
}

export async function uploadEbook({ file, coverFile, campaignId, title }) {
  let coverPath = null;
  let ebookPath = null;

  try {
    if (coverFile) {
      coverPath = await uploadCoverToStorage(coverFile, campaignId);
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${campaignId}-${Date.now()}.${fileExt}`;
    ebookPath = fileName;

    const { error: uploadError } = await supabase.storage
      .from(EBOOK_BUCKET)
      .upload(ebookPath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data, error } = await supabase
      .from('ebooks')
      .insert({
        campaign_id: campaignId,
        title: title || file.name,
        file_path: ebookPath,
        format: fileExt,
        cover_image_path: coverPath
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (err) {
    if (coverPath) {
      await supabase.storage.from(COVER_BUCKET).remove([coverPath]);
    }
    if (ebookPath) {
      await supabase.storage.from(EBOOK_BUCKET).remove([ebookPath]);
    }
    throw err;
  }
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

  return data ?? null;
}
