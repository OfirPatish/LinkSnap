import type { ShortenResponse, StatsResponse } from "@/types";
import { API_BASE } from "@/constants";

/**
 * Request timeout in milliseconds
 */
const REQUEST_TIMEOUT = 10000; // 10 seconds

/**
 * Maximum number of retry attempts
 */
const MAX_RETRIES = 3;

/**
 * Delay between retries in milliseconds
 */
const RETRY_DELAY = 1000;

/**
 * Sleep utility for retry delays
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a fetch request with timeout
 * Supports both timeout and external abort signal
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = REQUEST_TIMEOUT
): Promise<Response> {
  const timeoutController = new AbortController();
  const timeoutId = setTimeout(() => timeoutController.abort(), timeout);

  // Combine signals if external signal is provided
  let signal: AbortSignal;
  if (options.signal) {
    // Create a combined signal that aborts when either signal aborts
    const combinedController = new AbortController();
    const abort = () => {
      clearTimeout(timeoutId);
      combinedController.abort();
    };
    
    // Listen to both signals
    options.signal.addEventListener("abort", abort);
    timeoutController.signal.addEventListener("abort", abort);
    
    signal = combinedController.signal;
  } else {
    signal = timeoutController.signal;
  }

  try {
    const response = await fetch(url, {
      ...options,
      signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      // Check if it was a timeout or external cancellation
      if (timeoutController.signal.aborted) {
        throw new Error("Request timeout - please check your connection");
      }
      throw new Error("Request cancelled");
    }
    throw error;
  }
}

/**
 * Retry a function with exponential backoff
 */
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = MAX_RETRIES,
  delay: number = RETRY_DELAY
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on client errors (4xx) except 429 (rate limit)
      if (
        error instanceof Error &&
        error.message.includes("status") &&
        !error.message.includes("429")
      ) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Wait before retrying with exponential backoff
      await sleep(delay * Math.pow(2, attempt));
    }
  }

  throw lastError || new Error("Request failed after retries");
}

/**
 * Handle API response errors
 */
async function handleResponse<T>(
  response: Response,
  defaultErrorMessage: string
): Promise<T> {
  if (!response.ok) {
    let errorMessage = defaultErrorMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorMessage;
    } catch {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }

    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }

  try {
    return await response.json();
  } catch {
    throw new Error("Invalid response from server");
  }
}

/**
 * Shorten a URL with retry logic and timeout
 * @param url - The URL to shorten
 * @param signal - Optional AbortSignal to cancel the request
 */
export async function shortenUrl(
  url: string,
  signal?: AbortSignal
): Promise<ShortenResponse> {
  return retryWithBackoff(async () => {
    const response = await fetchWithTimeout(
      `${API_BASE}/shorten`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
        signal, // Add signal support
      }
    );

    return handleResponse<ShortenResponse>(
      response,
      "Failed to shorten URL"
    );
  });
}

/**
 * Get stats for a slug with retry logic and timeout
 * @param slug - The slug to get stats for
 * @param signal - Optional AbortSignal to cancel the request
 */
export async function getStats(
  slug: string,
  signal?: AbortSignal
): Promise<StatsResponse> {
  return retryWithBackoff(async () => {
    const response = await fetchWithTimeout(`${API_BASE}/stats/${slug}`, {
      signal, // Add signal support
    });

    return handleResponse<StatsResponse>(response, "Failed to get stats");
  });
}

