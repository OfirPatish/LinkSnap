import { useState } from "react";

/**
 * Custom hook for managing URL shortening refresh trigger
 * @returns Object with refresh trigger and success handler
 */
export function useUrlShortening() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    // Refresh history list to show the new link
    setRefreshTrigger((prev) => prev + 1);
  };

  return {
    refreshTrigger,
    handleSuccess,
  };
}
