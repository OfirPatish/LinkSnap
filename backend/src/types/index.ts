/**
 * Shared types for the backend
 */

export interface Link {
  id: number;
  slug: string;
  url: string;
  clicks: number;
  created_at: string;
}

export interface CreateLinkResult {
  slug: string;
  shortUrl: string;
  url: string;
}

export interface LinkStats {
  slug: string;
  url: string;
  clicks: number;
  createdAt: string;
}
