import Card from '../../../components/ui/Card';

export default function AnalyticsSummaryCards() {
  const items = [
    { label: 'Page Views', value: 380 },
    { label: 'Entries', value: 142 },
    { label: 'Downloads', value: 118 }
  ];

  return (
    <div className="grid-3">
      {items.map((item) => (
        <Card key={item.label}>
          <strong>{item.label}</strong>
          <p>{item.value}</p>
        </Card>
      ))}
    </div>
  );
}
