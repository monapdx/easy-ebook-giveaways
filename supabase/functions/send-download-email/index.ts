import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const DEFAULT_PUBLIC_SITE_URL = 'https://easyebookgiveaways.com';

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

function normalizePublicSiteUrl(rawValue: string | undefined): string {
  const raw = rawValue?.trim() ?? '';

  // Guard against placeholder values accidentally saved as secrets.
  if (!raw || raw.toLowerCase() === 'public_site_url') {
    return DEFAULT_PUBLIC_SITE_URL;
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/$/, '');
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const brevoKey = Deno.env.get('BREVO_API_KEY');
    const senderEmail = Deno.env.get('BREVO_SENDER_EMAIL');
    const senderName = Deno.env.get('BREVO_SENDER_NAME') ?? 'BookGiveaway';
    const publicSiteUrl = normalizePublicSiteUrl(Deno.env.get('PUBLIC_SITE_URL'));
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!brevoKey || !senderEmail || !supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          ok: false,
          error:
            'Function is missing one or more required secrets: BREVO_API_KEY, BREVO_SENDER_EMAIL, SUPABASE_SERVICE_ROLE_KEY.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const body = await req.json();
    const entryId = body?.entry_id;
    const campaignId = body?.campaign_id;
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';

    const hasEntryId = !!entryId;
    const hasCampaignAndEmail = !!campaignId && !!email;

    if (!hasEntryId && !hasCampaignAndEmail) {
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Provide either entry_id OR campaign_id + email.'
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const admin = createClient(supabaseUrl, serviceRoleKey);

    let entryQuery = admin.from('entries').select('id, campaign_id, name, email');
    if (hasEntryId) {
      entryQuery = entryQuery.eq('id', entryId);
    } else {
      entryQuery = entryQuery.eq('campaign_id', campaignId).eq('email', email);
    }

    const { data: entry, error: entryError } = await entryQuery
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (entryError) {
      throw entryError;
    }

    if (!entry) {
      return new Response(JSON.stringify({ ok: false, error: 'Entry not found.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: campaign, error: campaignError } = await admin
      .from('campaigns')
      .select('id, title')
      .eq('id', entry.campaign_id)
      .maybeSingle();

    if (campaignError) {
      throw campaignError;
    }

    if (!campaign) {
      return new Response(JSON.stringify({ ok: false, error: 'Campaign not found for this entry.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const nowIso = new Date().toISOString();
    const { data: existingToken, error: tokenLookupError } = await admin
      .from('download_tokens')
      .select('*')
      .eq('entry_id', entry.id)
      .gt('expires_at', nowIso)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (tokenLookupError) {
      throw tokenLookupError;
    }

    let tokenRow = existingToken;

    if (!tokenRow || tokenRow.download_count >= tokenRow.max_downloads) {
      const { data: ebook, error: ebookError } = await admin
        .from('ebooks')
        .select('id')
        .eq('campaign_id', campaign.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (ebookError) {
        throw ebookError;
      }

      if (!ebook) {
        return new Response(
          JSON.stringify({
            ok: false,
            error: 'No ebook is attached to this campaign yet.'
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }

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

      if (createTokenError) {
        throw createTokenError;
      }

      tokenRow = createdToken;
    }

    const pathPrefix = buildDownloadUrlPathPrefix();
    const downloadPath = `${pathPrefix ? `${pathPrefix}/` : '/'}download/${encodeURIComponent(tokenRow.token)}`;
    const downloadUrl = `${publicSiteUrl}${downloadPath}`;

    const htmlContent = `
      <p>Hi ${escapeHtml(entry.name || 'there')},</p>
      <p>Thanks for requesting <strong>${escapeHtml(campaign.title || 'your ebook')}</strong>.</p>
      <p>Open your browser and go to this path on our site:</p>
      <p><code>${escapeHtml(downloadPath)}</code></p>
      <p>Then paste this full URL if needed:</p>
      <p><code>${escapeHtml(downloadUrl)}</code></p>
      <p>This link expires on ${new Date(tokenRow.expires_at).toUTCString()}.</p>
    `.trim();

    const textContent = [
      `Hi ${entry.name || 'there'},`,
      `Thanks for requesting ${campaign.title || 'your ebook'}.`,
      `Download path: ${downloadPath}`,
      `Full URL: ${downloadUrl}`,
      `This link expires on ${new Date(tokenRow.expires_at).toUTCString()}.`
    ].join('\n');

    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'api-key': brevoKey
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: entry.email, name: entry.name || undefined }],
        subject: `Your ebook download link: ${campaign.title || 'Ebook'}`,
        htmlContent,
        textContent,
        headers: {
          'X-Mailin-Track': '0',
          'X-Mailin-Track-Click': '0',
          'X-Mailin-Track-Opens': '0'
        }
      })
    });

    if (!brevoResponse.ok) {
      const details = (await brevoResponse.text()).slice(0, 500);
      return new Response(
        JSON.stringify({
          ok: false,
          error: 'Failed to send email via Brevo.',
          details
        }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: 'Download email sent successfully.',
        entry_id: entry.id,
        token: tokenRow.token,
        download_path: downloadPath,
        download_url: downloadUrl,
        token_expires_at: tokenRow.expires_at
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.';
    return new Response(JSON.stringify({ ok: false, error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
