import { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/shared/utils/cn";

// ── Types ─────────────────────────────────────────────────────────────────────
export type HeroSlide = {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  /** Hero product image — works best as a transparent/light-bg cutout. */
  image: string;
  alt?: string;
  /** Background pastel tone. Defaults to "mint" if no `background` provided. */
  tone?: keyof typeof TONES;
  /** Custom background (CSS color or gradient). Overrides `tone`. */
  background?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
};

type Props = {
  slides: HeroSlide[];
  className?: string;
  /** Auto-advance interval in ms. Default 6000. */
  interval?: number;
};

// ── Pastel tone presets ───────────────────────────────────────────────────────
const TONES = {
  mint:   { bg: "#dff1d6", ink: "#1d2718", accent: "#1d2718" },
  sand:   { bg: "#f1e7d0", ink: "#2a2418", accent: "#2a2418" },
  peach:  { bg: "#fadcc8", ink: "#2a1a12", accent: "#2a1a12" },
  sky:    { bg: "#d8e7f5", ink: "#13202d", accent: "#13202d" },
  lilac:  { bg: "#e6dbf2", ink: "#1f1830", accent: "#1f1830" },
  rose:   { bg: "#f5d8df", ink: "#2a1320", accent: "#2a1320" },
} as const;

// ── Daily-seed start index ────────────────────────────────────────────────────
function getDailyStartIndex(total: number): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - start.getTime()) / 86_400_000);
  return dayOfYear % total;
}

type Dir = "next" | "prev" | "idle";

// ─────────────────────────────────────────────────────────────────────────────
const HeroCarousel = ({ slides, className, interval = 6000 }: Props) => {
  const [index, setIndex] = useState(() => getDailyStartIndex(slides.length));
  const [dir, setDir] = useState<Dir>("idle");
  const [animating, setAnimating] = useState(false);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const TICK = 60;

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

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current);
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
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [paused, advance, interval]);

  const slide = slides[index];
  const tone = (slide.tone && TONES[slide.tone]) || TONES.mint;
  const background = slide.background ?? tone.bg;

  // Enter motion
  const contentMotion = cn(
    "transition-all duration-[420ms] ease-out",
    animating && dir === "next" && "translate-x-4 opacity-0",
    animating && dir === "prev" && "-translate-x-4 opacity-0",
    !animating && "translate-x-0 opacity-100"
  );
  const imageMotion = cn(
    "transition-all duration-[420ms] ease-out",
    animating && dir === "next" && "translate-x-3 opacity-0 scale-[1.02]",
    animating && dir === "prev" && "-translate-x-3 opacity-0 scale-[1.02]",
    !animating && "translate-x-0 opacity-100 scale-100"
  );

  return (
    <section
      className={cn("w-full", className)}
      aria-label="Featured promotions"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl",
          // Responsive heights: tall enough on mobile to be impactful but
          // not so tall that it dominates the fold. Bigger on desktop.
          "aspect-[16/11] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[24/9]",
          "min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[420px]"
        )}
        style={{ backgroundColor: background, color: tone.ink }}
      >
        {/* Decorative soft shape */}
        <div
          className="absolute -right-20 -top-20 w-72 h-72 rounded-full opacity-30 pointer-events-none"
          style={{ backgroundColor: "rgba(255,255,255,0.55)" }}
          aria-hidden="true"
        />

        <div className="relative z-10 h-full grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-2 md:gap-4">
          {/* ── Content ── */}
          <div className="h-full flex flex-col justify-center px-5 sm:px-8 md:px-12 lg:px-16 py-6">
            <div className={contentMotion}>
              {slide.badge && (
                <span
                  className="inline-block mb-3 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] px-2.5 py-1 rounded-full border"
                  style={{ borderColor: "rgba(0,0,0,0.18)", color: tone.ink }}
                >
                  {slide.badge}
                </span>
              )}

              <h2
                className="font-extrabold leading-[1.02] tracking-tight mb-3"
                style={{
                  color: tone.ink,
                  fontSize: "clamp(1.75rem, 5.5vw, 3.5rem)",
                }}
              >
                {slide.title}
              </h2>

              {slide.subtitle && (
                <p
                  className="text-sm sm:text-base md:text-lg mb-5 max-w-[36ch] leading-snug"
                  style={{ color: tone.ink, opacity: 0.78 }}
                >
                  {slide.subtitle}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  to={slide.primary.href}
                  className="inline-flex items-center gap-2 h-11 sm:h-12 pl-2 pr-5 rounded-full bg-foreground text-background text-sm sm:text-[15px] font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-md"
                >
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-background/15 grid place-items-center">
                    <svg className="w-4 h-4 sm:w-[18px] sm:h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14l-1.2 9.2A2 2 0 0 1 15.8 19H8.2a2 2 0 0 1-2-1.8L5 8Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 0 1 6 0v2" />
                    </svg>
                  </span>
                  <span className="uppercase tracking-wider text-[12px] sm:text-[13px]">
                    {slide.primary.label}
                  </span>
                </Link>

                {slide.secondary && (
                  <Link
                    to={slide.secondary.href}
                    className="inline-flex items-center h-11 sm:h-12 px-4 sm:px-5 rounded-full border text-sm font-semibold hover:bg-foreground/5 transition-colors"
                    style={{ borderColor: "rgba(0,0,0,0.25)", color: tone.ink }}
                  >
                    {slide.secondary.label}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* ── Image ── */}
          <div className="relative h-full overflow-hidden">
            <img
              src={slide.image}
              alt={slide.alt ?? slide.title}
              className={cn(
                "absolute inset-0 w-full h-full object-cover object-center md:object-right-bottom",
                "opacity-90 md:opacity-100",
                imageMotion
              )}
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>

        {/* ── Progress bar (top, subtle) ── */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-black/5 z-20">
          <div
            className="h-full bg-black/30 transition-none"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Nav arrows ── */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={prev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/15 hover:bg-black/30 text-white transition-colors backdrop-blur-sm grid place-items-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => goTo((index + 1) % slides.length, "next")}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/15 hover:bg-black/30 text-white transition-colors backdrop-blur-sm grid place-items-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* ── Dots + counter ── */}
        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 z-20 flex items-center justify-center gap-2">
          <span
            className="text-[10px] sm:text-[11px] font-semibold tabular-nums mr-1"
            style={{ color: tone.ink, opacity: 0.55 }}
          >
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
                i === index ? "w-6 h-1.5" : "w-1.5 h-1.5 hover:opacity-100"
              )}
              style={{
                backgroundColor: i === index ? tone.ink : "rgba(0,0,0,0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
