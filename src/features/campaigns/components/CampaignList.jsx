import CampaignCard from './CampaignCard';

export default function CampaignList({ campaigns }) {
  return (
    <div className="grid-2">
      {campaigns.map((campaign) => (
        <CampaignCard key={campaign.id} campaign={campaign} />
      ))}
    </div>
  );
}
