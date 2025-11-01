import { UrlForm } from "./components/UrlForm";
import { HistoryList } from "./components/HistoryList";
import { ThemeToggle } from "./components/ThemeToggle";
import { HeroSection } from "./components/sections/HeroSection";
import { Footer } from "./components/sections/Footer";
import { BackgroundDecoration } from "./components/sections/BackgroundDecoration";
import { useUrlShortening } from "./hooks/useUrlShortening";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function App() {
  const { refreshTrigger, handleSuccess } = useUrlShortening();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
      <BackgroundDecoration />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-5xl relative z-10">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>

        {/* Hero Section with Integrated Form */}
        <section className="mb-12 sm:mb-16 lg:mb-20">
          <HeroSection />

          {/* Main Form Card */}
          <Card className="max-w-3xl mx-auto border-2 shadow-xl">
            <CardContent className="pt-8 pb-8 sm:pt-10 sm:pb-10">
              <UrlForm onSuccess={handleSuccess} />
            </CardContent>
          </Card>

          {/* Use Cases - Below Form */}
          <div className="mt-8 sm:mt-10 max-w-3xl mx-auto">
            <p className="text-center text-sm text-muted-foreground mb-4 font-medium">
              Perfect for social media, marketing, and sharing
            </p>
          </div>
        </section>

        <main className="space-y-8 sm:space-y-10 lg:space-y-12">
          {/* Separator */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Separator className="flex-1" />
            <span className="text-xs sm:text-sm text-muted-foreground font-medium whitespace-nowrap">
              Your Links
            </span>
            <Separator className="flex-1" />
          </div>

          {/* History Section */}
          <HistoryList refreshTrigger={refreshTrigger} />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;
