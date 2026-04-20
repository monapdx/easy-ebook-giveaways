import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { uploadEbook } from '../services/ebookService';

export default function EbookUploadForm({ campaignId }) {
  const [form, setForm] = useState({
    bookTitle: '',
    cover: null,
    ebookFile: null
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value, files } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setUploading(true);
    setMessage('');
    setError('');

    try {
      if (!campaignId) {
        throw new Error('Missing campaign ID.');
      }

      if (!form.ebookFile) {
        throw new Error('Please choose an ebook file to upload.');
      }

      const uploaded = await uploadEbook({
        file: form.ebookFile,
        campaignId,
        title: form.bookTitle || form.ebookFile.name
      });

      setMessage(`Uploaded: ${uploaded.title}`);
      setForm({
        bookTitle: '',
        cover: null,
        ebookFile: null
      });

      event.target.reset();
    } catch (err) {
      setError(err.message || 'Failed to upload ebook.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="stack">
        <h3>Ebook upload</h3>

        <Input
          label="Book title"
          name="bookTitle"
          value={form.bookTitle}
          onChange={handleChange}
          placeholder="The Glass Keep"
        />

        <Input
          label="Ebook file"
          type="file"
          name="ebookFile"
          accept=".pdf,.epub"
          onChange={handleChange}
        />

        <p style={{ color: 'var(--muted)', margin: 0 }}>
          Accepted formats: PDF, EPUB
        </p>

        {error ? <p>{error}</p> : null}
        {message ? <p>{message}</p> : null}

        <Button type="submit">
          {uploading ? 'Uploading...' : 'Upload Ebook'}
        </Button>
      </form>
    </Card>
  );
}