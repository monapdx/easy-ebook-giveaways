import Card from '../../../components/ui/Card';

export default function DashboardStats() {
  const stats = [
    { label: 'Active Campaigns', value: 1 },
    { label: 'Total Entries', value: 142 },
    { label: 'Downloads', value: 118 }
  ];

  return (
    <div className="stats-grid">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <div className="stat-card">
            <span>{stat.label}</span>
            <strong>{stat.value}</strong>
          </div>
        </Card>
      ))}
    </div>
  );
}
