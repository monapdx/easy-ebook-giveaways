import SectionHeader from '../../../components/ui/SectionHeader';
import { useParams } from 'react-router-dom';
import AnalyticsSummaryCards from '../components/AnalyticsSummaryCards';

export default function CampaignAnalyticsPage() {
  const { campaignId } = useParams();

  return (
    <div className="stack-lg">
      <SectionHeader
        title="Analytics"
        description="Track visits, entries, and downloads."
      />
      <AnalyticsSummaryCards campaignId={campaignId} />
    </div>
  );
}
