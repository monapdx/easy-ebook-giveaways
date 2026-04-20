import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

export default function LandingPageForm() {
  const [form, setForm] = useState({
    headline: '',
    subheadline: '',
    authorBio: '',
    accentColor: '#d946ef'
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('landing page form', form);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="stack">
        <h3>Landing page content</h3>

        <Input
          label="Headline"
          name="headline"
          value={form.headline}
          onChange={updateField}
          placeholder="Get my fantasy novel free"
        />

        <Textarea
          label="Subheadline"
          name="subheadline"
          rows={3}
          value={form.subheadline}
          onChange={updateField}
          placeholder="Sign up below and I’ll send it to your inbox."
        />

        <Textarea
          label="Author bio"
          name="authorBio"
          rows={4}
          value={form.authorBio}
          onChange={updateField}
          placeholder="Write a short author bio."
        />

        <Input
          label="Accent color"
          type="color"
          name="accentColor"
          value={form.accentColor}
          onChange={updateField}
        />

        <Button type="submit">Save Page Content</Button>
      </form>
    </Card>
  );
}
