import SectionHeader from '../../../components/ui/SectionHeader';
import { useParams } from 'react-router-dom';
import { useEntries } from '../hooks/useEntries';
import EntryStatsBar from '../components/EntryStatsBar';
import EntryTable from '../components/EntryTable';

export default function CampaignEntriesPage() {
  const { campaignId } = useParams();
  const { entries, loading, error } = useEntries(campaignId);

  return (
    <div className="stack-lg">
      <SectionHeader
        title="Entries"
        description="View and export the people who joined this giveaway."
      />
      {loading ? <p>Loading entries...</p> : null}
      {error ? <p>{error}</p> : null}
      <EntryStatsBar entries={entries} />
      <EntryTable entries={entries} />
    </div>
  );
}
