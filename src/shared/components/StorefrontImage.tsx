import { useState } from "react";
import { Package } from "lucide-react";
export function StorefrontImage({ src, alt, className = "", eager = false }: { src?: string | null; alt: string; className?: string; eager?: boolean }) {
  return <ImageSurface key={src || "missing"} src={src} alt={alt} className={className} eager={eager} />;
}
function ImageSurface({ src, alt, className, eager }: { src?: string | null; alt: string; className: string; eager: boolean }) {
  const [failed, setFailed] = useState(false);
  return <div className={"store-image " + className}>{src && !failed ? <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} fetchPriority={eager ? "high" : undefined} decoding="async" onError={() => setFailed(true)} /> : <div className="store-image-fallback" role="img" aria-label={alt + ": image unavailable"}><Package aria-hidden="true" /><span>Image unavailable</span></div>}</div>;
}
