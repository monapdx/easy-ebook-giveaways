import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function QuickActions() {
  return (
    <Card>
      <div className="stack">
        <h3>Quick actions</h3>
        <div className="row">
          <Link to="/campaigns/new">
            <Button>Create Campaign</Button>
          </Link>
          <Link to="/campaigns">
            <Button variant="secondary">View Campaigns</Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}
