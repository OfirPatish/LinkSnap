import type { ShortenResponse, StatsResponse } from "@/types";
import { API_BASE } from "@/constants";

export async function shortenUrl(url: string): Promise<ShortenResponse> {
  const response = await fetch(`${API_BASE}/shorten`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to shorten URL" }));
    throw new Error(error.error || "Failed to shorten URL");
  }

  return response.json();
}

export async function getStats(slug: string): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE}/stats/${slug}`);

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Failed to get stats" }));
    throw new Error(error.error || "Failed to get stats");
  }

  return response.json();
}
