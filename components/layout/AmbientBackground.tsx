export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid mask-radial opacity-[0.35] dark:opacity-[0.25]" />
      <div className="absolute -left-1/4 top-[-10%] h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-[120px] dark:bg-primary/15" />
      <div className="absolute right-[-15%] top-[20%] h-[32rem] w-[32rem] rounded-full bg-accent/20 blur-[120px] dark:bg-accent/15" />
      <div className="absolute bottom-[-20%] left-[20%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/15 blur-[120px] dark:bg-fuchsia-500/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
    </div>
  );
}
