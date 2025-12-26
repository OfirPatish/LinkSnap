import { Zap, Shield, Clock } from "lucide-react";

/**
 * Hero section component - Compact and focused for URL shortener
 */
export function HeroSection() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main heading */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-foreground leading-tight">
        Shorten Your Links
        <br className="hidden sm:block" />
        <span className="text-primary"> Instantly</span>
      </h1>

      {/* Subheading */}
      <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-xl mx-auto px-2">
        Create short, memorable links for free. No sign-up required.
      </p>

      {/* Feature badges - Horizontal layout */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs sm:text-sm">
          <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Instant</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs sm:text-sm">
          <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Secure</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-muted text-muted-foreground text-xs sm:text-sm">
          <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>Free</span>
        </div>
      </div>
    </div>
  );
}

