/**
 * Shared types for the backend
 */

export interface Link {
  id: number;
  slug: string;
  url: string;
  clicks: number;
  created_at: string;
  expires_at?: string | null;
  is_active: number; // SQLite uses INTEGER for boolean (0 or 1)
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
