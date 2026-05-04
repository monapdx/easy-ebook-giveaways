import GiveawayHero from './GiveawayHero';
import GiveawayBookSection from './GiveawayBookSection';
import GiveawayAuthorSection from './GiveawayAuthorSection';
import GiveawayEntryForm from '../../entries/forms/GiveawayEntryForm';

export default function GiveawayPreview({ campaign, isPreview = false }) {
  return (
    <div className="preview-shell">
      <GiveawayHero campaign={campaign} />
      <GiveawayEntryForm campaignId={campaign.id} isPreview={isPreview} />
      <GiveawayBookSection campaign={campaign} />
      <GiveawayAuthorSection campaign={campaign} />
    </div>
  );
}
