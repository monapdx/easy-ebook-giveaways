import Card from '../../../components/ui/Card';

export default function EntryTable({ entries }) {
  return (
    <Card>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Subscribed</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.name}</td>
              <td>{entry.email}</td>
              <td>{entry.consentNewsletter ? 'Yes' : 'No'}</td>
              <td>{entry.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
