import { supabase } from '../../../lib/supabaseClient';

const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '') ?? '';

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

function normalizeDownloadResponse(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  return {
    signedUrl: data.signedUrl ?? data.signed_url,
    expiresAt: data.expiresAt ?? data.expires_at,
    maxDownloads: data.maxDownloads ?? data.max_downloads,
    downloadCount: data.downloadCount ?? data.download_count,
    ebookTitle: data.ebookTitle ?? data.ebook_title ?? null,
    ebookFormat: data.ebookFormat ?? data.ebook_format,
    suggestedFileName: data.suggestedFileName ?? data.suggested_file_name,
    campaignId: data.campaignId ?? data.campaign_id ?? null,
    ebookId: data.ebookId ?? data.ebook_id ?? null,
    coverSignedUrl: data.coverSignedUrl ?? data.cover_signed_url ?? null,
    coverPublicUrl: data.coverPublicUrl ?? data.cover_public_url ?? null,
    coverImagePath: data.coverImagePath ?? data.cover_image_path ?? null
  };
}

/** Client fallback when the Edge Function is not yet returning cover fields. */
export async function fetchCoverPathForCampaign(campaignId) {
  if (!campaignId) {
    return null;
  }

  const { data, error } = await supabase
    .from('ebooks')
    .select('cover_image_path')
    .eq('campaign_id', campaignId)
    .order('created_at', { ascending: false })
    .limit(20);

  if (error || !data?.length) {
    return null;
  }

  for (const row of data) {
    const p = row.cover_image_path?.trim?.();
    if (p) {
      return p;
    }
  }

  return null;
}

export async function resolveDownload(token) {
  const raw = typeof token === 'string' ? token.trim() : token;
  let normalized = raw;
  if (typeof raw === 'string' && raw.includes('%')) {
    try {
      normalized = decodeURIComponent(raw);
    } catch {
      normalized = raw;
    }
  }

  if (!supabaseUrl || !anonKey) {
    throw new Error('Missing Supabase URL or anon key (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY).');
  }

  /**
   * Call the Edge Function with plain fetch + anon JWT for both Authorization and apikey.
   * `supabase.functions.invoke` goes through the client fetch layer, which can still attach a
   * user session in some environments (e.g. in-app browsers from mail clients) and produce HTTP 401.
   */
  const res = await fetch(`${supabaseUrl}/functions/v1/resolve-download`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`
    },
    body: JSON.stringify({ token: normalized })
  });

  const ct = res.headers.get('Content-Type') ?? '';
  let payload = null;
  try {
    payload = ct.includes('application/json') ? await res.json() : await res.text();
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const statusBit = ` (HTTP ${res.status})`;
    let msg = `Failed to resolve download${statusBit}`;
    if (payload && typeof payload === 'object' && payload.error) {
      msg = `${String(payload.error)}${statusBit}`;
    } else if (typeof payload === 'string' && payload.trim()) {
      try {
        const parsed = JSON.parse(payload);
        if (parsed?.error) {
          msg = `${String(parsed.error)}${statusBit}`;
        } else {
          msg = `${payload.trim().slice(0, 400)}${statusBit}`;
        }
      } catch {
        msg = `${payload.trim().slice(0, 400)}${statusBit}`;
      }
    }
    throw new Error(msg);
  }

  const data = payload && typeof payload === 'object' ? payload : {};
  if (!data.signedUrl && !data.signed_url) {
    throw new Error(data.error || 'Failed to prepare your download.');
  }

  return normalizeDownloadResponse(data);
}