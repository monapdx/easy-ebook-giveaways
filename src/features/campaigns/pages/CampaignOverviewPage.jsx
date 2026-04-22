import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampaignHeader from '../components/CampaignHeader';
import Card from '../../../components/ui/Card';
import EbookUploadForm from '../../ebooks/forms/EbookUploadForm';
import { getCampaignById } from '../services/campaignService';
import { getEbookByCampaign } from '../../ebooks/services/ebookService';

function formatEbookFormat(format) {
  if (!format) {
    return 'Unknown';
  }

  return format.replace(/^\./, '').toUpperCase();
}

function formatUploadDate(value) {
  if (!value) {
    return 'Not available';
  }

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium'
  }).format(new Date(value));
}

export default function CampaignOverviewPage() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [attachedEbook, setAttachedEbook] = useState(null);
  const [ebookError, setEbookError] = useState('');
  const [ebookLoading, setEbookLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    setCampaign(null);
    setAttachedEbook(null);
    setError('');
    setEbookError('');
    setEbookLoading(true);

    async function loadCampaignOverview() {
      const [campaignResult, ebookResult] = await Promise.allSettled([
        getCampaignById(campaignId),
        getEbookByCampaign(campaignId)
      ]);

      if (!isMounted) return;

      if (campaignResult.status === 'rejected') {
        setError(campaignResult.reason?.message || 'Failed to load campaign.');
        setEbookLoading(false);
        return;
      }

      setCampaign(campaignResult.value);

      if (ebookResult.status === 'fulfilled') {
        setAttachedEbook(ebookResult.value);
      } else {
        setEbookError(ebookResult.reason?.message || 'Failed to load attached ebook.');
      }

      setEbookLoading(false);
    }

    loadCampaignOverview();

    return () => {
      isMounted = false;
    };
  }, [campaignId]);

  function handleEbookUpload(uploadedEbook) {
    setAttachedEbook(uploadedEbook);
    setEbookError('');
    setEbookLoading(false);
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!campaign) {
    return <p>Loading campaign...</p>;
  }

  return (
    <div className="stack-lg">
      <CampaignHeader campaign={campaign} />

      <div className="grid-3">
        <Card>
          <strong>Status</strong>
          <p>{campaign.status}</p>
        </Card>
        <Card>
          <strong>Entries</strong>
          <p>{campaign.entries ?? 0}</p>
        </Card>
        <Card>
          <strong>Downloads</strong>
          <p>{campaign.downloads ?? 0}</p>
        </Card>
      </div>

      <Card>
        <div className="stack">
          <div>
            <strong>Attached Ebook</strong>
            <p style={{ marginBottom: 0 }}>
              Shows the ebook currently linked to this campaign.
            </p>
          </div>

          {ebookLoading ? <p style={{ margin: 0 }}>Loading attached ebook...</p> : null}

          {!ebookLoading && ebookError ? <p style={{ margin: 0 }}>{ebookError}</p> : null}

          {!ebookLoading && !ebookError && attachedEbook ? (
            <div className="grid-3">
              <div>
                <strong>Title</strong>
                <p>{attachedEbook.title}</p>
              </div>
              <div>
                <strong>Format</strong>
                <p>{formatEbookFormat(attachedEbook.format)}</p>
              </div>
              <div>
                <strong>Uploaded</strong>
                <p>{formatUploadDate(attachedEbook.created_at)}</p>
              </div>
            </div>
          ) : null}

          {!ebookLoading && !ebookError && !attachedEbook ? (
            <p style={{ margin: 0 }}>
              No ebook is attached yet. Upload one below to link it to this campaign.
            </p>
          ) : null}
        </div>
      </Card>

      <EbookUploadForm campaignId={campaign.id} onUploadComplete={handleEbookUpload} />
    </div>
  );
}
