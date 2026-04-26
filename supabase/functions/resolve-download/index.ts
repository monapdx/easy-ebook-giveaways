import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { token } = await req.json();

    if (!token || typeof token !== 'string') {
      return new Response(JSON.stringify({ error: 'A valid token is required.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ error: 'Server is missing required configuration.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

    const { data: tokenRecord, error: tokenError } = await supabaseAdmin
      .from('download_tokens')
      .select('id, ebook_id, expires_at, max_downloads, download_count')
      .eq('token', token)
      .maybeSingle();

    if (tokenError) {
      throw tokenError;
    }

    if (!tokenRecord) {
      return new Response(JSON.stringify({ error: 'Invalid download token.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const expiresAt = new Date(tokenRecord.expires_at);
    const now = new Date();

    if (expiresAt < now) {
      return new Response(JSON.stringify({ error: 'This download link has expired.' }), {
        status: 410,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (tokenRecord.download_count >= tokenRecord.max_downloads) {
      return new Response(
        JSON.stringify({ error: 'This download link has reached its download limit.' }),
        {
          status: 410,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const nextDownloadCount = tokenRecord.download_count + 1;

    const { data: updatedRecord, error: updateError } = await supabaseAdmin
      .from('download_tokens')
      .update({ download_count: nextDownloadCount })
      .eq('id', tokenRecord.id)
      .eq('download_count', tokenRecord.download_count)
      .select('id, ebook_id, expires_at, max_downloads, download_count')
      .maybeSingle();

    if (updateError) {
      throw updateError;
    }

    if (!updatedRecord) {
      return new Response(
        JSON.stringify({
          error: 'Download token was updated by another request. Please try again.'
        }),
        {
          status: 409,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const { data: ebook, error: ebookError } = await supabaseAdmin
      .from('ebooks')
      .select('file_path')
      .eq('id', updatedRecord.ebook_id)
      .maybeSingle();

    if (ebookError) {
      throw ebookError;
    }

    if (!ebook?.file_path) {
      return new Response(JSON.stringify({ error: 'Ebook file not found for this token.' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { data: signed, error: signedUrlError } = await supabaseAdmin.storage
      .from('ebook-files')
      .createSignedUrl(ebook.file_path, 60 * 60);

    if (signedUrlError) {
      throw signedUrlError;
    }

    return new Response(
      JSON.stringify({
        signedUrl: signed.signedUrl,
        expiresAt: updatedRecord.expires_at,
        maxDownloads: updatedRecord.max_downloads,
        downloadCount: updatedRecord.download_count
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unexpected server error.';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
