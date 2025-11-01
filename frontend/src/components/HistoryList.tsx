import { useState, useEffect } from "react";
import { getHistory, clearHistory } from "../lib/storage";
import type { HistoryItem } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStats } from "../hooks/useStats";
import { useClipboard } from "../hooks/useClipboard";
import { EmptyHistory } from "./features/EmptyHistory";
import { HistoryItem as HistoryItemComponent } from "./history/HistoryItem";
import { Trash2, AlertCircle } from "lucide-react";

interface HistoryListProps {
  refreshTrigger?: number;
}

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
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
            Recent Links
          </h2>
          <div className="flex items-center gap-2 sm:gap-3">
            <Badge variant="secondary" className="font-mono shrink-0">
              {history.length} {history.length === 1 ? "link" : "links"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmClear(true)}
              className="shrink-0"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Clear History</span>
              <span className="sm:hidden">Clear</span>
            </Button>
          </div>
        </div>

        {showConfirmClear && (
          <Alert
            variant="destructive"
            className="animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <AlertCircle className="h-4 w-4" />
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

        <div className="grid gap-4">
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
