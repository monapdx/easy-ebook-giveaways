import { Link } from 'react-router-dom';
import { APP_BASE } from '../../../app/paths';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function QuickActions() {
  return (
    <Card>
      <div className="stack">
        <h3>Quick actions</h3>
        <div className="row">
          <Link to={`${APP_BASE}/campaigns/new`}>
            <Button>Create Campaign</Button>
          </Link>
          <Link to={`${APP_BASE}/campaigns`}>
            <Button variant="secondary">View Campaigns</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
