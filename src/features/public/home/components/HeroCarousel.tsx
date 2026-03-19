import { useEffect, useState } from "react";
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
  cta1: {
    label: string;
    href: string;
  };
  cta2: {
    label: string;
    href: string;
  };
};
type HeroCarouselProps = {
  slides: HeroSlide[];
  className?: string;
};

const HeroCarousel = ({ slides, className }: HeroCarouselProps) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const t = setInterval(() => {
        setIndex((i) => (i + 1) % slides.length);
        }, 5000);

        return () => clearInterval(t);
    }, [slides.length]);

    const active = slides[index];
    return (
        <div className={cn(className)}>
          <div className={`relative overflow-hidden rounded-2xl shadow-sm border border-border bg-gradient-to-r ${active.gradient}`}>
            <div className="grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[240px] md:min-h-[360px]">
              <div className="p-6 sm:p-8 md:p-10 relative z-10">
                <Badge variant="sale" className="mb-4">
                  {active.badge}
                </Badge>

                <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
                  {active.title}
                </h2>

                <p className="text-white/85 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
                  {active.subtitle}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to={active.cta1.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 px-5 text-sm bg-white text-primary hover:bg-white/95"
                  >
                    {active.cta1.label}
                  </Link>

                  <Link
                    to={active.cta2.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl font-medium transition h-11 px-5 text-sm border border-white/30 text-white hover:bg-white/10"
                  >
                    {active.cta2.label}
                  </Link>
                </div>
              </div>

              <div className="relative hidden md:block">
                <div className="absolute inset-0 opacity-25">
                  <img src={active.image} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/0 to-black/10" />
              </div>
            </div>

            {/* Arrows */}
            <button
              type="button"
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/10 hover:bg-black/20 text-white transition"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
            >
              <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              type="button"
              aria-label="Next slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/10 hover:bg-black/20 text-white transition"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
            >
              <svg className="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={[
                    "h-2 rounded-full transition-all",
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>
    );
};

export default HeroCarousel;
