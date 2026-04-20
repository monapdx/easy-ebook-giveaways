import GiveawayHero from './GiveawayHero';
import GiveawayBookSection from './GiveawayBookSection';
import GiveawayAuthorSection from './GiveawayAuthorSection';

export default function GiveawayPreview({ campaign }) {
  return (
    <div className="preview-shell">
      <GiveawayHero campaign={campaign} />
      <GiveawayBookSection campaign={campaign} />
      <GiveawayAuthorSection campaign={campaign} />
    </div>
  );
}
