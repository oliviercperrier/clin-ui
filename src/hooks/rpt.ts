import { useEffect, useState, useCallback } from 'react';
import { decodeRptAccess, rptRequest } from 'auth/rpt';
import { useAxiosBasicWithAuth } from 'hooks/axios';

export const useRpt = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [rpt, setRpt] = useState('');
  const [decodedRpt, setDecodedRpt] = useState('');
  const axiosInstance = useAxiosBasicWithAuth();

  const fetchRpt = useCallback(async () => {
    try {
      const response = await rptRequest(axiosInstance);
      setRpt(response.data.access_token);
      setDecodedRpt(decodeRptAccess(response));
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [axiosInstance]);

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
