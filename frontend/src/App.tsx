import { UrlForm } from "@/components/features/url-shortener/UrlForm";
import { HistoryList } from "@/components/features/history/HistoryList";
import { HeroSection } from "@/components/layout/HeroSection";
import { Footer } from "@/components/layout/Footer";
import { useUrlShortening } from "@/hooks/useUrlShortening";
import { Card, CardContent } from "@/components/ui/card";

function App() {
  const { refreshTrigger, handleSuccess } = useUrlShortening();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 -z-10 opacity-[0.02] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

      {/* Gradient orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-4xl relative z-10">
        {/* Header Section */}
        <header className="text-center mb-8 sm:mb-12">
          <HeroSection />
        </header>

        {/* Main URL Shortener Section */}
        <section className="mb-12 sm:mb-16">
          <Card className="border-2 shadow-2xl bg-card/98 backdrop-blur-md">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <UrlForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>
        </section>

        {/* History Section */}
        <main className="mb-8">
          <HistoryList refreshTrigger={refreshTrigger} />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;
