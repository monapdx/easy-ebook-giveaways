import Card from '../../../components/ui/Card';

export default function EbookCard({ campaign }) {
  return (
    <Card>
      <div className="row">
        <img src={campaign.coverUrl} alt={campaign.bookTitle} className="cover-thumb" />
        <div>
          <h3>{campaign.bookTitle}</h3>
          <p>File: {campaign.fileName}</p>
        </div>
      </div>
    </Card>
  );
}
