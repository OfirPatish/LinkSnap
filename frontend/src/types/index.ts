/**
 * Shared types for the frontend
 * Matches backend API reference types
 */

// Request types
export interface ShortenUrlRequest {
  url: string;
}

// Response types
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

export interface HealthCheckResponse {
  status: "ok" | "unhealthy";
  database: "connected" | "disconnected";
  timestamp: string;
  uptime?: number;
}

// Error response type
export interface ErrorResponse {
  error: string;
  details?: Array<{
    path: string[];
    message: string;
  }>;
}

// Frontend-specific types
export interface HistoryItem {
  slug: string;
  shortUrl: string;
  url: string;
  createdAt: string;
}

