import SectionHeader from '../../../components/ui/SectionHeader';
import { useEntries } from '../hooks/useEntries';
import EntryStatsBar from '../components/EntryStatsBar';
import EntryTable from '../components/EntryTable';

export default function CampaignEntriesPage() {
  const { entries } = useEntries();

  return (
    <div className="stack-lg">
      <SectionHeader
        title="Entries"
        description="View and export the people who joined this giveaway."
      />
      <EntryStatsBar entries={entries} />
      <EntryTable entries={entries} />
    </div>
  );
}
