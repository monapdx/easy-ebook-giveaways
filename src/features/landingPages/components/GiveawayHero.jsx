export default function GiveawayHero({ campaign }) {
  const coverUrl = campaign.coverUrl;
  const bookTitle = campaign.bookTitle ?? campaign.title;

  return (
    <section
      className={
        coverUrl
          ? 'hero hero-enhanced giveaway-hero-with-cover'
          : 'hero hero-enhanced'
      }
      style={{ borderColor: campaign.accentColor }}
    >
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={bookTitle ? `${bookTitle} cover` : 'Book cover'}
          className="public-cover giveaway-hero-cover"
        />
      ) : null}

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