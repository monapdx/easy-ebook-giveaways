import Card from '../../../components/ui/Card';

export default function EntryStatsBar({ entries }) {
  return (
    <div className="grid-3">
      <Card>
        <strong>Total entries</strong>
        <p>{entries.length}</p>
      </Card>
      <Card>
        <strong>Subscribed</strong>
        <p>{entries.filter((entry) => entry.consentNewsletter).length}</p>
      </Card>
      <Card>
        <strong>Unsubscribed</strong>
        <p>{entries.filter((entry) => !entry.consentNewsletter).length}</p>
      </Card>
    </div>
  );
}
