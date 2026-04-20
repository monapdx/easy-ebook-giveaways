import SectionHeader from '../../../components/ui/SectionHeader';
import AnalyticsSummaryCards from '../components/AnalyticsSummaryCards';

export default function CampaignAnalyticsPage() {
  return (
    <div className="stack-lg">
      <SectionHeader
        title="Analytics"
        description="Track visits, entries, and downloads."
      />
      <AnalyticsSummaryCards />
    </div>
  );
}
