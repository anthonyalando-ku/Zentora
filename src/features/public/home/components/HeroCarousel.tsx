import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/shared/components/ui";
import { cn } from "@/shared/utils/cn";

type HeroSlide = {
  id: string;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  gradient: string;
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
};

type Props = {
  slides: HeroSlide[];
  className?: string;
};

const HeroCarousel = ({ slides, className }: Props) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [paused, next]);

  const active = slides[index];

  return (
    <div
      className={cn("h-full min-h-0", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={cn(
          "relative h-full min-h-0 rounded-2xl overflow-hidden border border-border bg-gradient-to-r",
          active.gradient
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-0">
          {/* Content */}
          <div className="p-6 md:p-10 flex flex-col justify-center min-h-0 relative z-10">
            <Badge variant="sale" className="mb-3 w-fit text-[11px] px-2.5 py-0.5">
              {active.badge}
            </Badge>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight tracking-tight">
              {active.title}
            </h2>
            <p className="text-white/75 text-sm md:text-base mb-6 max-w-xs leading-relaxed">
              {active.subtitle}
            </p>
            <div className="flex gap-3">
              <Link
                to={active.cta1.href}
                className="h-10 px-5 inline-flex items-center justify-center rounded-xl bg-white text-primary text-sm font-semibold hover:bg-white/95 active:scale-[0.98] transition-all shadow-sm"
              >
                {active.cta1.label}
              </Link>
              <Link
                to={active.cta2.href}
                className="h-10 px-5 inline-flex items-center justify-center rounded-xl border border-white/40 text-white text-sm font-medium hover:bg-white/15 active:scale-[0.98] transition-all backdrop-blur-sm"
              >
                {active.cta2.label}
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="hidden md:block relative h-full min-h-0">
            <img
              src={active.image}
              alt={active.title}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10" />
          </div>
        </div>

        {/* Nav arrows */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/25 bg-black/25 text-white hover:bg-black/40 transition-colors backdrop-blur-sm flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full border border-white/25 bg-black/25 text-white hover:bg-black/40 transition-colors backdrop-blur-sm flex items-center justify-center"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Progress dots */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;