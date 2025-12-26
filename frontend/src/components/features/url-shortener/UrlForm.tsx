import { useState, useEffect, useRef } from "react";
import { shortenUrl } from "@/lib/api/url";
import type { ShortenResponse } from "@/types";
import { addToHistory } from "@/lib/storage/history";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Zap, Link as LinkIcon } from "lucide-react";

interface UrlFormProps {
  onSuccess: (result?: ShortenResponse) => void;
}

/**
 * URL Shortener Form Component
 * Handles URL input, validation, and submission
 * Automatically cancels requests on unmount to prevent memory leaks
 */
export function UrlForm({ onSuccess }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount - cancel pending request
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    if (!url.trim()) {
      setError("Please paste a URL to get started");
      return;
    }

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    try {
      const result = await shortenUrl(url.trim(), controller.signal);

      // Only update if request wasn't aborted
      if (!controller.signal.aborted) {
        addToHistory({
          slug: result.slug,
          shortUrl: result.shortUrl,
          url: result.url,
          createdAt: new Date().toISOString(),
        });

        setUrl("");
        onSuccess(result);
      }
    } catch (err) {
      // Don't show error for aborted requests
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      // Display backend error message directly (backend provides user-friendly messages)
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
      abortControllerRef.current = null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      aria-label="URL Shortener Form"
    >
      <div className="space-y-3">
        <label
          htmlFor="url-input"
          className="text-sm font-medium text-foreground block"
        >
          Paste your long URL
        </label>
        <div className="flex flex-col gap-3">
          <div className="relative">
            <LinkIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              disabled={loading}
              className="h-12 sm:h-14 text-base sm:text-base pl-10 pr-4 border focus-visible:ring-2 focus-visible:ring-primary touch-manipulation"
              aria-label="URL to shorten"
              aria-describedby={error ? "url-error" : "url-hint"}
              aria-invalid={!!error}
              aria-required="true"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !url.trim()}
            size="lg"
            className="w-full h-12 sm:h-14 text-base font-medium touch-manipulation"
            aria-label={loading ? "Creating short link" : "Create short link"}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin mr-2" />
                <span>Shortening...</span>
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span>Shorten URL</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          id="url-error"
          variant="destructive"
          role="alert"
          aria-live="polite"
          className="animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <AlertCircle className="h-4 w-4" aria-hidden="true" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <p id="url-hint" className="text-xs text-muted-foreground text-center">
        Supports HTTP and HTTPS URLs • No registration required
      </p>
    </form>
  );
}
