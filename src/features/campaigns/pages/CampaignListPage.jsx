import SectionHeader from '../../../components/ui/SectionHeader';
import EmptyState from '../../../components/ui/EmptyState';
import { useCampaigns } from '../hooks/useCampaigns';
import CampaignList from '../components/CampaignList';

export default function CampaignListPage() {
  const { campaigns, loading, error } = useCampaigns();

  return (
    <div className="stack-lg">
      <SectionHeader
        title="Campaigns"
        description="Create and manage your ebook giveaway campaigns."
      />

      {loading ? <p>Loading campaigns...</p> : null}
      {error ? <p>{error}</p> : null}

      {!loading && !error && campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          description="Create your first giveaway campaign to get started."
        />
      ) : null}

      {!loading && campaigns.length > 0 ? (
        <CampaignList campaigns={campaigns} />
      ) : null}
    </div>
  );
}