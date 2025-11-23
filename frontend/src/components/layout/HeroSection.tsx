import { Link2, Zap, Shield, Clock } from "lucide-react";

/**
 * Hero section component - Compact and focused for URL shortener
 */
export function HeroSection() {
  return (
    <div className="text-center">
      {/* Logo/Brand */}
      <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-6 shadow-lg">
        <Link2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
      </div>

      {/* Main heading */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-3">
        <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
          LinkSnap
        </span>
      </h1>

      {/* Subheading */}
      <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto">
        Shorten your links instantly. Free, fast, and secure.
      </p>

      {/* Feature badges */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Zap className="w-3.5 h-3.5" />
          <span className="font-medium">Instant</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Shield className="w-3.5 h-3.5" />
          <span className="font-medium">Secure</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-medium">No Sign-up</span>
        </div>
      </div>
    </div>
  );
}

