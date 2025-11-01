import { useState } from "react";
import { shortenUrl } from "../lib/api";
import type { ShortenResponse } from "@/types";
import { addToHistory } from "../lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, Zap, Link as LinkIcon } from "lucide-react";

interface UrlFormProps {
  onSuccess: (result?: ShortenResponse) => void;
}

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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-stretch">
        <div className="flex-1 relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste your long URL here..."
            disabled={loading}
            className="h-12 text-base sm:text-sm pl-10"
          />
        </div>
        <Button
          type="submit"
          disabled={loading || !url.trim()}
          size="lg"
          className="w-full sm:w-auto px-6 sm:px-8 h-12"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="hidden sm:inline">Creating...</span>
              <span className="sm:hidden">Creating</span>
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Create Link</span>
              <span className="sm:hidden">Create</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <Alert
          variant="destructive"
          className="animate-in fade-in slide-in-from-top-1 duration-200"
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      <p className="text-xs text-muted-foreground flex items-center gap-1">
        <span>💡</span>
        <span>Tip: You can paste any URL from your browser's address bar</span>
      </p>
    </form>
  );
}
