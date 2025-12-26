import { UrlForm } from "@/components/features/url-shortener/UrlForm";
import { HistoryList } from "@/components/features/history/HistoryList";
import { HeroSection } from "@/components/layout/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { useUrlShortening } from "@/hooks/useUrlShortening";
import { Card, CardContent } from "@/components/ui/card";
import { Link2 } from "lucide-react";

function App() {
  const { refreshTrigger, handleSuccess } = useUrlShortening();

  return (
    <div className="min-h-screen bg-background">
      {/* Modern subtle background pattern */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      {/* Content Container */}
      <div className="relative">
        {/* Header Section - Sticky on mobile */}
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40 supports-[backdrop-filter]:bg-background/80">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
            <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-sm">
                  <Link2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-primary-foreground" />
                </div>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                  LinkSnap
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-4 sm:py-6 lg:py-12">
          {/* Hero Section */}
          <section className="text-center mb-6 sm:mb-8 lg:mb-12">
            <HeroSection />
          </section>

          {/* URL Shortener Card */}
          <section className="mb-6 sm:mb-8 lg:mb-12">
            <Card className="border shadow-lg bg-card">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                <UrlForm onSuccess={handleSuccess} />
              </CardContent>
            </Card>
          </section>

          {/* History Section */}
          <section>
            <HistoryList refreshTrigger={refreshTrigger} />
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
