import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

/**
 * Empty state component displayed when there are no shortened URLs in history
 */
export function EmptyHistory() {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-12 sm:pt-16 pb-12 sm:pb-16 text-center px-4">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted mb-4">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground">
          No links yet
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Shorten your first URL above and it will appear here.
        </p>
      </CardContent>
    </Card>
  );
}

