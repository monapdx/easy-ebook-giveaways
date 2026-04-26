import CampaignCard from './CampaignCard';

export default function CampaignList({ campaigns, deletingCampaignId, onDeleteCampaign }) {
  return (
    <div className="grid-2">
      {campaigns.map((campaign) => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          isDeleting={deletingCampaignId === campaign.id}
          onDelete={onDeleteCampaign}
        />
      ))}
    </div>
  );
}
