import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resolveDownload } from '../services/downloadService';
import SiteFooter from '../../../components/layout/SiteFooter';

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
      <div className="public-layout-stacked standalone-public-page">
        <div className="public-page public-layout-main">
          <p>Preparing your download...</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-layout-stacked standalone-public-page">
        <div className="public-page public-layout-main">
          <p>{error}</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!url || !downloadMeta) {
    return (
      <div className="public-layout-stacked standalone-public-page">
        <div className="public-page public-layout-main">
          <p>Download unavailable.</p>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="public-layout-stacked standalone-public-page">
      <div className="public-page stack public-layout-main">
        <h1>Your ebook is ready</h1>
        <p>This link expires on {new Date(downloadMeta.expiresAt).toLocaleString()}.</p>
        <p>
          Downloads used: {downloadMeta.downloadCount} / {downloadMeta.maxDownloads}
        </p>
        <a href={url} download>
          Download your ebook
        </a>
      </div>
      <SiteFooter />
    </div>
  );
}