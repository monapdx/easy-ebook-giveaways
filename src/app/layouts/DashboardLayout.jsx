import { Link, NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../../components/ui/Button';
import SiteFooter from '../../components/layout/SiteFooter';

export default function DashboardLayout() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session ?? null);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (!isMounted) return;
      setSession(nextSession ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  const user = session?.user;

  return (
    <div className="dashboard-shell">
      <aside className="sidebar">
        <Link to="/" className="brand">
          BookGiveaway
        </Link>

        <nav className="sidebar-nav">
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/campaigns">Campaigns</NavLink>
          <NavLink to="/campaigns/new">New Campaign</NavLink>
        </nav>

        <div className="stack sidebar-account">
          {user ? (
            <>
              <p className="sidebar-account-text">
                Logged in as
                <br />
                <strong className="sidebar-account-email">{user.email}</strong>
              </p>
              <Button onClick={handleLogout} variant="secondary">
                Log out
              </Button>
            </>
          ) : (
            <>
              <p className="sidebar-account-text">You are not logged in.</p>
              <Link to="/login">
                <Button variant="secondary">Log in</Button>
              </Link>
              <Link to="/register">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <h1>Author Dashboard</h1>
        </header>

        <div className="page-content">
          <Outlet />
        </div>

        <SiteFooter />
      </main>
    </div>
  );
}