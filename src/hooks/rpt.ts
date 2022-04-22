import { useEffect, useState, useCallback } from 'react';
import { decodeRptAccess, fetchRptToken } from 'auth/rpt';
import { DecodedRpt } from 'auth/types';

export const useRpt = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [rpt, setRpt] = useState('');
  const [decodedRpt, setDecodedRpt] = useState<DecodedRpt>();

  const fetchRpt = useCallback(async () => {
    try {
      const response = await fetchRptToken();
      setRpt(response.access_token);
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
