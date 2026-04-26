import AuthForm from '../components/AuthForm';
import SiteFooter from '../../../components/layout/SiteFooter';

export default function SignupPage() {
  return (
    <div className="auth-page auth-page-stacked">
      <AuthForm mode="signup" />
      <SiteFooter />
    </div>
  );
}
