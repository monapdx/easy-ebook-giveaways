import { Outlet } from 'react-router-dom';
import SiteFooter from '../../components/layout/SiteFooter';

export default function PublicLayout() {
  return (
    <div className="public-layout public-layout-stacked">
      <div className="public-layout-main">
        <Outlet />
      </div>
      <SiteFooter />
    </div>
  );
}
