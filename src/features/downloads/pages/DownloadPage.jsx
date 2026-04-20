import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDownloadUrl } from '../../ebooks/services/ebookService';
import {
  getValidDownloadToken,
  incrementDownloadCount
} from '../services/downloadService';

export default function DownloadPage() {
  const { token } = useParams();
  const [url, setUrl] = useState(null);
  const [downloadRecord, setDownloadRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDownload() {
      try {
        const tokenRecord = await getValidDownloadToken(token);
        const signedUrl = await getDownloadUrl(tokenRecord.ebook_id, true);

        if (!isMounted) return;

        setDownloadRecord(tokenRecord);
        setUrl(signedUrl);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to prepare your download.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadDownload();

    return () => {
      isMounted = false;
    };
  }, [token]);

  async function handleDownloadClick() {
    if (!downloadRecord) return;

    try {
      await incrementDownloadCount(
        downloadRecord.id,
        downloadRecord.download_count
      );
    } catch (err) {
      console.error(err);
    }
  }

  if (loading) {
    return (
      <div className="public-page">
        <p>Preparing your download...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-page">
        <p>{error}</p>
      </div>
    );
  }

  if (!url || !downloadRecord) {
    return (
      <div className="public-page">
        <p>Download unavailable.</p>
      </div>
    );
  }

  return (
    <div className="public-page stack">
      <h1>Your ebook is ready</h1>
      <p>This link expires on {new Date(downloadRecord.expires_at).toLocaleString()}.</p>
      <p>
        Downloads used: {downloadRecord.download_count} / {downloadRecord.max_downloads}
      </p>
      <a href={url} download onClick={handleDownloadClick}>
        Download your ebook
      </a>
    </div>
  );
}