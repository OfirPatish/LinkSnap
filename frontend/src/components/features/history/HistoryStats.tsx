import type { StatsResponse } from "@/types";
import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MousePointerClick, Calendar, TrendingUp } from "lucide-react";
import { formatDate } from "@/utils/date";

interface HistoryStatsProps {
  stats: StatsResponse;
}

/**
 * Component to display statistics for a shortened URL
 */
export function HistoryStats({ stats }: HistoryStatsProps) {
  const isActive = stats.clicks > 0;

  return (
    <CardContent className="pt-4 pb-4 border-t bg-muted/30">
      <div className="space-y-3">
        {/* Stats Header */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Statistics</h4>
          {isActive && (
            <Badge variant="secondary" className="gap-1 text-xs h-5">
              <TrendingUp className="h-2.5 w-2.5" />
              Active
            </Badge>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Total Clicks */}
          <div className="p-2.5 sm:p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <MousePointerClick className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary shrink-0" />
              <p className="text-xs text-muted-foreground truncate">Clicks</p>
            </div>
            <p className="text-lg sm:text-xl font-bold tabular-nums text-foreground">
              {stats.clicks.toLocaleString()}
            </p>
          </div>

          {/* Created Date */}
          <div className="p-2.5 sm:p-3 rounded-lg border bg-card">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
              <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
              <p className="text-xs text-muted-foreground truncate">Created</p>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-foreground break-words">
              {formatDate(stats.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </CardContent>
  );
}

