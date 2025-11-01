import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

/**
 * Empty state component displayed when there are no shortened URLs in history
 */
export function EmptyHistory() {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="pt-8 sm:pt-12 pb-8 sm:pb-12 text-center px-4 sm:px-6">
        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-muted mb-4">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold mb-2">
          Your link history will appear here
        </h3>
        <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto">
          Create your first short link above to get started! All your shortened
          URLs will be saved here for easy access.
        </p>
      </CardContent>
    </Card>
  );
}

