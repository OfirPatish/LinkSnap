import { CheckCircle2, Sparkles } from "lucide-react";

/**
 * Hero section component with badge, heading, and feature tags
 * Displays the main value proposition of the application
 */
export function HeroSection() {
  return (
    <div className="text-center mb-8 sm:mb-10 lg:mb-12 relative">
      {/* Floating badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 backdrop-blur-sm">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium text-primary">
          Free • Fast • Simple
        </span>
      </div>

      {/* Main heading with gradient */}
      <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
        <span className="block mb-2">Transform Your</span>
        <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
          Long Links
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-lg sm:text-xl lg:text-2xl text-foreground/80 max-w-3xl mx-auto mb-4 font-medium">
        Into memorable, shareable short URLs
      </p>

      {/* Feature tags */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          No sign-up needed
        </span>
        <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-muted-foreground/40"></span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Instant results
        </span>
        <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-muted-foreground/40"></span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          Forever free
        </span>
      </div>
    </div>
  );
}

