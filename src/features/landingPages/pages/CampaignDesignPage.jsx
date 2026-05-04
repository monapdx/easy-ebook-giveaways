import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import SectionHeader from '../../../components/ui/SectionHeader';
import LandingPageForm from '../forms/LandingPageForm';
import GiveawayPreview from '../components/GiveawayPreview';
import { getCampaignById } from '../../campaigns/services/campaignService';
import { getEbookByCampaign, getEbookCoverPublicUrl } from '../../ebooks/services/ebookService';
import {
  campaignToLandingFormDefaults,
  mergeLandingPageIntoCampaign
} from '../utils/mergeLandingPreview';

const DEFAULT_COVER = 'https://placehold.co/300x450?text=Ebook+Cover';

function buildBasePreviewCampaign(campaign, ebook) {
  return {
    ...campaign,
    bookTitle: ebook?.title ?? campaign.title,
    coverUrl: getEbookCoverPublicUrl(ebook?.cover_image_path) ?? DEFAULT_COVER,
    authorBio: campaign.author_bio ?? campaign.authorBio ?? '',
    accentColor: campaign.accent_color ?? campaign.accentColor ?? '#d946ef'
  };
}

export default function CampaignDesignPage() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [ebook, setEbook] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [savedLanding, setSavedLanding] = useState(null);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadError('');
      setCampaign(null);
      setEbook(null);
      setSavedLanding(null);
      setSaveMessage('');

      try {
        const [cResult, eResult] = await Promise.allSettled([
          getCampaignById(campaignId),
          getEbookByCampaign(campaignId)
        ]);

        if (cancelled) return;

        if (cResult.status === 'rejected') {
          setLoadError(cResult.reason?.message || 'Failed to load campaign.');
          return;
        }

        setCampaign(cResult.value);
        if (eResult.status === 'fulfilled') {
          setEbook(eResult.value);
        } else {
          setEbook(null);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Failed to load campaign.');
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [campaignId]);

  const basePreviewCampaign = useMemo(
    () => (campaign ? buildBasePreviewCampaign(campaign, ebook) : null),
    [campaign, ebook]
  );

  const landingDefaults = useMemo(
    () => campaignToLandingFormDefaults(campaign),
    [campaign]
  );

  const previewCampaign = useMemo(() => {
    if (!basePreviewCampaign) return null;
    return mergeLandingPageIntoCampaign(basePreviewCampaign, savedLanding);
  }, [basePreviewCampaign, savedLanding]);

  const handleSaveLanding = useCallback((form) => {
    setSavedLanding(form);
    setSaveMessage('Preview updated.');
  }, []);

  if (loadError) {
    return <p>{loadError}</p>;
  }

  if (!campaign || !previewCampaign) {
    return <p>Loading design tools...</p>;
  }

  return (
    <div className="stack-lg">
      <SectionHeader
        title="Design"
        description="Edit your public giveaway page and preview it."
      />

      {saveMessage ? (
        <p style={{ margin: 0 }} role="status">
          {saveMessage}
        </p>
      ) : null}

      <LandingPageForm
        formResetKey={campaignId}
        initialValues={landingDefaults}
        onSave={handleSaveLanding}
      />

      <h3 style={{ marginBottom: 0 }}>Preview</h3>
      <p style={{ color: 'var(--muted)', marginTop: 0 }}>
        Matches your live giveaway layout. Signup is preview-only here.
      </p>
      <GiveawayPreview campaign={previewCampaign} isPreview />
    </div>
  );
}
