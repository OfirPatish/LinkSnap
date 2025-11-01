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
    let errorMessage = "Failed to shorten URL";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Invalid response from server");
  }
}

export async function getStats(slug: string): Promise<StatsResponse> {
  const response = await fetch(`${API_BASE}/stats/${slug}`);

  if (!response.ok) {
    let errorMessage = "Failed to get stats";
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Invalid response from server");
  }
}
