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
  cta1: { label: string; href: string };
  cta2: { label: string; href: string };
};

type Props = {
  slides: HeroSlide[];
  className?: string;
};

const HeroCarousel = ({ slides, className }: Props) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 5000);

    return () => clearInterval(t);
  }, [slides.length]);

  const active = slides[index];

  return (
    <div className={cn("h-full min-h-0", className)}>
      {/* ✅ Key fix: ensure carousel container clips its contents and respects the hero height. */}
      <div
        className={cn(
          "h-full min-h-0 relative rounded-2xl overflow-hidden border border-border",
          "bg-gradient-to-r",
          active.gradient
        )}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-0">
          {/* LEFT CONTENT */}
          <div className="p-6 md:p-8 flex flex-col justify-center min-h-0">
            <Badge variant="sale" className="mb-3 w-fit">
              {active.badge}
            </Badge>

            <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">{active.title}</h2>

            <p className="text-white/80 text-sm mb-4">{active.subtitle}</p>

            <div className="flex gap-3">
              <Link
                to={active.cta1.href}
                className="px-4 h-10 flex items-center justify-center rounded-lg bg-white text-primary text-sm font-medium hover:bg-white/95 transition"
              >
                {active.cta1.label}
              </Link>

              <Link
                to={active.cta2.href}
                className="px-4 h-10 flex items-center justify-center rounded-lg border border-white/30 text-white text-sm hover:bg-white/10 transition"
              >
                {active.cta2.label}
              </Link>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="hidden md:block relative h-full min-h-0">
            <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>

        {/* Arrows */}
        <button
          type="button"
          aria-label="Previous slide"
          onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/20 text-white hover:bg-black/30 transition"
        >
          <span className="text-xl leading-none">‹</span>
        </button>

        <button
          type="button"
          aria-label="Next slide"
          onClick={() => setIndex((i) => (i + 1) % slides.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-white/30 bg-black/20 text-white hover:bg-black/30 transition"
        >
          <span className="text-xl leading-none">›</span>
        </button>

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn("h-2 rounded-full transition-all", i === index ? "w-6 bg-white" : "w-2 bg-white/50")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;