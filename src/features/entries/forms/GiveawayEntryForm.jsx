import { useState } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { submitEntry } from '../services/entryService';
import AuthorContactConsentBlock from '../components/AuthorContactConsentBlock';

export default function GiveawayEntryForm({ campaignId }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    consentAuthorShare: false,
    consentNewsletter: true
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!form.consentAuthorShare) {
      setError(
        'Please confirm you agree to receive the ebook and that your email may be shared with the author.'
      );
      return;
    }

    setSubmitting(true);

    try {
      await submitEntry({
        campaignId,
        ...form
      });
      setSuccessMessage('Check your email for the download link.');
      setForm({
        name: '',
        email: '',
        consentAuthorShare: false,
        consentNewsletter: true
      });
    } catch (err) {
      setError(err.message || 'Something went wrong submitting your entry.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section id="cta" className="cta-section">
      <Card>
        <form onSubmit={handleSubmit} className="stack form-enhanced">
          <div className="stack-sm">
            <h2 className="cta-title">Get your free ebook</h2>
            <p className="muted">Instant download. No spam. Unsubscribe anytime.</p>
          </div>

          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="Your name"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            placeholder="you@example.com"
          />

          <AuthorContactConsentBlock
            checked={form.consentAuthorShare}
            onChange={updateField}
          />

          <label className="checkbox-row">
            <input
              type="checkbox"
              name="consentNewsletter"
              checked={form.consentNewsletter}
              onChange={updateField}
            />
            <span>Send me updates and future book releases</span>
          </label>

          {error ? <p className="form-error">{error}</p> : null}
          {successMessage ? <p>{successMessage}</p> : null}

          <Button type="submit" className="btn-lg">
            {submitting ? 'Sending...' : 'Get Instant Access'}
          </Button>

          {/* trust booster */}
          <p className="form-footnote">
            We will email your download link right away after submission.
          </p>
        </form>
      </Card>
    </section>
  );
}