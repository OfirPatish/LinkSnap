import { Separator } from "@/components/ui/separator";

/**
 * Footer component with copyright and technology credits
 */
export function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 text-center">
      <Separator className="mb-6" />
      <div className="space-y-2">
        <p className="text-xs sm:text-sm text-muted-foreground/70">
          Built with React, TypeScript, and shadcn/ui
        </p>
        <p className="text-xs text-muted-foreground/50">
          © {new Date().getFullYear()} LinkSnap. Simple URL shortening, done
          right.
        </p>
      </div>
    </footer>
  );
}

