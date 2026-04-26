import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resolveDownload } from '../services/downloadService';

export default function DownloadPage() {
  const { token } = useParams();
  const [url, setUrl] = useState(null);
  const [downloadMeta, setDownloadMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDownload() {
      try {
        const resolvedDownload = await resolveDownload(token);

        if (!isMounted) return;

        setDownloadMeta(resolvedDownload);
        setUrl(resolvedDownload.signedUrl);
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

  if (!url || !downloadMeta) {
    return (
      <div className="public-page">
        <p>Download unavailable.</p>
      </div>
    );
  }

  return (
    <div className="public-page stack">
      <h1>Your ebook is ready</h1>
      <p>This link expires on {new Date(downloadMeta.expiresAt).toLocaleString()}.</p>
      <p>
        Downloads used: {downloadMeta.downloadCount} / {downloadMeta.maxDownloads}
      </p>
      <a href={url} download>
        Download your ebook
      </a>
    </div>
  );
}