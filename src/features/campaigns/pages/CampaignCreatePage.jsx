import SectionHeader from '../../../components/ui/SectionHeader';
import CampaignCreateFullForm from '../forms/CampaignCreateFullForm';

export default function CampaignCreatePage() {
  return (
    <div className="stack-lg">
      <SectionHeader
        title="Create Campaign"
        description="Build a new hosted ebook giveaway."
      />

      <CampaignCreateFullForm />
    </div>
  );
}