/**
 * Background decoration component with subtle patterns and gradients
 * Used to add visual depth to the page background
 */
export function BackgroundDecoration() {
  return (
    <>
      {/* Subtle background decoration */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </>
  );
}
