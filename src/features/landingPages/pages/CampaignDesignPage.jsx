import { mockCampaigns } from '../../../lib/mockData';
import SectionHeader from '../../../components/ui/SectionHeader';
import LandingPageForm from '../forms/LandingPageForm';
import GiveawayPreview from '../components/GiveawayPreview';

export default function CampaignDesignPage() {
  const campaign = mockCampaigns[0];

  return (
    <div className="stack-lg">
      <SectionHeader
        title="Design"
        description="Edit your public giveaway page and preview it."
      />
      <LandingPageForm />
      <GiveawayPreview campaign={campaign} />
    </div>
  );
}
