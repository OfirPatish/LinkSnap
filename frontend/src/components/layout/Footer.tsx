/**
 * Footer component with copyright and technology credits
 */
export function Footer() {
  return (
    <footer className="mt-12 sm:mt-16 pt-6 border-t">
      <div className="text-center">
        <p className="text-xs sm:text-sm text-muted-foreground">
          © {new Date().getFullYear()} LinkSnap
        </p>
      </div>
    </footer>
  );
}

