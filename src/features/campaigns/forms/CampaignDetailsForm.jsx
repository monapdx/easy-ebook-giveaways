import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

export default function CampaignDetailsForm() {
  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: ''
  });

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    console.log('campaign details', form);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="stack">
        <h3>Campaign details</h3>

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

        <Button type="submit">Save Details</Button>
      </form>
    </Card>
  );
}
