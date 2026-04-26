import Card from '../../../components/ui/Card';
import { useDashboardStats } from '../hooks/useDashboardStats';

export default function DashboardStats() {
  const { stats: liveStats, loading, error } = useDashboardStats();

  const cards = [
    { label: 'Active Campaigns', value: liveStats.activeCampaigns },
    { label: 'Total Entries', value: liveStats.totalEntries },
    { label: 'Downloads', value: liveStats.downloads }
  ];

  return (
    <>
      {error ? <p>{error}</p> : null}

      <div className="stats-grid">
        {cards.map((stat) => (
          <Card key={stat.label}>
            <div className="stat-card">
              <span>{stat.label}</span>
              <strong>{loading ? '...' : stat.value.toLocaleString()}</strong>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
