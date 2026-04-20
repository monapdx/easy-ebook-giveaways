import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import GiveawayHero from '../components/GiveawayHero';
import GiveawayBookSection from '../components/GiveawayBookSection';
import GiveawayAuthorSection from '../components/GiveawayAuthorSection';
import GiveawayEntryForm from '../../entries/forms/GiveawayEntryForm';
import { getCampaignBySlug } from '../../campaigns/services/campaignService';

export default function PublicGiveawayPage() {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCampaign() {
      try {
        const data = await getCampaignBySlug(slug);

        if (!isMounted) return;
        setCampaign(data);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load giveaway.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadCampaign();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="public-page">
        <p>Loading giveaway...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-page">
        <p>{error}</p>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="public-page">
        <p>Giveaway not found.</p>
      </div>
    );
  }

  return (
    <div className="public-page stack-xl">
      <GiveawayHero campaign={campaign} />

      {/* CTA moved up */}
      <GiveawayEntryForm campaignId={campaign.id} />

      <GiveawayBookSection campaign={campaign} />
      <GiveawayAuthorSection campaign={campaign} />
    </div>
  );
}