import { useState } from "react";
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
 */
export function UrlForm({ onSuccess }: UrlFormProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url.trim()) {
      setError("Please paste a URL to get started");
      return;
    }

    setLoading(true);
    try {
      const result = await shortenUrl(url.trim());

      addToHistory({
        slug: result.slug,
        shortUrl: result.shortUrl,
        url: result.url,
        createdAt: new Date().toISOString(),
      });

      setUrl("");
      onSuccess(result);
    } catch (err) {
      // Display backend error message directly (backend provides user-friendly messages)
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      aria-label="URL Shortener Form"
    >
      <div className="space-y-2">
        <label
          htmlFor="url-input"
          className="text-sm font-medium text-foreground/80 block"
        >
          Enter your long URL
        </label>
        <div className="flex flex-col sm:flex-row gap-3 items-stretch">
          <div className="flex-1 relative">
            <LinkIcon
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
              aria-hidden="true"
            />
            <Input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url/that/needs/shortening"
              disabled={loading}
              className="h-14 text-base pl-12 pr-4 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary transition-all border-2"
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
            className="w-full sm:w-auto px-8 h-14 text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label={loading ? "Creating short link" : "Create short link"}
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                <span>Shortening...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 mr-2" />
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
        Supports HTTP and HTTPS URLs. No registration required.
      </p>
    </form>
  );
}
