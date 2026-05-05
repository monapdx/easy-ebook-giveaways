import { Link } from 'react-router-dom';
import { APP_BASE } from '../../../app/paths';
import '../../../styles/marketing-landing.css';

const HOMEPAGE_PROMO_SRC = `${import.meta.env.BASE_URL}homepage-promo.png`;

function IconSpark() {
  return (
    <svg className="marketing-icon marketing-icon--sm" width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M12 2l1.8 5.5h5.7l-4.6 3.3 1.8 5.5L12 13l-4.7 3.3 1.8-5.5-4.6-3.3h5.7L12 2z"
        fill="currentColor"
        opacity="0.35"
      />
    </svg>
  );
}

const FEATURES = [
  {
    title: 'Campaign landing pages',
    text: 'A clean giveaway page for your book — no wrestling with generic site builders.'
  },
  {
    title: 'Email signup collection',
    text: 'Collect names and emails with clear consent, so readers know what they are signing up for.'
  },
  {
    title: 'Automatic download links',
    text: 'Readers get a secure link after they sign up. You are not manually DM-ing files at midnight.'
  },
  {
    title: 'PDF & EPUB support',
    text: 'Upload the formats readers already use on phones, e-readers, and laptops.'
  },
  {
    title: 'Draft & published states',
    text: 'Tinker in draft, then publish when your cover, copy, and file feel ready.'
  },
  {
    title: 'Signup list in one place',
    text: 'Every entry lives in your dashboard. Simple exports are on the way; today you can review and work from the list.'
  },
  {
    title: 'Creator-friendly setup',
    text: 'Made for people who would rather write than wire up five SaaS tools.'
  },
  {
    title: 'No funnel gymnastics',
    text: 'No tripwires, countdown timers, or “growth hacker” dashboards — just your ebook and your readers.'
  }
];

const WHO_FOR = [
  'Indie authors',
  'Newsletter writers',
  'Zine makers',
  'Small presses',
  'Course creators',
  'Fiction writers sharing reader magnets',
  'Non-coders who want a simple giveaway without code'
];

const USE_CASES = [
  'Reader magnet for a newsletter',
  'Free preview chapter',
  'Bonus content for existing readers',
  'ARC signup giveaway',
  'Resource guide or workbook',
  'Lead magnet for a creative business'
];

export default function MarketingHomePage() {
  return (
    <div className="marketing">
      <a href="#main-content" className="marketing-skip">
        Skip to main content
      </a>

      <header className="marketing-header">
        <div className="marketing-header__inner">
          <Link to="/" className="marketing-logo">
            Easy eBook Giveaways
          </Link>
          <nav className="marketing-nav" aria-label="Site">
            <a className="marketing-nav__link" href="#how-it-works">
              How it works
            </a>
            <a className="marketing-nav__link" href="#features">
              Features
            </a>
            <Link className="marketing-nav__link" to="/privacy">
              Privacy
            </Link>
            <Link className="marketing-nav__cta marketing-nav__cta--ghost" to="/login">
              Log in
            </Link>
            <Link className="marketing-nav__cta btn btn-primary" to="/register">
              Start free
            </Link>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="marketing-hero" aria-labelledby="marketing-hero-heading">
          <div className="marketing-hero__grid">
            <div className="marketing-hero__copy">
              <p className="marketing-eyebrow">
                <IconSpark />
                For authors &amp; newsletter folks
              </p>
              <h1 id="marketing-hero-heading" className="marketing-hero__title">
                Give away your ebook. Grow your email list.
              </h1>
              <p className="marketing-hero__sub">
                Launch a friendly giveaway page, collect signups, and send secure download links — without duct-taping
                file hosts, forms, and inbox chaos together.
              </p>
              <div className="marketing-hero__actions">
                <Link className="btn btn-primary btn-lg marketing-hero__btn" to="/register">
                  Start a Giveaway
                </Link>
                <a className="btn btn-secondary btn-lg marketing-hero__btn" href="#how-it-works">
                  See How It Works
                </a>
              </div>
              <p className="marketing-hero__note muted">
                Free to try · Built for indie energy, not enterprise jargon
              </p>
            </div>
            <figure className="marketing-hero__art">
              <img
                className="marketing-hero__promo"
                src={HOMEPAGE_PROMO_SRC}
                width={760}
                height={560}
                alt="Giveaway page, email signup, and secure ebook download in one flow."
                loading="eager"
                decoding="async"
              />
            </figure>
          </div>
        </section>

        <section className="marketing-section marketing-section--warm" aria-labelledby="pain-heading">
          <div className="marketing-container">
            <h2 id="pain-heading" className="marketing-h2">
              Giving away a book should feel exciting — not like IT homework
            </h2>
            <p className="marketing-lede">
              You have a story people want. But between hosting a PDF or EPUB, collecting emails, sending download links,
              and keeping a list you can actually use, the fun drains out fast. Easy eBook Giveaways keeps the happy path
              simple: one page, one list, one delivery flow.
            </p>
          </div>
        </section>

        <section className="marketing-section" id="how-it-works" aria-labelledby="how-heading">
          <div className="marketing-container">
            <h2 id="how-heading" className="marketing-h2 marketing-h2--center">
              How it works
            </h2>
            <p className="marketing-subhead marketing-subhead--center">
              Three steps from “I have a file” to “readers are downloading.”
            </p>
            <ol className="marketing-steps">
              <li className="marketing-step">
                <span className="marketing-step__num" aria-hidden>
                  1
                </span>
                <h3 className="marketing-step__title">Upload your ebook</h3>
                <p className="marketing-step__text muted">
                  Add your PDF or EPUB (and an optional cover) to your campaign. Tweak until it feels right.
                </p>
              </li>
              <li className="marketing-step">
                <span className="marketing-step__num" aria-hidden>
                  2
                </span>
                <h3 className="marketing-step__title">Share your giveaway page</h3>
                <p className="marketing-step__text muted">
                  Drop the link in your newsletter, social bio, or back-of-book note. Readers land on a page made for
                  your book.
                </p>
              </li>
              <li className="marketing-step">
                <span className="marketing-step__num" aria-hidden>
                  3
                </span>
                <h3 className="marketing-step__title">Collect signups &amp; deliver downloads</h3>
                <p className="marketing-step__text muted">
                  They join your list; they get a secure download link. You see entries in your dashboard and keep
                  building the relationship.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="marketing-section marketing-section--alt" id="features" aria-labelledby="features-heading">
          <div className="marketing-container">
            <h2 id="features-heading" className="marketing-h2 marketing-h2--center">
              Everything you need, nothing you don’t
            </h2>
            <ul className="marketing-features">
              {FEATURES.map((f) => (
                <li key={f.title} className="marketing-feature card">
                  <h3 className="marketing-feature__title">{f.title}</h3>
                  <p className="marketing-feature__text muted">{f.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="marketing-section" aria-labelledby="who-heading">
          <div className="marketing-container marketing-split">
            <div>
              <h2 id="who-heading" className="marketing-h2">
                Who it is for
              </h2>
              <p className="marketing-lede marketing-lede--tight">
                If you make words or worlds and want a gentle on-ramp for new readers, you are in the right place.
              </p>
            </div>
            <ul className="marketing-tags">
              {WHO_FOR.map((item) => (
                <li key={item} className="marketing-tag">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="marketing-section marketing-section--warm" aria-labelledby="use-heading">
          <div className="marketing-container">
            <h2 id="use-heading" className="marketing-h2 marketing-h2--center">
              Example use cases
            </h2>
            <ul className="marketing-use-cases">
              {USE_CASES.map((u) => (
                <li key={u} className="marketing-use-case">
                  <span className="marketing-use-case__dot" aria-hidden />
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="marketing-section" aria-labelledby="trust-heading">
          <div className="marketing-container marketing-trust card">
            <h2 id="trust-heading" className="marketing-h3">
              Trust &amp; privacy, in plain language
            </h2>
            <p className="muted marketing-trust__text">
              Easy eBook Giveaways is built around straightforward ebook delivery and email signup — not creepy
              cross-site tracking or endless pixels. You are responsible for how you use reader emails: be transparent,
              honor consent, and let people unsubscribe when they need to. We like tools that respect readers because
              readers are how books find their next home.
            </p>
            <p className="marketing-trust__links">
              <Link to="/privacy">Read the privacy policy</Link>
            </p>
          </div>
        </section>

        <section className="marketing-section marketing-final" aria-labelledby="final-cta-heading">
          <div className="marketing-container marketing-final__inner card">
            <h2 id="final-cta-heading" className="marketing-h2 marketing-h2--center marketing-final__title">
              Launch your first ebook giveaway without duct-taping five tools together.
            </h2>
            <p className="marketing-subhead marketing-subhead--center">
              Create an account, upload a file, share your link — then get back to writing the next chapter.
            </p>
            <div className="marketing-final__actions">
              <Link className="btn btn-primary btn-lg" to="/register">
                Start a Giveaway
              </Link>
              <Link className="btn btn-secondary btn-lg" to={APP_BASE}>
                I already have an account
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="marketing-site-footer">
        <div className="marketing-container marketing-site-footer__inner">
          <span className="muted">© {new Date().getFullYear()} Easy eBook Giveaways</span>
          <div className="marketing-site-footer__links">
            <Link to="/privacy">Privacy</Link>
            <Link to="/login">Log in</Link>
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
