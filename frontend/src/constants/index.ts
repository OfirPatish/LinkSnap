/**
 * Application constants
 */

// Use environment variable for API base URL, or default to relative path for same-domain deployment
// In production (Render), set VITE_API_BASE to your backend URL (e.g., https://linksnap-backend.onrender.com)
// For same-domain deployment, use "/api" (relative path)
export const API_BASE = import.meta.env.VITE_API_BASE || "/api";
export const STORAGE_KEY = "linksnap_history";
export const MAX_HISTORY_ITEMS = 100;
