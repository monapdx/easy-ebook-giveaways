-- Public giveaway pages load campaigns and ebooks with the anon key; owners still use existing policies.

DROP POLICY IF EXISTS "campaigns_select_public_published" ON public.campaigns;
CREATE POLICY "campaigns_select_public_published"
ON public.campaigns
FOR SELECT
TO anon, authenticated
USING (status = 'published');

DROP POLICY IF EXISTS "ebooks_select_public_published" ON public.ebooks;
CREATE POLICY "ebooks_select_public_published"
ON public.ebooks
FOR SELECT
TO anon, authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.campaigns c
    WHERE c.id = ebooks.campaign_id AND c.status = 'published'
  )
);
