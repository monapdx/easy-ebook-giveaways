import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
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

function generateTokenString() {
  return crypto.randomUUID();
}

function escapeHtml(value: string) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      status: 200,
      headers: corsHeaders
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ ok: false, error: 'Method not allowed. Use POST.' }, 405);
  }

  try {
    const brevoKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL');
    const senderName = Deno.env.get('BREVO_SENDER_NAME') ?? 'Easy Ebook Giveaways';
    const publicSiteUrl = Deno.env.get('PUBLIC_SITE_URL')?.replace(/\/$/, '');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!brevoKey || !senderEmail || !publicSiteUrl || !supabaseUrl || !serviceRoleKey) {
      return jsonResponse(
        {
          ok: false,
          error:
            'Missing required secrets: BREVO_API_KEY, BREVO_SENDER_EMAIL, PUBLIC_SITE_URL, SUPABASE_URL, or SUPABASE_SERVICE_ROLE_KEY.'
        },
        500
      );
    }

    const body = await req.json().catch(() => ({}));

    const entryId = body?.entry_id;
    const campaignId = body?.campaign_id;
    const email =
      typeof body?.email === 'string'
        ? body.email.trim().toLowerCase()
        : '';

    const hasEntryId = Boolean(entryId);
    const hasCampaignAndEmail = Boolean(campaignId && email);

    if (!hasEntryId && !hasCampaignAndEmail) {
      return jsonResponse(
        { ok: false, error: 'Provide either entry_id OR campaign_id + email.' },
        400
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    let entryQuery = admin
      .from('entries')
      .select('id, campaign_id, name, email, created_at');

    if (hasEntryId) {
      entryQuery = entryQuery.eq('id', entryId);
    } else {
      entryQuery = entryQuery
        .eq('campaign_id', campaignId)
        .eq('email', email);
    }

    const { data: entry, error: entryError } = await entryQuery
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (entryError) throw entryError;

    if (!entry) {
      return jsonResponse({ ok: false, error: 'Entry not found.' }, 404);
    }

    const { data: campaign, error: campaignError } = await admin
      .from('campaigns')
      .select('id, title')
      .eq('id', entry.campaign_id)
      .maybeSingle();

    if (campaignError) throw campaignError;

    if (!campaign) {
      return jsonResponse(
        { ok: false, error: 'Campaign not found for this entry.' },
        404
      );
    }

    const { data: ebook, error: ebookError } = await admin
      .from('ebooks')
      .select('id, title, file_path')
      .eq('campaign_id', campaign.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (ebookError) throw ebookError;

    if (!ebook) {
      return jsonResponse(
        { ok: false, error: 'No ebook is attached to this campaign yet.' },
        400
      );
    }

    if (!ebook.file_path) {
      return jsonResponse(
        { ok: false, error: 'The ebook exists, but it does not have a file_path.' },
        400
      );
    }

    const nowIso = new Date().toISOString();

    const { data: existingToken, error: tokenLookupError } = await admin
      .from('download_tokens')
      .select('*')
      .eq('entry_id', entry.id)
      .eq('ebook_id', ebook.id)
      .gt('expires_at', nowIso)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tokenLookupError) throw tokenLookupError;

    let tokenRow = existingToken;

    if (
      !tokenRow ||
      Number(tokenRow.download_count ?? 0) >= Number(tokenRow.max_downloads ?? 3)
    ) {
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      const { data: createdToken, error: createTokenError } = await admin
        .from('download_tokens')
        .insert({
          campaign_id: campaign.id,
          entry_id: entry.id,
          ebook_id: ebook.id,
          token: generateTokenString(),
          expires_at: expiresAt,
          max_downloads: 3,
          download_count: 0
        })
        .select('*')
        .single();

      if (createTokenError) throw createTokenError;

      tokenRow = createdToken;
    }

    const pathPrefix = buildDownloadUrlPathPrefix();
    const downloadUrl = `${publicSiteUrl}${pathPrefix ? `${pathPrefix}/` : ''}download/${encodeURIComponent(tokenRow.token)}`;

    const htmlContent = `
      <p>Hi ${escapeHtml(entry.name || 'there')},</p>

      <p>
        Thanks for requesting
        <strong>${escapeHtml(campaign.title || ebook.title || 'your ebook')}</strong>.
      </p>

      <p>
        <a href="${escapeHtml(downloadUrl)}"
           style="display:inline-block;padding:12px 18px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
          Download your ebook
        </a>
      </p>

      <p>If the button does not work, copy and paste this URL:</p>

      <p>
        <a href="${escapeHtml(downloadUrl)}">${escapeHtml(downloadUrl)}</a>
      </p>

      <p>This link expires on ${escapeHtml(new Date(tokenRow.expires_at).toUTCString())}.</p>
    `.trim();

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': brevoKey
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: [
          {
            email: entry.email,
            name: entry.name || undefined
          }
        ],
        subject: `Your ebook download link: ${campaign.title || ebook.title || 'Ebook'}`,
        htmlContent,
        headers: {
          'X-Mailin-Track': '0',
          'X-Mailin-Track-Click': '0',
          'X-Mailin-Track-Opens': '0'
        }
      })
    });

    if (!brevoResponse.ok) {
      const details = (await brevoResponse.text()).slice(0, 1000);

      return jsonResponse(
        {
          ok: false,
          error: 'Failed to send email via Brevo.',
          details
        },
        502
      );
    }

    return jsonResponse(
      {
        ok: true,
        message: 'Download email sent successfully.',
        entry_id: entry.id,
        campaign_id: campaign.id,
        ebook_id: ebook.id,
        token: tokenRow.token,
        download_url: downloadUrl,
        token_expires_at: tokenRow.expires_at
      },
      200
    );
  } catch (err) {
    return jsonResponse(
      {
        ok: false,
        error: err instanceof Error ? err.message : String(err)
      },
      500
    );
  }
});