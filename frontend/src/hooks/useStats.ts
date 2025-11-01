import { useState } from "react";
import { getStats } from "@/lib/api";
import type { StatsResponse } from "@/types";

/**
 * Custom hook for managing stats fetching and display state
 * @returns Object with stats state, loading state, and toggle function
 */
export function useStats() {
  const [stats, setStats] = useState<Record<string, StatsResponse>>({});
  const [loadingStats, setLoadingStats] = useState<Record<string, boolean>>({});

  const toggleStats = async (slug: string) => {
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

    // Fetch stats
    setLoadingStats((prev) => ({ ...prev, [slug]: true }));
    try {
      const statsData = await getStats(slug);
      setStats((prev) => ({ ...prev, [slug]: statsData }));
    } catch (err) {
      console.error("Failed to load stats:", err);
    } finally {
      setLoadingStats((prev) => ({ ...prev, [slug]: false }));
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
