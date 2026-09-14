import { useState, useEffect } from 'react';

/**
 * Platform Metrics Data Contract
 *
 * Defines the schema for live system telemetry across CivicAccess.
 * When backend endpoints become active (e.g. GET /api/v1/metrics),
 * connect the fetch implementation in `fetchLivePlatformMetrics`.
 */
export const DEFAULT_PLATFORM_METRICS = {
  totalReports: 0,
  resolved: 0,
  citiesCovered: 0,
  activeAdvocates: 0,
  avgResolutionDays: 0,
  resolutionRate: 0,
  isLive: false,
};

/**
 * Service function to retrieve live platform metrics from backend API.
 * In the frontend-only release, returns the honest initial/empty baseline.
 *
 * @param {AbortSignal} [signal] - Optional abort signal for component unmount
 * @returns {Promise<typeof DEFAULT_PLATFORM_METRICS>}
 */
export async function fetchLivePlatformMetrics(signal) {
  // Backend integration hook:
  // const res = await fetch('/api/v1/metrics', { signal });
  // if (!res.ok) throw new Error(`Metrics API returned status ${res.status}`);
  // return await res.json();

  // Return honest zero/empty baseline for frontend-only mode
  return Promise.resolve({
    ...DEFAULT_PLATFORM_METRICS,
  });
}

/**
 * React hook to consume platform metrics in components.
 * Automatically handles loading, error, and data states.
 */
export function usePlatformMetrics() {
  const [data, setData] = useState(DEFAULT_PLATFORM_METRICS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    setLoading(true);
    fetchLivePlatformMetrics(controller.signal)
      .then((metrics) => {
        if (isMounted) {
          setData(metrics);
          setError(null);
        }
      })
      .catch((err) => {
        if (isMounted && err.name !== 'AbortError') {
          setError(err.message || 'Failed to load platform metrics');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  return {
    ...data,
    loading,
    error,
  };
}
