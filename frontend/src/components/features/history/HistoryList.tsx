import { useState, useEffect } from "react";
import { getHistory, clearHistory } from "@/lib/storage/history";
import type { HistoryItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStats } from "@/hooks/useStats";
import { useClipboard } from "@/hooks/useClipboard";
import { EmptyHistory } from "./EmptyHistory";
import { HistoryItem as HistoryItemComponent } from "./HistoryItem";
import { Trash2, AlertCircle } from "lucide-react";

interface HistoryListProps {
  refreshTrigger?: number;
}

/**
 * History List Component
 * Displays all shortened URLs with stats and actions
 */
export function HistoryList({ refreshTrigger }: HistoryListProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const { toggleStats, getStatsForSlug, isLoadingStats } = useStats();
  const { copy, isCopied } = useClipboard();

  useEffect(() => {
    setHistory(getHistory());
  }, [refreshTrigger]);

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    setShowConfirmClear(false);
  };

  if (history.length === 0) {
    return <EmptyHistory />;
  }

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between pb-3 border-b gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-foreground truncate">
              Recent Links
            </h2>
            <Badge
              variant="secondary"
              className="font-mono text-xs px-1.5 sm:px-2 py-0.5 shrink-0"
            >
              {history.length}
            </Badge>
          </div>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowConfirmClear(true)}
              className="h-9 sm:h-8 px-2 sm:px-3 text-xs shrink-0 touch-manipulation"
              aria-label="Clear all history"
            >
              <Trash2 className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Clear</span>
            </Button>
          )}
        </div>

        {showConfirmClear && (
          <Alert
            variant="destructive"
            role="alert"
            aria-live="polite"
            className="animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-sm">
                Are you sure you want to clear all {history.length}{" "}
                {history.length === 1 ? "link" : "links"}? This action cannot be
                undone.
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowConfirmClear(false)}
                  className="h-8"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearHistory}
                  className="h-8"
                >
                  Clear All
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-3 sm:gap-4">
          {history.map((item, index) => {
            const itemStats = getStatsForSlug(item.slug);
            const isLoading = isLoadingStats(item.slug);
            const itemIsCopied = isCopied(item.slug);

            return (
              <HistoryItemComponent
                key={item.slug}
                item={item}
                stats={itemStats}
                isLoadingStats={isLoading}
                isCopied={itemIsCopied}
                onToggleStats={() => toggleStats(item.slug)}
                onCopy={() => copy(item.shortUrl, item.slug)}
                animationDelay={index * 50}
              />
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}
