import { useEffect, useState, useCallback } from 'react';
import { decodeRptAccess, fetchRptToken } from 'auth/rpt';

export const useRpt = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [rpt, setRpt] = useState('');
  const [decodedRpt, setDecodedRpt] = useState('');

  const fetchRpt = useCallback(async () => {
    try {
      const response = await fetchRptToken();
      setRpt(response.data!.access_token);
      setDecodedRpt(decodeRptAccess(response));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => await fetchRpt())();
  }, [fetchRpt]);

  return {
    loading,
    decodedRpt,
    rpt,
    error,
  };
};
