/**
 * Shared types for the frontend
 */

export interface ShortenResponse {
  slug: string;
  shortUrl: string;
  url: string;
}

export interface StatsResponse {
  slug: string;
  url: string;
  clicks: number;
  createdAt: string;
}

export interface HistoryItem {
  slug: string;
  shortUrl: string;
  url: string;
  createdAt: string;
}

