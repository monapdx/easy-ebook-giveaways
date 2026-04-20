import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

export default function CampaignHeader({ campaign }) {
  return (
    <div className="campaign-header">
      <div>
        <h2>{campaign.title}</h2>
        <p>{campaign.description}</p>
      </div>

      <div className="row">
        <Link to={`/campaigns/${campaign.id}/design`}>
          <Button variant="secondary">Design</Button>
        </Link>
        <Link to={`/campaigns/${campaign.id}/entries`}>
          <Button variant="secondary">Entries</Button>
        </Link>
        <Link to={`/campaigns/${campaign.id}/analytics`}>
          <Button>Analytics</Button>
        </Link>
      </div>
    </div>
  );
}
