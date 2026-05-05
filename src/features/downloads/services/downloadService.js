import { supabase } from '../../../lib/supabaseClient';

const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

/**
 * Supabase throws FunctionsHttpError with message "Edge Function returned a non-2xx status code"
 * while the JSON body lives on error.context (Response). Parse it so users see the real reason.
 */
async function readFunctionsErrorMessage(error, data) {
  if (data && typeof data === 'object' && 'error' in data && data.error) {
    return String(data.error);
  }

  const ctx = error?.context;
  if (ctx && typeof ctx.clone === 'function') {
    const status = typeof ctx.status === 'number' ? ctx.status : '';
    const statusBit = status ? ` (HTTP ${status})` : '';

    try {
      const clone = ctx.clone();
      const ct = clone.headers?.get?.('Content-Type') ?? '';
      if (ct.includes('application/json')) {
        const body = await clone.json();
        if (body?.error) {
          return `${String(body.error)}${statusBit}`;
        }
      } else {
        const text = (await clone.text()).trim();
        if (text) {
          try {
            const parsed = JSON.parse(text);
            if (parsed?.error) {
              return `${String(parsed.error)}${statusBit}`;
            }
          } catch {
            return `${text.slice(0, 500)}${statusBit}`;
          }
        }
      }
    } catch {
      /* ignore */
    }

    if (status) {
      return `${error?.message || 'Failed to resolve download.'}${statusBit}`;
    }
  }

  return error?.message || 'Failed to resolve download.';
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

  /**
   * Public download links must work for everyone. Logged-in authors can have an expired
   * session JWT; the shared client would send that to Edge Functions and the gateway may
   * reject the call before resolve-download runs. Force the anon key like an anonymous reader.
   */
  const { data, error } = await supabase.functions.invoke('resolve-download', {
    body: { token: normalized },
    headers:
      anonKey != null && anonKey !== ''
        ? {
            Authorization: `Bearer ${anonKey}`
          }
        : undefined
  });

  if (error) {
    throw new Error(await readFunctionsErrorMessage(error, data));
  }

  if (!data?.signedUrl && !data?.signed_url) {
    throw new Error(data?.error || 'Failed to prepare your download.');
  }

  return normalizeDownloadResponse(data);
}