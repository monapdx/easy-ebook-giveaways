import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';

export default function DownloadPanel() {
  return (
    <Card>
      <div className="stack">
        <h1>Your ebook is ready</h1>
        <p>This is where you would validate the token and deliver a secure file link.</p>
        <Button>Download Ebook</Button>
      </div>
    </Card>
  );
}
