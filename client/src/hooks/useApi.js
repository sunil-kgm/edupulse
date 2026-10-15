import { useState, useEffect, useCallback } from 'react';

/**
 * Generic data-fetching hook with loading, error, and refetch support.
 * Falls back gracefully when backend is unavailable.
 *
 * @param {Function} apiFn  - Async function that returns an axios response
 * @param {*}        fallback - Mock data to use when the API call fails
 * @param {Array}    deps    - Extra dependencies that trigger a re-fetch
 */
export function useApi(apiFn, fallback = null, deps = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLive, setIsLive] = useState(false); // true = real backend returned data

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn();
      setData(res.data);
      setIsLive(true);
    } catch (err) {
      // If backend is down or returns 4xx/5xx, fall back to mock data silently
      if (fallback !== null) {
        setData(fallback);
        setIsLive(false);
      } else {
        setError(err?.response?.data?.message || err.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    fetch();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch]);

  return { data, setData, loading, error, refetch: fetch, isLive };
}

/**
 * Mutation hook — wraps a write operation (POST/PUT/PATCH/DELETE).
 *
 * @returns {{ mutate, loading, error, data }}
 */
export function useMutation(apiFn) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const mutate = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiFn(...args);
      setData(res.data);
      return { success: true, data: res.data };
    } catch (err) {
      const msg = err?.response?.data?.message || err.message || 'Operation failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [apiFn]);

  return { mutate, loading, error, data };
}
