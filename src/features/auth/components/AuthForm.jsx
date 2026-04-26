import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabaseClient';
import AuthorContactConsentBlock from '../../entries/components/AuthorContactConsentBlock';

export default function AuthForm({ mode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: '',
    consentAuthorShare: false
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function normalizeEmail(value) {
    return value.trim().toLowerCase();
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const normalizedEmail = normalizeEmail(form.email);

      if (!isValidEmail(normalizedEmail)) {
        setError('Please enter a valid email address.');
        return;
      }

      if (mode === 'signup') {
        if (!form.consentAuthorShare) {
          setError(
            'Please confirm you agree to receive the ebook and that your email may be shared with the author/creator.'
          );
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password: form.password,
          options: {
            data: {
              display_name: form.name,
              consent_author_contact: true,
              consent_author_contact_at: new Date().toISOString()
            }
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }

        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            display_name: form.name,
            author_name: form.name,
            sender_name: form.name,
            sender_email: normalizedEmail
          });
        }

        setMessage('Account created. Check your email to confirm your signup.');
        return;
      }

      const { error: loginError } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: form.password
      });

      if (loginError) {
        setError(loginError.message);
        return;
      }

      const nextPath = location.state?.from?.pathname ?? '/';
      navigate(nextPath, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="stack" noValidate>
        <h2>{mode === 'login' ? 'Log in' : 'Register account'}</h2>

        {mode === 'signup' && (
          <Input
            label="Name"
            name="name"
            value={form.name}
            onChange={updateField}
            placeholder="Author name"
          />
        )}

        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={updateField}
          placeholder="you@example.com"
          autoComplete="email"
        />

        {mode === 'signup' ? (
          <AuthorContactConsentBlock
            checked={form.consentAuthorShare}
            onChange={updateField}
          />
        ) : null}

        <Input
          label="Password"
          name="password"
          type="password"
          value={form.password}
          onChange={updateField}
          placeholder="••••••••"
        />

        {error ? <p>{error}</p> : null}
        {message ? <p>{message}</p> : null}

        <Button type="submit" disabled={submitting}>
          {mode === 'login' ? 'Log in' : 'Register account'}
        </Button>

        {mode === 'login' ? (
          <p className="muted" style={{ margin: 0 }}>
            Need an account? <Link to="/register">Register</Link>
          </p>
        ) : (
          <p className="muted" style={{ margin: 0 }}>
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        )}
      </form>
    </Card>
  );
}