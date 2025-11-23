import type { HistoryItem } from "@/types";
import { STORAGE_KEY, MAX_HISTORY_ITEMS } from "@/constants";

/**
 * Get all history items from localStorage
 */
export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Add a new item to history
 */
export function addToHistory(item: HistoryItem): void {
  try {
    const history = getHistory();
    // Avoid duplicates by checking if slug already exists
    const exists = history.some((h) => h.slug === item.slug);
    if (!exists) {
      history.unshift(item); // Add to beginning
      // Keep only last N items
      const limited = history.slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
    }
  } catch {
    // Ignore storage errors
  }
}

/**
 * Clear all history from localStorage
 */
export function clearHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore storage errors
  }
}

