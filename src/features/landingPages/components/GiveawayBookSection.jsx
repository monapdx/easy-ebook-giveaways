export default function GiveawayBookSection({ campaign }) {
  return (
    <section className="book-section enhanced">
      <img
        src={campaign.coverUrl}
        alt={campaign.bookTitle}
        className="public-cover"
      />

      <div className="stack">
        <h2>{campaign.bookTitle}</h2>

        <p className="muted">
          Download the first book in the series and see if it hooks you.
        </p>

        <ul className="book-points">
          <li>✔ Instant access</li>
          <li>✔ Beginner-friendly</li>
          <li>✔ No payment required</li>
        </ul>
      </div>
    </section>
  );
}