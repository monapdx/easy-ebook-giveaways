import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../auth/hooks/useAuth';
import { getDashboardStats } from '../services/dashboardService';

const DEFAULT_STATS = {
  activeCampaigns: 0,
  totalEntries: 0,
  downloads: 0
};

export function useDashboardStats() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let isLoadingInitialData = true;

    async function loadStats() {
      if (!user?.id) {
        if (!isMounted) return;
        setStats(DEFAULT_STATS);
        setError('');
        setLoading(false);
        return;
      }

      if (isLoadingInitialData && isMounted) {
        setLoading(true);
      }

      try {
        const data = await getDashboardStats(user.id);
        if (!isMounted) return;
        setStats(data);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load dashboard stats.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
        isLoadingInitialData = false;
      }
    }

    if (!authLoading) {
      loadStats();
    }

    if (authLoading || !user?.id) {
      return () => {
        isMounted = false;
      };
    }

    const channel = supabase
      .channel(`dashboard-stats-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'campaigns' },
        () => {
          loadStats();
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, () => {
        loadStats();
      })
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'download_tokens' },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [authLoading, user?.id]);

  return {
    stats,
    loading: authLoading || loading,
    error
  };
}
