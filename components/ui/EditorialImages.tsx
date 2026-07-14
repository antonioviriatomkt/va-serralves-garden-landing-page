"use client";

import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import type { GalleryImage } from "@/types/content";

/**
 * Editorial render "plates" — large images with an uppercase caption beneath,
 * revealed on scroll. `stack` = one per row (full width); `pair` = two per row
 * on wider screens. Used to scatter the renders through the page.
 */
export function EditorialImages({
  images,
  layout = "stack",
  className = "",
}: {
  images: GalleryImage[];
  layout?: "stack" | "pair";
  className?: string;
}) {
  const wrap =
    layout === "pair"
      ? "grid gap-x-6 gap-y-10 sm:grid-cols-2 sm:gap-x-8"
      : "space-y-10 sm:space-y-14";

  return (
    <div className={`${wrap} ${className}`}>
      {images.map((img, i) => (
        <Reveal key={img.slot} delay={i * 0.05}>
          <figure>
            <Media
              slot={img.slot}
              alt={img.caption}
              rounded="rounded-none"
              className="aspect-[3/2] w-full"
            />
            <figcaption className="mt-3 text-xs uppercase tracking-widest2 text-ink/55">
              {img.caption}
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
