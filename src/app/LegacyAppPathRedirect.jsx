import { Navigate, useLocation } from 'react-router-dom';
import { APP_BASE } from './paths';

/**
 * Old bookmarks used /#/campaigns/... before the dashboard moved under /app.
 * Preserves the subpath after /campaigns.
 */
export default function LegacyAppPathRedirect() {
  const { pathname } = useLocation();
  const suffix = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return <Navigate to={`${APP_BASE}${suffix}`} replace />;
}
