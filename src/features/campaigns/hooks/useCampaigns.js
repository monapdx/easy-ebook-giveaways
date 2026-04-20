import { useEffect, useState } from 'react';
import { getCampaigns } from '../services/campaignService';

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadCampaigns() {
      try {
        const data = await getCampaigns();

        if (!isMounted) return;
        setCampaigns(data ?? []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message || 'Failed to load campaigns.');
      } finally {
        if (!isMounted) return;
        setLoading(false);
      }
    }

    loadCampaigns();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    campaigns,
    loading,
    error
  };
}