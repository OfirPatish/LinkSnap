/**
 * Application constants
 */

// Use environment variable for API base URL, or default to localhost for development
// In production, set VITE_API_BASE to your backend URL (e.g., https://linksnap-backend.onrender.com)
// Defaults to http://localhost:4000 for development (matches backend default port)
export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
export const STORAGE_KEY = "linksnap_history";
export const MAX_HISTORY_ITEMS = 100;
