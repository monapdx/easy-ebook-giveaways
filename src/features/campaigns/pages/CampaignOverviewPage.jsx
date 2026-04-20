import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import CampaignHeader from '../components/CampaignHeader';
import Card from '../../../components/ui/Card';
import EbookUploadForm from '../../ebooks/forms/EbookUploadForm';
import { getCampaignById } from '../services/campaignService';

export default function CampaignOverviewPage() {
  const { campaignId } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCampaign() {
      try {
        const data = await getCampaignById(campaignId);
        if (!isMounted) return;
        setCampaign(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load campaign.');
      }
    }

    loadCampaign();

    return () => {
      isMounted = false;
    };
  }, [campaignId]);

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

      <EbookUploadForm campaignId={campaign.id} />
    </div>
  );
}