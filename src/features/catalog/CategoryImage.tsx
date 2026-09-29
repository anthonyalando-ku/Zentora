import { useState, type ReactNode } from "react";
import { categoryImageUrl } from "./categoryImageUrl";

export function CategoryImage({ src, alt, fallback, className = "w-9 h-9" }: {
  src?: string | null; alt: string; fallback: ReactNode; className?: string;
}) {
  const url = categoryImageUrl(src);
  // Keying the loader by URL resets failed/loaded state when an image is replaced.
  return url ? <ImageLoader key={url} src={url} alt={alt} fallback={fallback} className={className} /> : <>{fallback}</>;
}

function ImageLoader({ src, alt, fallback, className }: { src: string; alt: string; fallback: ReactNode; className: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "failed">("loading");
  if (status === "failed") return <>{fallback}</>;
  return <div className={`relative inline-flex flex-shrink-0 ${className}`}>
    {status !== "loaded" && fallback}
    <img src={src} alt={alt} loading="lazy" decoding="async"
      className={`absolute inset-0 w-full h-full object-cover rounded-lg ${status === "loaded" ? "" : "opacity-0"}`}
      onLoad={() => setStatus("loaded")} onError={() => setStatus("failed")} />
  </div>;
}
