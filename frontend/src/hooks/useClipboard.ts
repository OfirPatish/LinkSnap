import { useState } from "react";

/**
 * Custom hook for handling clipboard operations with success state tracking
 * @param timeout - Time in milliseconds to keep copied state active (default: 2000ms)
 * @returns Object with copy function and copied state
 */
export function useClipboard(timeout: number = 2000) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copy = async (text: string, id?: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (id) {
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), timeout);
      }
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      throw error;
    }
  };

  const isCopied = (id?: string) => {
    if (!id) return false;
    return copiedId === id;
  };

  return { copy, isCopied };
}
