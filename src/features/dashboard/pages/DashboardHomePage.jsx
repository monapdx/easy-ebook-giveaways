import SectionHeader from '../../../components/ui/SectionHeader';
import DashboardStats from '../components/DashboardStats';
import QuickActions from '../components/QuickActions';

export default function DashboardHomePage() {
  return (
    <div className="stack-lg">
      <SectionHeader
        title="Overview"
        description="Track your giveaway campaigns, entries, and downloads."
      />
      <DashboardStats />
      <QuickActions />
    </div>
  );
}
