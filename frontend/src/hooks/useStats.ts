import { useState, useEffect, useRef } from "react";
import { getStats } from "@/lib/api/url";
import type { StatsResponse } from "@/types";

/**
 * Custom hook for managing stats fetching and display state
 * Automatically cancels requests on unmount to prevent memory leaks
 * @returns Object with stats state, loading state, and toggle function
 */
export function useStats() {
  const [stats, setStats] = useState<Record<string, StatsResponse>>({});
  const [loadingStats, setLoadingStats] = useState<Record<string, boolean>>({});
  const abortControllersRef = useRef<Record<string, AbortController>>({});

  // Cleanup on unmount - cancel all pending requests
  useEffect(() => {
    return () => {
      // Cancel all pending requests on unmount
      Object.values(abortControllersRef.current).forEach((controller) => {
        controller.abort();
      });
    };
  }, []);

  const toggleStats = async (slug: string) => {
    // Cancel previous request for this slug if exists
    if (abortControllersRef.current[slug]) {
      abortControllersRef.current[slug].abort();
      delete abortControllersRef.current[slug];
    }

    // If stats already loaded, hide them
    if (stats[slug]) {
      setStats((prev) => {
        const newStats = { ...prev };
        delete newStats[slug];
        return newStats;
      });
      return;
    }

    // Prevent duplicate requests
    if (loadingStats[slug]) return;

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllersRef.current[slug] = controller;

    // Fetch stats
    setLoadingStats((prev) => ({ ...prev, [slug]: true }));
    try {
      const statsData = await getStats(slug, controller.signal);
      // Only update if request wasn't aborted
      if (!controller.signal.aborted) {
        setStats((prev) => ({ ...prev, [slug]: statsData }));
      }
    } catch (err) {
      // Don't log aborted requests as errors
      if (err instanceof Error && err.name !== "AbortError") {
        console.error("Failed to load stats:", err);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoadingStats((prev) => ({ ...prev, [slug]: false }));
      }
      delete abortControllersRef.current[slug];
    }
  };

  const getStatsForSlug = (slug: string): StatsResponse | undefined => {
    return stats[slug];
  };

  const isLoadingStats = (slug: string): boolean => {
    return loadingStats[slug] ?? false;
  };

  return {
    stats,
    toggleStats,
    getStatsForSlug,
    isLoadingStats,
  };
}
