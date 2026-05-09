import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";

// ── Types ─────────────────────────────────────────────────────────────────────
export type HeroSlide = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  /** Tailwind gradient classes applied to the accent half, e.g. "from-sky-600 to-cyan-500" */
  gradient: string;
  /** Optional solid accent for the diagonal slash — defaults to bg-primary */
  accentClass?: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
};

type Props = {
  slides: HeroSlide[];
  className?: string;
  /** Auto-advance interval in ms. Default 6000. */
  interval?: number;
};

// ── Daily seed ────────────────────────────────────────────────────────────────
/**
 * Returns the index to start on today.
 * Changes every calendar day so returning visitors see a different slide first.
 * Uses day-of-year mod slides.length — no server, no storage, no flicker.
 */
function getDailyStartIndex(total: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return dayOfYear % total;
}

// ── Transition direction tracking ─────────────────────────────────────────────
type Dir = "next" | "prev" | "idle";

// ── Component ─────────────────────────────────────────────────────────────────
const HeroCarousel = ({ slides, className, interval = 6000 }: Props) => {
  const [index, setIndex]   = useState(() => getDailyStartIndex(slides.length));
  const [dir, setDir]       = useState<Dir>("idle");
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TICK        = 60; // ms — progress bar update granularity

  const goTo = useCallback(
    (next: number, direction: Dir) => {
      if (animating) return;
      setDir(direction);
      setAnimating(true);
      setIndex(next);
      setProgress(0);
      setTimeout(() => {
        setAnimating(false);
        setDir("idle");
      }, 420);
    },
    [animating]
  );

  const advance = useCallback(
    () => goTo((index + 1) % slides.length, "next"),
    [goTo, index, slides.length]
  );

  const prev = useCallback(
    () => goTo((index - 1 + slides.length) % slides.length, "prev"),
    [goTo, index, slides.length]
  );

  // Auto-advance + progress bar
  useEffect(() => {
    if (paused) {
      if (timerRef.current)    clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      return;
    }

    setProgress(0);

    timerRef.current = setInterval(advance, interval);
    progressRef.current = setInterval(
      () => setProgress((p) => Math.min(p + (TICK / interval) * 100, 100)),
      TICK
    );

    return () => {
      if (timerRef.current)    clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [paused, advance, interval]);

  const slide = slides[index];

  // CSS classes for enter animation
  const contentMotion = cn(
    "transition-all duration-[420ms] ease-out",
    animating && dir === "next"  && "translate-x-4 opacity-0",
    animating && dir === "prev"  && "-translate-x-4 opacity-0",
    !animating                   && "translate-x-0 opacity-100"
  );

  const imageMotion = cn(
    "transition-all duration-[420ms] ease-out",
    animating && dir === "next"  && "translate-x-3 opacity-0 scale-[1.02]",
    animating && dir === "prev"  && "-translate-x-3 opacity-0 scale-[1.02]",
    !animating                   && "translate-x-0 opacity-100 scale-100"
  );

  return (
    <div
      className={cn("h-full min-h-0", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="relative h-full min-h-0 rounded-2xl overflow-hidden border border-border shadow-sm">

        {/* ── Background gradient ── */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br transition-all duration-700",
            slide.gradient
          )}
          aria-hidden="true"
        />

        {/* ── Diagonal slash accent ── */}
        <div
          className="absolute inset-y-0 right-[40%] w-24 -skew-x-6 opacity-20 bg-white pointer-events-none hidden md:block"
          aria-hidden="true"
        />

        {/* ── Grain overlay for depth ── */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            backgroundSize: "180px 180px",
          }}
          aria-hidden="true"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-0 relative z-10">

          {/* ── Content half ── */}
          <div className="p-6 md:p-9 xl:p-11 flex flex-col justify-center min-h-0">
            <div className={contentMotion}>
              <Badge
                variant="sale"
                className="mb-4 w-fit text-[10px] font-bold px-2.5 py-0.5 tracking-widest uppercase"
              >
                {slide.badge}
              </Badge>

              <h2 className="text-[1.65rem] md:text-[2rem] xl:text-[2.3rem] font-extrabold text-white leading-[1.12] tracking-tight mb-3">
                {slide.title}
              </h2>

              <p className="text-white/70 text-sm md:text-[0.9rem] mb-7 max-w-[22ch] leading-relaxed">
                {slide.subtitle}
              </p>

              <div className="flex flex-wrap gap-2.5">
                <Link
                  to={slide.cta1.href}
                  className="h-10 px-5 inline-flex items-center justify-center rounded-xl bg-white text-primary text-sm font-bold hover:bg-white/90 active:scale-[0.97] transition-all shadow-md shadow-black/20"
                >
                  {slide.cta1.label}
                </Link>
                <Link
                  to={slide.cta2.href}
                  className="h-10 px-5 inline-flex items-center justify-center rounded-xl border border-white/30 text-white text-sm font-medium hover:bg-white/12 active:scale-[0.97] transition-all backdrop-blur-sm"
                >
                  {slide.cta2.label}
                </Link>
              </div>
            </div>
          </div>

          {/* ── Image half ── */}
          <div className="hidden md:block relative h-full min-h-0 overflow-hidden">
            <img
              src={slide.image}
              alt={slide.title}
              className={cn("w-full h-full object-cover", imageMotion)}
              loading="eager"
              fetchPriority="high"
            />
            {/* Edge fade to blend with gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
          </div>

        </div>

        {/* ── Progress bar (top) ── */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-white/10 z-20">
          <div
            className="h-full bg-white/60 transition-none"
            style={{ width: `${paused ? progress : progress}%` }}
          />
        </div>

        {/* ── Nav arrows ── */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-white/20 bg-black/20 text-white hover:bg-black/40 transition-colors backdrop-blur-sm flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={next => goTo((index + 1) % slides.length, "next")}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full border border-white/20 bg-black/20 text-white hover:bg-black/40 transition-colors backdrop-blur-sm flex items-center justify-center"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* ── Slide counter + dots (bottom) ── */}
        <div className="absolute bottom-3 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {/* Compact counter */}
          <span className="text-[10px] font-semibold text-white/50 tabular-nums mr-1">
            {String(index + 1).padStart(2, "0")}/{String(slides.length).padStart(2, "0")}
          </span>

          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => goTo(i, i > index ? "next" : "prev")}
              className={cn(
                "rounded-full transition-all duration-300",
                i === index
                  ? "w-5 h-1.5 bg-white"
                  : "w-1.5 h-1.5 bg-white/35 hover:bg-white/60"
              )}
            />
          ))}
        </div>

        {/* ── Pause indicator ── */}
        {paused && (
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1 text-[10px] font-semibold text-white/50 backdrop-blur-sm bg-black/20 px-2 py-0.5 rounded-full pointer-events-none">
            <span className="w-1 h-2.5 bg-white/50 rounded-sm inline-block" />
            <span className="w-1 h-2.5 bg-white/50 rounded-sm inline-block" />
          </div>
        )}

      </div>
    </div>
  );
};

export default HeroCarousel;