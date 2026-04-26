import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useAuth } from '../../auth/hooks/useAuth';
import { getCampaignAnalytics } from '../services/analyticsService';

const DEFAULT_ANALYTICS = {
  pageViews: 0,
  entries: 0,
  downloads: 0
};

export function useCampaignAnalytics(campaignId) {
  const { user, loading: authLoading } = useAuth();
  const [analytics, setAnalytics] = useState(DEFAULT_ANALYTICS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let isInitialLoad = true;

    async function loadAnalytics() {
      if (!campaignId || !user?.id) {
        if (!isMounted) return;
        setAnalytics(DEFAULT_ANALYTICS);
        setError('');
        setLoading(false);
        return;
      }

      if (isInitialLoad && isMounted) {
        setLoading(true);
      }

      try {
        const data = await getCampaignAnalytics({ campaignId, userId: user.id });
        if (!isMounted) return;
        setAnalytics(data);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load campaign analytics.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
        isInitialLoad = false;
      }
    }

    if (!authLoading) {
      loadAnalytics();
    }

    if (authLoading || !campaignId || !user?.id) {
      return () => {
        isMounted = false;
      };
    }

    const channel = supabase
      .channel(`campaign-analytics-${campaignId}-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'campaigns', filter: `id=eq.${campaignId}` },
        () => {
          loadAnalytics();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entries', filter: `campaign_id=eq.${campaignId}` },
        () => {
          loadAnalytics();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'download_tokens',
          filter: `campaign_id=eq.${campaignId}`
        },
        () => {
          loadAnalytics();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [authLoading, campaignId, user?.id]);

  return {
    analytics,
    loading: authLoading || loading,
    error
  };
}
