export default function GiveawayAuthorSection({ campaign }) {
  return (
    <section className="author-section">
      <h2>About the author</h2>
      <p className="muted">{campaign.authorBio}</p>
    </section>
  );
}