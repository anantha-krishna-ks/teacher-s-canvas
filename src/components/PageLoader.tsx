import { useEffect, useState } from "react";

interface PageLoaderProps {
  /** Delay (ms) before the spinner is rendered. Avoids flicker for fast loads. */
  delay?: number;
}

const PageLoader = ({ delay = 200 }: PageLoaderProps) => {
  const [show, setShow] = useState(delay === 0);

  useEffect(() => {
    if (delay === 0) return;
    const t = window.setTimeout(() => setShow(true), delay);
    return () => window.clearTimeout(t);
  }, [delay]);

  if (!show) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in">
      {/* Animated rings */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-[3px] border-primary/20" />
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary animate-spin" />
        <div
          className="absolute inset-[6px] rounded-full border-[3px] border-transparent border-b-primary/60 animate-spin"
          style={{ animationDirection: "reverse", animationDuration: "0.8s" }}
        />
        <div className="absolute inset-[12px] rounded-full bg-primary/10 animate-pulse" />
      </div>

      {/* Shimmer bar */}
      <div className="w-40 h-1 rounded-full bg-muted overflow-hidden">
        <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-primary to-transparent animate-[shimmer_1.5s_ease-in-out_infinite]" />
      </div>

      <p className="text-sm text-muted-foreground font-medium tracking-wide">Loading...</p>
    </div>
  );
};

export default PageLoader;
