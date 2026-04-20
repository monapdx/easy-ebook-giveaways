import { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import { supabase } from '../../../lib/supabaseClient';

export default function AuthForm({ mode = 'login' }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function updateField(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (mode === 'signup') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            display_name: form.name
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
          sender_email: form.email
        });
      }

      setMessage('Account created. Check your email to confirm your signup.');
      return;
    }

    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password
    });

    if (loginError) {
      setError(loginError.message);
      return;
    }

    setMessage('Logged in successfully.');
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="stack">
        <h2>{mode === 'login' ? 'Log in' : 'Create account'}</h2>

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
        />

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

        <Button type="submit">
          {mode === 'login' ? 'Log in' : 'Create account'}
        </Button>
      </form>
    </Card>
  );
}