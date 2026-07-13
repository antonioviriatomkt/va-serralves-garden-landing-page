"use client";

import { useRef } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useTrack } from "@/lib/hooks/useTrack";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";

// Balanced editorial mosaic — fills a 4×3 grid exactly (12 cells) with fixed
// row heights so tiles of different spans align. Index maps to the 6 images.
const GALLERY_SPANS = [
  "lg:col-span-2 lg:row-span-2", // 1 · featured
  "lg:col-span-2", //               2 · wide
  "", //                            3
  "", //                            4
  "lg:col-span-2", //               5 · wide
  "lg:col-span-2", //               6 · wide
];

function Gallery({ content }: ModuleProps) {
  const t = useTrack();
  const engaged = useRef(false);
  const g = content.gallery;

  function engage(detail: Record<string, unknown>) {
    if (!engaged.current) {
      engaged.current = true;
      t("gallery_engaged", detail);
    }
  }

  return (
    <Section id="gallery" tone="cream">
      <SectionHeading kicker={content.tagline} title={g.title} intro={g.intro} />

      <Stagger className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:auto-rows-[220px]">
        {g.images.map((img, i) => (
          <StaggerItem
            key={img.slot}
            className={`${GALLERY_SPANS[i] ?? ""} aspect-[4/3] lg:aspect-auto`}
          >
            <button
              type="button"
              onClick={() => engage({ slot: img.slot, index: i })}
              className="group relative block h-full w-full overflow-hidden text-left"
            >
              <Media
                slot={img.slot}
                alt={img.caption}
                rounded="rounded-none"
                hoverZoom
                className="h-full w-full"
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-plum-900/75 to-transparent p-3 text-xs text-cream opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                {img.caption}
              </span>
            </button>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Virtual-tour placeholder */}
      <div className="mt-4 flex flex-col items-center justify-between gap-4 rounded-xl border border-travertine-300 bg-white px-6 py-6 sm:flex-row">
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-plum-800 text-cream">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M8 5.5v13l11-6.5-11-6.5z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div>
            <p className="font-serif text-lg text-plum-800">{g.virtualTour.label}</p>
            <p className="text-sm text-ink/60">{g.virtualTour.note}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => engage({ context: "virtual_tour" })}
          className="rounded-full border border-plum-700 px-6 py-2.5 text-sm font-medium text-plum-800 transition hover:bg-plum-700 hover:text-cream"
        >
          {g.virtualTour.cta}
        </button>
      </div>
    </Section>
  );
}

registerModule("gallery", Gallery);
export default Gallery;
