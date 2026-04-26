import { Link } from 'react-router-dom';
import Card from '../../../components/ui/Card';

export default function PrivacyPage() {
  return (
    <div className="public-page stack-lg">
      <Card>
        <article className="stack-lg legal-doc">
          <header className="stack">
            <h1>Privacy Policy for Easy Ebook Giveaways</h1>
            <p className="muted" style={{ margin: 0 }}>
              Last Updated: April 26, 2026
            </p>
          </header>

          <p>
            This Privacy Policy describes how Easy Ebook Giveaways (&ldquo;Company,&rdquo;
            &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) collects, uses, discloses, and
            safeguards personal information obtained from users (&ldquo;you&rdquo; or
            &ldquo;User&rdquo;) of the Easy Ebook Giveaways platform (the &ldquo;Service&rdquo;).
          </p>

          <p>
            By accessing or using the Service, you acknowledge that you have read, understood, and
            agree to the practices described in this Privacy Policy.
          </p>

          <section className="stack">
            <h2>1. Information We Collect</h2>
            <p>We may collect the following categories of information:</p>
            <p>
              <strong>Personal Information:</strong> Email address voluntarily provided by you when
              registering to access or download an ebook.
            </p>
            <p>
              <strong>Usage Information:</strong> Information regarding your interactions with the
              Service, including download activity, timestamps, and basic technical data (e.g.,
              browser type, device type, IP address).
            </p>
            <p>We do not intentionally collect sensitive personal information.</p>
          </section>

          <section className="stack">
            <h2>2. Legal Basis for Processing (if applicable)</h2>
            <p>We process your personal information based on:</p>
            <ul className="legal-list">
              <li>Your consent, provided when submitting your email address; and</li>
              <li>
                Our legitimate interests in operating, maintaining, and improving the Service.
              </li>
            </ul>
          </section>

          <section className="stack">
            <h2>3. Use of Information</h2>
            <p>We use collected information for the following purposes:</p>
            <ul className="legal-list">
              <li>To provide access to and deliver requested ebooks</li>
              <li>To operate, maintain, and improve the Service</li>
              <li>To communicate with you regarding your use of the Service, where necessary</li>
              <li>To enforce our terms, policies, and applicable legal requirements</li>
            </ul>
          </section>

          <section className="stack">
            <h2>4. Disclosure of Information</h2>

            <h3>4.1 Disclosure to Ebook Authors and Creators</h3>
            <p>By submitting your email address to download an ebook, you expressly acknowledge and agree that:</p>
            <ul className="legal-list">
              <li>
                The author, publisher, or creator associated with that ebook (&ldquo;Content
                Provider&rdquo;) may receive access to your email address; and
              </li>
              <li>
                Your email address may be included in a list of users who have registered to
                download that Content Provider&rsquo;s ebook.
              </li>
            </ul>
            <p>
              Content Providers may use such information for their own purposes, including but not
              limited to marketing, promotional communications, and audience development, subject to
              their own policies and applicable law.
            </p>

            <h3>4.2 No Sale of Personal Information</h3>
            <p>
              Except as described above, we do not sell, rent, or trade your personal information
              to unrelated third parties.
            </p>

            <h3>4.3 Legal Compliance</h3>
            <p>
              We may disclose your information where required to do so by law, regulation, legal
              process, or governmental request.
            </p>
          </section>

          <section className="stack">
            <h2>5. Third-Party Responsibility Disclaimer</h2>
            <p>
              Once your email address is disclosed to a Content Provider, the Company does not
              control and is not responsible for that party&rsquo;s use, storage, or further
              disclosure of your information. Any communications or interactions you have with a
              Content Provider are solely between you and that party.
            </p>
          </section>

          <section className="stack">
            <h2>6. Data Retention</h2>
            <p>We retain personal information for as long as reasonably necessary to:</p>
            <ul className="legal-list">
              <li>Fulfill the purposes described in this Privacy Policy</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
            </ul>
          </section>

          <section className="stack">
            <h2>7. Data Security</h2>
            <p>
              We implement commercially reasonable administrative, technical, and physical safeguards
              designed to protect your information. However, no method of transmission over the
              Internet or method of storage is completely secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section className="stack">
            <h2>8. Your Rights and Choices</h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="legal-list">
              <li>Access, correct, or delete your personal information</li>
              <li>Withdraw consent to processing</li>
              <li>
                Opt out of communications from Content Providers (which must be done directly with
                them)
              </li>
            </ul>
            <p>
              To exercise rights related to information held by us, contact us using the
              information below.
            </p>
          </section>

          <section className="stack">
            <h2>9. Children&rsquo;s Privacy</h2>
            <p>
              The Service is not directed to individuals under the age of 13 (or the applicable age
              of digital consent in your jurisdiction), and we do not knowingly collect personal
              information from such individuals.
            </p>
          </section>

          <section className="stack">
            <h2>10. Changes to This Privacy Policy</h2>
            <p>
              We reserve the right to modify this Privacy Policy at any time. Changes will be
              effective upon posting to the Service with an updated &ldquo;Last Updated&rdquo;
              date. Continued use of the Service constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="stack">
            <h2>11. Contact Information</h2>
            <p>
              If you have questions regarding this Privacy Policy or our data practices, please
              contact us at:{' '}
              <a href="mailto:ashlylorenzana@gmail.com">ashlylorenzana@gmail.com</a>
            </p>
          </section>

          <p className="muted" style={{ marginBottom: 0 }}>
            <Link to="/login">Sign in</Link>
            {' · '}
            <Link to="/">Dashboard</Link>
          </p>
        </article>
      </Card>
    </div>
  );
}
