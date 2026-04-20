import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { submitEntry } from '../services/entryService';

export default function GiveawayEntryForm({ campaignId }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    consentNewsletter: true
  });
  const [error, setError] = useState('');
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
    setSubmitting(true);

    try {
      const result = await submitEntry({
        campaignId,
        ...form
      });

      navigate(`/download/${result.token}`);
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

          <Button type="submit" className="btn-lg">
            {submitting ? 'Sending...' : 'Get Instant Access'}
          </Button>

          {/* trust booster */}
          <p className="form-footnote">
            📩 Delivered instantly to your inbox
          </p>
        </form>
      </Card>
    </section>
  );
}