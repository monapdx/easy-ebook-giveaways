import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function CampaignCard({ campaign, isDeleting = false, onDelete }) {
  const entryCount = campaign.entries ?? 0;
  const deleteLabel = isDeleting ? 'Deleting...' : 'Delete';

  async function handleDelete() {
    const approved = window.confirm(
      `Delete "${campaign.title}"? This will permanently remove its entries, download links, and attached ebook.`
    );

    if (!approved || !onDelete) {
      return;
    }

    try {
      await onDelete(campaign.id);
    } catch (_err) {
      // Page-level error state already displays delete failures.
    }
  }

  return (
    <Card>
      <div className="stack">
        <div>
          <h3>{campaign.title}</h3>
          <p>{campaign.description}</p>
        </div>

        <div className="row spread">
          <span className="pill">{campaign.status}</span>
          <span>{entryCount.toLocaleString()} entries</span>
        </div>

        <div className="row">
          <Link to={`/campaigns/${campaign.id}`}>
            <Button>Manage</Button>
          </Link>
          <Link to={`/g/${campaign.slug}`}>
            <Button variant="secondary">View Public Page</Button>
          </Link>
          <Button variant="secondary" onClick={handleDelete} disabled={isDeleting}>
            {deleteLabel}
          </Button>
        </div>
      </div>
    </Card>
  );
}
