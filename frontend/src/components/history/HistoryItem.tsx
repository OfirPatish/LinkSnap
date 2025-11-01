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
      className="transition-all hover:shadow-md border-l-4 border-l-primary/50 animate-in fade-in slide-in-from-bottom-2"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-start justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0 space-y-3 w-full sm:w-auto">
            {/* Short URL */}
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-xs sm:text-sm lg:text-base font-semibold text-primary font-mono bg-primary/5 px-2 sm:px-3 py-1 rounded-md border border-primary/20 break-all">
                {item.shortUrl}
              </code>
              <div className="flex items-center gap-1 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={onCopy}
                      className="shrink-0"
                    >
                      {isCopied ? (
                        <CheckCheck className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
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
                      size="icon-sm"
                      asChild
                      className="shrink-0"
                    >
                      <a
                        href={item.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Test this link in a new tab</TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Original URL */}
            <div className="flex items-start gap-2">
              <div
                className="text-xs sm:text-sm text-muted-foreground break-words max-w-full"
                title={item.url}
              >
                <span className="font-medium">→</span> {item.url}
              </div>
            </div>
          </div>

          {/* Stats Button */}
          <Button
            variant={stats ? "default" : "outline"}
            size="sm"
            onClick={onToggleStats}
            disabled={isLoadingStats}
            className="shrink-0 w-full sm:w-auto"
          >
            {isLoadingStats ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BarChart3 className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">
              {stats ? "Hide Stats" : "View Stats"}
            </span>
            <span className="ml-2 sm:hidden">{stats ? "Hide" : "Stats"}</span>
          </Button>
        </div>
      </CardHeader>

      {/* Stats Display */}
      {stats && <HistoryStats stats={stats} />}
    </Card>
  );
}
