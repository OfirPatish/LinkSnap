import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

/**
 * Empty state component displayed when there are no shortened URLs in history
 */
export function EmptyHistory() {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="pt-12 sm:pt-16 pb-12 sm:pb-16 text-center px-4 sm:px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-muted mb-6">
          <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">
          No links yet
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
          Shorten your first URL above and it will appear here. All your
          shortened links are saved locally in your browser.
        </p>
      </CardContent>
    </Card>
  );
}

