import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/**
 * Sends the download link email via Brevo (server-side only).
 *
 * Supabase Dashboard → Edge Functions → Secrets:
 * - BREVO_API_KEY
 * - BREVO_SENDER_EMAIL (verified sender in Brevo)
 * - BREVO_SENDER_NAME (optional)
 * - PUBLIC_SITE_URL (no trailing slash). Prefer origin only, e.g. https://user.github.io, with
 *   PUBLIC_APP_PATH_PREFIX set to the repo segment; or set PUBLIC_SITE_URL to the full app base
 *   (origin + repo path) and leave PUBLIC_APP_PATH_PREFIX unset — never duplicate the repo path.
 * - PUBLIC_APP_PATH_PREFIX (optional). Unset = `{PUBLIC_SITE_URL}/download/...`.
 *   Set to `easy-ebook-giveaways` if the SPA base is that path (matches VITE_BASE_PATH).
 * - SUPABASE_SERVICE_ROLE_KEY
 *
 * Database: run migration `20260426140000_download_tokens_email_tracking.sql`
 * (columns email_sent_at, email_send_locked_at + RPC try_lock_download_email_send).
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

function buildDownloadUrlPathPrefix(): string {
  const raw = Deno.env.get('PUBLIC_APP_PATH_PREFIX');
  if (raw === undefined) {
    return '';
  }
  const trimmed = raw.trim();
  if (trimmed === '' || trimmed === '/') {
    return '';
  }
  return `/${trimmed.replace(/^\/+|\/+$/g, '')}`;
}

function buildPublicDownloadBaseUrl(publicSiteUrl: string, pathPrefix: string): string {
  const site = publicSiteUrl.replace(/\/$/, '');
  if (!pathPrefix) return site;
  if (site.endsWith(pathPrefix)) {
    return site;
  }
  return `${site}${pathPrefix}`;
}

/** Simple per-IP sliding window (best-effort; resets on isolate cold start). */
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 40;
const ipHits = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const xf = req.headers.get('x-forwarded-for');
  if (xf) {
    return xf.split(',')[0].trim();
  }
  return req.headers.get('cf-connecting-ip') ?? 'unknown';
}

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_WINDOW_MS;
  const arr = (ipHits.get(ip) ?? []).filter((t) => t > windowStart);
  if (arr.length >= RATE_MAX) {
    return false;
  }
  arr.push(now);
  ipHits.set(ip, arr);
  return true;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const ip = getClientIp(req);
    if (!checkIpRateLimit(ip)) {
      return new Response(JSON.stringify({ error: 'Too many requests. Please try again in a minute.' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const brevoKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL');
    const senderName = Deno.env.get('BREVO_SENDER_NAME') ?? 'BookGiveaway';
    const publicSiteUrl = Deno.env.get('PUBLIC_SITE_URL')?.replace(/\/$/, '') ?? '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!brevoKey) {
      return new Response(JSON.stringify({ error: 'BREVO_API_KEY is not configured.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!senderEmail) {
      return new Response(JSON.stringify({ error: 'BREVO_SENDER_EMAIL is not configured.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (!publicSiteUrl) {
      return new Response(
        JSON.stringify({
          error:
            'PUBLIC_SITE_URL is not configured (e.g. https://yourname.github.io or http://localhost:5173).'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Supabase server configuration is missing.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { downloadToken } = await req.json();

    if (!downloadToken || typeof downloadToken !== 'string') {
      return new Response(JSON.stringify({ error: 'downloadToken is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    const { data: tokenRow, error: tokenError } = await admin
      .from('download_tokens')
      .select('id, entry_id, token, expires_at, email_sent_at, email_send_locked_at')
      .eq('token', downloadToken)
      .maybeSingle();

    if (tokenError) {
      throw tokenError;
    }

    if (!tokenRow) {
      return new Response(JSON.stringify({ error: 'Invalid download token.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (tokenRow.email_sent_at) {
      return new Response(JSON.stringify({ ok: true, alreadySent: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const expiresAt = new Date(tokenRow.expires_at);
    if (expiresAt < new Date()) {
      return new Response(JSON.stringify({ error: 'This download link has expired.' }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: gotLock, error: lockRpcError } = await admin.rpc('try_lock_download_email_send', {
      p_token_id: tokenRow.id
    });

    if (lockRpcError) {
      throw lockRpcError;
    }

    if (!gotLock) {
      const { data: again } = await admin
        .from('download_tokens')
        .select('email_sent_at, email_send_locked_at')
        .eq('id', tokenRow.id)
        .maybeSingle();

      if (again?.email_sent_at) {
        return new Response(JSON.stringify({ ok: true, alreadySent: true }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      return new Response(
        JSON.stringify({
          error: 'Another send is in progress for this link. Please try again in a moment.'
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { data: entry, error: entryError } = await admin
      .from('entries')
      .select('id, name, email, campaign_id')
      .eq('id', tokenRow.entry_id)
      .maybeSingle();

    if (entryError) {
      throw entryError;
    }

    if (!entry?.email) {
      await admin.from('download_tokens').update({ email_send_locked_at: null }).eq('id', tokenRow.id);
      return new Response(JSON.stringify({ error: 'Entry not found for this token.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: campaign, error: campaignError } = await admin
      .from('campaigns')
      .select('title')
      .eq('id', entry.campaign_id)
      .maybeSingle();

    if (campaignError) {
      await admin.from('download_tokens').update({ email_send_locked_at: null }).eq('id', tokenRow.id);
      throw campaignError;
    }

    const campaignTitle = campaign?.title ?? 'Your ebook';
    const pathPrefix = buildDownloadUrlPathPrefix();
    const appBase = buildPublicDownloadBaseUrl(publicSiteUrl, pathPrefix);
    const downloadUrl = `${appBase}/download/${encodeURIComponent(tokenRow.token)}`;

    const htmlContent = `
      <p>Hi ${escapeHtml(entry.name || 'there')},</p>
      <p>Thanks for joining the giveaway for <strong>${escapeHtml(campaignTitle)}</strong>.</p>
      <p><a href="${escapeHtml(downloadUrl)}">Download your ebook</a></p>
      <p>This link expires on ${expiresAt.toUTCString()}.</p>
      <p>You can also use the download page if the button does not work.</p>
      <p>If you did not request this, you can ignore this email.</p>
    `.trim();

    const brevoRes = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': brevoKey
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: entry.email, name: entry.name || undefined }],
        subject: `Your ebook download: ${campaignTitle}`,
        htmlContent
      })
    });

    if (!brevoRes.ok) {
      const text = await brevoRes.text();
      await admin.from('download_tokens').update({ email_send_locked_at: null }).eq('id', tokenRow.id);
      return new Response(
        JSON.stringify({
          error: 'Brevo send failed.',
          details: text.slice(0, 500)
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const sentAt = new Date().toISOString();
    const { error: markErr } = await admin
      .from('download_tokens')
      .update({ email_sent_at: sentAt, email_send_locked_at: null })
      .eq('id', tokenRow.id);

    if (markErr) {
      throw markErr;
    }

    return new Response(JSON.stringify({ ok: true, sentAt }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
