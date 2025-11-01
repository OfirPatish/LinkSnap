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
 * Clean Shadcn-inspired design with proper spacing and typography
 */
export function HistoryStats({ stats }: HistoryStatsProps) {
  const isActive = stats.clicks > 0;

  return (
    <CardContent className="pt-4 pb-6 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="space-y-4">
        {/* Stats Header */}
        <div className="flex items-center justify-between pb-2 border-b">
          <h4 className="text-sm font-semibold">Link Statistics</h4>
          {isActive && (
            <Badge variant="secondary" className="gap-1.5 text-xs">
              <TrendingUp className="h-3 w-3" />
              Active
            </Badge>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Total Clicks */}
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground shrink-0">
              <MousePointerClick className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-2xl font-bold tabular-nums">
                {stats.clicks.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Clicks</p>
            </div>
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted text-muted-foreground shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold">
                {formatDate(stats.createdAt)}
              </p>
              <p className="text-sm text-muted-foreground">Created</p>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  );
}
