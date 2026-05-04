/**
 * @param {Record<string, unknown>} baseCampaign Display-ready campaign (title, description, book cover, etc.)
 * @param {null | { headline?: string; subheadline?: string; authorBio?: string; accentColor?: string }} landingForm Last saved landing-page form payload
 */
export function mergeLandingPageIntoCampaign(baseCampaign, landingForm) {
  if (!landingForm) {
    return baseCampaign;
  }

  const headline = landingForm.headline?.trim();
  const subheadline = landingForm.subheadline?.trim();

  return {
    ...baseCampaign,
    title: headline || baseCampaign.title,
    description: subheadline || baseCampaign.description,
    authorBio: landingForm.authorBio ?? '',
    accentColor: landingForm.accentColor || '#d946ef'
  };
}

/** Map DB / display campaign fields into the landing page editor shape. */
export function campaignToLandingFormDefaults(campaign) {
  if (!campaign) {
    return {
      headline: '',
      subheadline: '',
      authorBio: '',
      accentColor: '#d946ef'
    };
  }

  return {
    headline: campaign.title ?? '',
    subheadline: campaign.description ?? '',
    authorBio: campaign.author_bio ?? campaign.authorBio ?? '',
    accentColor: campaign.accent_color ?? campaign.accentColor ?? '#d946ef'
  };
}
