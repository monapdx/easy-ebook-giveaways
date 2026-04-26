import Card from '../../../components/ui/Card';
import { useCampaignAnalytics } from '../hooks/useCampaignAnalytics';

export default function AnalyticsSummaryCards({ campaignId }) {
  const { analytics, loading, error } = useCampaignAnalytics(campaignId);

  const items = [
    { label: 'Page Views', value: analytics.pageViews },
    { label: 'Entries', value: analytics.entries },
    { label: 'Downloads', value: analytics.downloads }
  ];

  return (
    <>
      {error ? <p>{error}</p> : null}

      <div className="grid-3">
        {items.map((item) => (
          <Card key={item.label}>
            <strong>{item.label}</strong>
            <p>{loading ? '...' : item.value.toLocaleString()}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
