/**
 * Footer component with copyright and technology credits
 */
export function Footer() {
  return (
    <footer className="mt-16 sm:mt-20 pt-8 border-t">
      <div className="text-center space-y-2">
        <p className="text-xs sm:text-sm text-muted-foreground/60">
          © {new Date().getFullYear()} LinkSnap. Free URL shortener powered by
          React & TypeScript.
        </p>
      </div>
    </footer>
  );
}

