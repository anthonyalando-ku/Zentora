import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, Pause, Play, ShoppingBag } from "lucide-react";
import { StorefrontImage } from "@/shared/components/StorefrontImage";
export type HeroSlide = { id: string; badge?: string; title: string; subtitle?: string; image?: string | null; alt?: string; tone?: string; primary: { label: string; href: string } };
export default function HeroCarousel({ slides, interval = 6500 }: { slides: HeroSlide[]; interval?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [explicitPlay, setExplicitPlay] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update(); media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || ((hovered || focused) && !explicitPlay) || reducedMotion || slides.length < 2) return;
    const timer = window.setInterval(() => setIndex(i => (i + 1) % slides.length), interval);
    return () => window.clearInterval(timer);
  }, [paused, hovered, focused, explicitPlay, reducedMotion, slides.length, interval, index]);
  if (!slides.length) return null;
  const current = index % slides.length;
  const slide = slides[current];
  const stopped = paused;
  const togglePlayback = () => {
    if (stopped) {
      setPaused(false);
      setHovered(false);
      setFocused(false);
      setExplicitPlay(true);
    } else setPaused(true);
  };
  return <section className={"store-hero store-tone-" + (slide.tone || "sand")} aria-label="Featured collections" aria-roledescription="carousel" onMouseEnter={() => setHovered(true)} onMouseLeave={() => { setHovered(false); setExplicitPlay(false); }} onFocus={() => { setFocused(true); setExplicitPlay(false); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget)) { setFocused(false); setExplicitPlay(false); } }}>
    <div className="store-hero-copy"><span className="store-eyebrow"><ShoppingBag size={14} aria-hidden="true" />{slide.badge}</span><h1>{slide.title}</h1><p>{slide.subtitle}</p><Link className="store-cta" to={slide.primary.href}>{slide.primary.label}<ArrowRight size={17} aria-hidden="true" /></Link></div>
    {slide.image && <StorefrontImage src={slide.image} alt={slide.alt || slide.title} eager={current === 0} className="store-hero-image" />}
    {slides.length > 1 && <div className="store-carousel-controls"><button type="button" aria-label="Previous slide" onClick={() => setIndex((current - 1 + slides.length) % slides.length)}><ArrowLeft size={16} /></button><div className="store-carousel-dots">{slides.map((s, i) => <button type="button" key={s.id} aria-label={"Show " + (s.badge || s.title)} aria-pressed={i === current} onClick={() => setIndex(i)}><span /></button>)}</div><button type="button" aria-label="Next slide" onClick={() => setIndex((current + 1) % slides.length)}><ArrowRight size={16} /></button>{!reducedMotion && <button type="button" aria-label={stopped ? "Play slideshow" : "Pause slideshow"} onClick={togglePlayback}>{stopped ? <Play size={14} /> : <Pause size={14} />}</button>}</div>}
  </section>;
}
