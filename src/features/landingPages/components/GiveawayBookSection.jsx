export default function GiveawayBookSection({ campaign }) {
  return (
    <section className="book-section">
      <img src={campaign.coverUrl} alt={campaign.bookTitle} className="public-cover" />
      <div className="stack">
        <h2>{campaign.bookTitle}</h2>
        <p>
          Download the first book in the series and discover whether it hooks you
          enough to keep reading.
        </p>
      </div>
    </section>
  );
}
