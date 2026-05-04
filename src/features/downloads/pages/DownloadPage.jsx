import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { resolveDownload } from '../services/downloadService';
import { getEbookCoverPublicUrl } from '../../ebooks/services/ebookService';
import SiteFooter from '../../../components/layout/SiteFooter';
import Card from '../../../components/ui/Card';

const DEFAULT_COVER = 'https://placehold.co/280x420/1f2430/a8b0bf?text=Ebook';

function resolveCoverSrc(meta) {
  if (!meta) {
    return DEFAULT_COVER;
  }
  const fromServer = meta.coverPublicUrl || meta.cover_public_url;
  if (fromServer) {
    return fromServer;
  }
  const path = meta.coverImagePath || meta.cover_image_path;
  return getEbookCoverPublicUrl(path) || DEFAULT_COVER;
}

function formatLabel(fmt) {
  if (!fmt) return 'Ebook';
  return String(fmt).replace(/^\./, '').toUpperCase();
}

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

  const displayTitle = downloadMeta?.ebookTitle?.trim() || 'Your ebook';
  const coverSrc = resolveCoverSrc(downloadMeta);
  const formatBadge = formatLabel(downloadMeta?.ebookFormat);
  const downloadName =
    downloadMeta?.suggestedFileName || `ebook.${downloadMeta?.ebookFormat || 'pdf'}`;

  if (loading) {
    return (
      <div className="public-layout-stacked standalone-public-page">
        <div className="public-page public-layout-main download-page">
          <Card>
            <div className="download-page__loading">
              <p className="download-page__loading-title">Preparing your download…</p>
              <p className="muted" style={{ margin: 0 }}>
                One moment while we verify your link.
              </p>
            </div>
          </Card>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="public-layout-stacked standalone-public-page">
        <div className="public-page public-layout-main download-page">
          <Card>
            <div className="download-page__error">
              <h1 className="download-page__title">Download unavailable</h1>
              <p className="muted" style={{ margin: 0 }}>
                {error}
              </p>
            </div>
          </Card>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (!url || !downloadMeta) {
    return (
      <div className="public-layout-stacked standalone-public-page">
        <div className="public-page public-layout-main download-page">
          <Card>
            <p className="muted">Download unavailable.</p>
          </Card>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const expires = new Date(downloadMeta.expiresAt);
  const remaining = Math.max(0, downloadMeta.maxDownloads - downloadMeta.downloadCount);

  return (
    <div className="public-layout-stacked standalone-public-page">
      <div className="public-page stack-lg public-layout-main download-page">
        <Card>
          <div className="download-page__layout">
            <div className="download-page__cover-wrap">
              <img
                src={coverSrc}
                alt={`Cover: ${displayTitle}`}
                className="download-page__cover"
                width={280}
                height={420}
              />
            </div>

            <div className="download-page__body stack">
              <span className="pill">Ready to read</span>

              <h1 className="download-page__title">{displayTitle}</h1>

              <p className="download-page__lede muted">
                Your file is ready. Use the buttons below to download or open it in a new tab.
              </p>

              <div className="download-page__meta row">
                <span className="download-page__badge">{formatBadge}</span>
                <span className="muted download-page__expiry">
                  Link expires {expires.toLocaleString()}
                </span>
              </div>

              <div className="download-page__actions stack">
                <a
                  className="btn btn-primary btn-lg download-page__action-primary"
                  href={url}
                  download={downloadName}
                >
                  Download {formatBadge !== 'Ebook' ? formatBadge : 'ebook'}
                </a>
                <a
                  className="btn btn-secondary btn-lg download-page__action-secondary"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in new tab
                </a>
              </div>

              <p className="download-page__footnote muted">
                Downloads used: {downloadMeta.downloadCount} of {downloadMeta.maxDownloads}
                {remaining > 0 ? ` · ${remaining} download${remaining === 1 ? '' : 's'} left` : ' · No downloads remaining'}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <SiteFooter />
    </div>
  );
}
