import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { getEntriesByCampaign } from '../services/entryService';

export function useEntries(campaignId) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let isInitialLoad = true;

    async function loadEntries() {
      if (!campaignId) {
        if (!isMounted) return;
        setEntries([]);
        setError('');
        setLoading(false);
        return;
      }

      if (isInitialLoad && isMounted) {
        setLoading(true);
      }

      try {
        const data = await getEntriesByCampaign(campaignId);
        if (!isMounted) return;
        setEntries(
          (data ?? []).map((entry) => ({
            id: entry.id,
            name: entry.name,
            email: entry.email,
            consentNewsletter: entry.consent_newsletter,
            createdAt: entry.created_at
          }))
        );
        setError('');
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load entries.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
        isInitialLoad = false;
      }
    }

    loadEntries();

    if (!campaignId) {
      return () => {
        isMounted = false;
      };
    }

    const channel = supabase
      .channel(`campaign-entries-${campaignId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'entries', filter: `campaign_id=eq.${campaignId}` },
        () => {
          loadEntries();
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [campaignId]);

  return { entries, loading, error };
}
