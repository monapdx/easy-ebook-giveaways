import AuthForm from '../components/AuthForm';
import SiteFooter from '../../../components/layout/SiteFooter';

export default function LoginPage() {
  return (
    <div className="auth-page auth-page-stacked">
      <AuthForm mode="login" />
      <SiteFooter />
    </div>
  );
}
