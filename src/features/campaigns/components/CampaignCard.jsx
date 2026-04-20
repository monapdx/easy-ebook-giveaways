import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function CampaignCard({ campaign }) {
  return (
    <Card>
      <div className="stack">
        <div>
          <h3>{campaign.title}</h3>
          <p>{campaign.description}</p>
        </div>

        <div className="row spread">
          <span className="pill">{campaign.status}</span>
          <span>{campaign.entries} entries</span>
        </div>

        <div className="row">
          <Link to={`/campaigns/${campaign.id}`}>
            <Button>Manage</Button>
          </Link>
          <Link to={`/g/${campaign.slug}`}>
            <Button variant="secondary">View Public Page</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
