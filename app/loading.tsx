export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-2 border-border border-t-primary" />
        <div className="absolute inset-0 h-16 w-16 animate-spin-slow rounded-full border-2 border-transparent border-b-accent" />
        <span className="sr-only">Loading…</span>
      </div>
    </div>
  );
}
