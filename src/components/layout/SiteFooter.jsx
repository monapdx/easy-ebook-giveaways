import { Link } from 'react-router-dom';

export default function SiteFooter() {
  return (
    <footer className="site-footer" role="contentinfo">
      <Link to="/privacy">Privacy Policy</Link>
    </footer>
  );
}
