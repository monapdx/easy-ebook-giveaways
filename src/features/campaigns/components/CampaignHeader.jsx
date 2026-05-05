import { Link } from 'react-router-dom';
import { APP_BASE } from '../../../app/paths';
import Button from '../../../components/ui/Button';

export default function CampaignHeader({ campaign }) {
  return (
    <div className="campaign-header">
      <div>
        <h2>{campaign.title}</h2>
        <p>{campaign.description}</p>
      </div>

      <div className="row">
        <Link to={`${APP_BASE}/campaigns/${campaign.id}/design`}>
          <Button variant="secondary">Design</Button>
        </Link>
        <Link to={`${APP_BASE}/campaigns/${campaign.id}/entries`}>
          <Button variant="secondary">Entries</Button>
        </Link>
        <Link to={`${APP_BASE}/campaigns/${campaign.id}/analytics`}>
          <Button>Analytics</Button>
        </Link>
      </div>
    </div>
  );
}
