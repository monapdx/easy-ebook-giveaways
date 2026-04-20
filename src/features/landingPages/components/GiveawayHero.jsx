export default function GiveawayHero({ campaign }) {
  return (
    <section
      className="hero hero-enhanced"
      style={{ borderColor: campaign.accentColor }}
    >
      <div className="stack">
        <span className="pill">Free ebook</span>

        <h1 className="hero-title">{campaign.title}</h1>

        <p className="hero-desc">{campaign.description}</p>

        <a href="#cta" className="btn btn-primary">
          Get Free Ebook
        </a>
      </div>
    </section>
  );
}