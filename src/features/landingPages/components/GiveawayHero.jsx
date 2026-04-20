export default function GiveawayHero({ campaign }) {
  return (
    <section className="hero" style={{ borderColor: campaign.accentColor }}>
      <div className="stack">
        <span className="pill">Free ebook</span>
        <h1>{campaign.title}</h1>
        <p>{campaign.description}</p>
      </div>
    </section>
  );
}
