import type { HistoryItem as HistoryItemType, StatsResponse } from "@/types";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Copy,
  ExternalLink,
  BarChart3,
  Loader2,
  CheckCheck,
} from "lucide-react";
import { HistoryStats } from "./HistoryStats";

interface HistoryItemProps {
  item: HistoryItemType;
  stats?: StatsResponse;
  isLoadingStats: boolean;
  isCopied: boolean;
  onToggleStats: () => void;
  onCopy: () => void;
  animationDelay?: number;
}

/**
 * Individual history item card component
 * Displays shortened URL, original URL, and optional stats
 */
export function HistoryItem({
  item,
  stats,
  isLoadingStats,
  isCopied,
  onToggleStats,
  onCopy,
  animationDelay = 0,
}: HistoryItemProps) {
  return (
    <Card
      className="border transition-all hover:shadow-md"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardHeader className="pb-3 sm:pb-4">
        <div className="space-y-3">
          {/* Short URL Row */}
          <div className="flex items-start gap-2">
            <code className="flex-1 min-w-0 text-xs sm:text-sm font-medium text-primary font-mono bg-primary/5 px-2 sm:px-3 py-2 rounded-md border border-primary/10 break-all">
              {item.shortUrl}
            </code>
            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onCopy}
                    className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
                    aria-label={
                      isCopied
                        ? "Copied to clipboard"
                        : "Copy short link to clipboard"
                    }
                  >
                    {isCopied ? (
                      <CheckCheck
                        className="h-4 w-4 sm:h-5 sm:w-5 text-green-600"
                        aria-hidden="true"
                      />
                    ) : (
                      <Copy
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        aria-hidden="true"
                      />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isCopied
                    ? "Copied to clipboard!"
                    : "Click to copy this link"}
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    asChild
                    className="h-9 w-9 sm:h-10 sm:w-10 touch-manipulation"
                  >
                    <a
                      href={item.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open short link in new tab"
                    >
                      <ExternalLink
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        aria-hidden="true"
                      />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open in new tab</TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Original URL */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p
              className="text-xs sm:text-sm text-muted-foreground break-words flex-1 min-w-0"
              title={item.url}
            >
              {item.url}
            </p>
            <Button
              variant={stats ? "default" : "outline"}
              size="sm"
              onClick={onToggleStats}
              disabled={isLoadingStats}
              className="h-9 sm:h-8 px-3 sm:px-3 text-xs w-full sm:w-auto touch-manipulation shrink-0"
              aria-label={stats ? "Hide statistics" : "View statistics"}
              aria-expanded={!!stats}
            >
              {isLoadingStats ? (
                <Loader2
                  className="h-3.5 w-3.5 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              <span className="ml-1.5 hidden sm:inline">
                {stats ? "Hide" : "Stats"}
              </span>
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Stats Display */}
      {stats && <HistoryStats stats={stats} />}
    </Card>
  );
}
