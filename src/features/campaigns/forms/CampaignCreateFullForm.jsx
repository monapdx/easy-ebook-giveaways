import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { createCampaign } from '../services/campaignService';

export default function CampaignCreateFullForm() {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    giveawayType: 'instant',
    startAt: '',
    endAt: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await createCampaign(form);
      setMessage('Campaign created successfully.');
      setForm({
        title: '',
        slug: '',
        description: '',
        giveawayType: 'instant',
        startAt: '',
        endAt: ''
      });
    } catch (err) {
      setError(err.message || 'Something went wrong.');
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="stack">
        <h3>Create campaign</h3>

        <Input
          label="Title"
          name="title"
          value={form.title}
          onChange={updateField}
          placeholder="Free Book Giveaway"
        />

        <Input
          label="Slug"
          name="slug"
          value={form.slug}
          onChange={updateField}
          placeholder="free-book-giveaway"
        />

        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={updateField}
          rows={5}
          placeholder="Describe the giveaway and the ebook."
        />

        <label className="field">
          <span className="field-label">Giveaway type</span>
          <select
            className="input"
            name="giveawayType"
            value={form.giveawayType}
            onChange={updateField}
          >
            <option value="instant">Instant freebie</option>
            <option value="contest">Contest</option>
          </select>
        </label>

        <Input
          label="Start date"
          type="datetime-local"
          name="startAt"
          value={form.startAt}
          onChange={updateField}
        />

        <Input
          label="End date"
          type="datetime-local"
          name="endAt"
          value={form.endAt}
          onChange={updateField}
        />

        {error ? <p>{error}</p> : null}
        {message ? <p>{message}</p> : null}

        <Button type="submit">Create Campaign</Button>
      </form>
    </Card>
  );
}