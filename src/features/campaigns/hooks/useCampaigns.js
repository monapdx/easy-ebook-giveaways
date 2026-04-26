import { useEffect, useState } from 'react';
import { deleteCampaign, getCampaigns } from '../services/campaignService';
import { useAuth } from '../../auth/hooks/useAuth';
import { supabase } from '../../../lib/supabaseClient';

export function useCampaigns() {
  const { user, loading: authLoading } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingCampaignId, setDeletingCampaignId] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    let isMounted = true;
    let isInitialLoad = true;

    async function loadCampaigns() {
      if (isInitialLoad && isMounted) {
        setLoading(true);
      }

      try {
        const data = await getCampaigns();

        if (!isMounted) return;
        setCampaigns(data ?? []);
        setError('');
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load campaigns.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
        isInitialLoad = false;
      }
    }

    if (!authLoading) {
      loadCampaigns();
    }

    if (authLoading || !user?.id) {
      return () => {
        isMounted = false;
      };
    }

    const channel = supabase
      .channel(`campaign-list-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'campaigns', filter: `user_id=eq.${user.id}` },
        () => {
          loadCampaigns();
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'entries' }, () => {
        loadCampaigns();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [authLoading, user?.id]);

  return {
    campaigns,
    loading: authLoading || loading,
    error,
    deletingCampaignId,
    deleteError,
    async removeCampaign(campaignId) {
      setDeletingCampaignId(campaignId);
      setDeleteError('');
      try {
        await deleteCampaign(campaignId);
        setCampaigns((currentCampaigns) =>
          currentCampaigns.filter((campaign) => campaign.id !== campaignId)
        );
      } catch (err) {
        setDeleteError(err.message || 'Failed to delete campaign.');
        throw err;
      } finally {
        setDeletingCampaignId('');
      }
    }
  };
}