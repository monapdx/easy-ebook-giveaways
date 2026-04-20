import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

export default function CampaignSettingsForm() {
  const [form, setForm] = useState({
    startAt: '',
    endAt: '',
    giveawayType: 'instant'
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('campaign settings', form);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="stack">
        <h3>Campaign settings</h3>

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

        <Button type="submit">Save Settings</Button>
      </form>
    </Card>
  );
}
