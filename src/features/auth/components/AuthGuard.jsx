import { Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AuthGuard({ children }) {
  const location = useLocation();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setStatus(data.session?.user ? 'authenticated' : 'unauthenticated');
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) return;
      setStatus(session?.user ? 'authenticated' : 'unauthenticated');
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (status === 'loading') {
    return <p>Checking login...</p>;
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}