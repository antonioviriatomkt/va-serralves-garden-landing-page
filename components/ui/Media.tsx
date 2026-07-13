"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Image slot with a graceful travertine placeholder.
 *
 * The real asset (in /public/images/<slot>) is attempted; if it is absent — as
 * in this demo — the elegant placeholder block remains and the layout never
 * breaks. Drop matching files into /public/images to light them up.
 */
export function Media({
  slot,
  alt,
  className = "",
  rounded = "rounded-xl",
  priority = false,
  showLabel = true,
  hoverZoom = false,
}: {
  slot: string;
  alt: string;
  className?: string;
  rounded?: string;
  priority?: boolean;
  showLabel?: boolean;
  /** Slow zoom on parent `group` hover (frame must be `overflow-hidden`). */
  hoverZoom?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const src = `/images/${slot}`;
  const zoom = hoverZoom
    ? "transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
    : "";

  // Handle the cached/fast-load case where `onLoad` fires before React attaches
  // it: if the image is already complete on mount, mark it loaded. naturalWidth
  // stays 0 for a missing (404) file, so the placeholder is preserved.
  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setLoaded(true);
  }, []);

  return (
    <div
      className={`relative overflow-hidden bg-travertine-200 ${rounded} ${className}`}
    >
      {/* Placeholder texture */}
      <div
        aria-hidden
        className={`absolute inset-0 bg-gradient-to-br from-travertine-100 via-travertine-200 to-travertine-300 ${zoom}`}
      />
      {showLabel && (
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center"
        >
          <span className="select-none text-[0.65rem] uppercase tracking-widest2 text-travertine-600/50">
            {slot.replace(/\.(jpg|jpeg|png|webp|avif)$/i, "")}
          </span>
        </div>
      )}

      {/* Real asset (fades in only if it actually loads) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 h-full w-full object-cover transition duration-700 ${zoom} ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
