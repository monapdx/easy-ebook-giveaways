import AuthForm from '../components/AuthForm';

export default function LoginPage() {
  return (
    <div className="auth-page">
      <AuthForm mode="login" />
    </div>
  );
}
