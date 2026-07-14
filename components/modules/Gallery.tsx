"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useTrack } from "@/lib/hooks/useTrack";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";
import { DURATION, EASE_LUX } from "@/lib/motion";

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
  const [index, setIndex] = useState<number | null>(null);

  function open(i: number) {
    setIndex(i);
    if (!engaged.current) {
      engaged.current = true;
      t("gallery_engaged", { slot: g.images[i].slot, index: i });
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
              onClick={() => open(i)}
              aria-label={img.caption}
              className="group relative block h-full w-full cursor-pointer overflow-hidden text-left"
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

      <Lightbox
        images={g.images}
        index={index}
        onClose={() => setIndex(null)}
        onIndex={setIndex}
      />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Lightbox                                                           */
/* ------------------------------------------------------------------ */

function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: { slot: string; caption: string }[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const [dir, setDir] = useState(0);
  const n = images.length;
  const isOpen = index !== null;

  const navigate = useCallback(
    (d: number) => {
      if (index === null) return;
      setDir(d);
      onIndex((index + d + n) % n);
    },
    [index, n, onIndex],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") navigate(1);
      else if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, navigate, onClose]);

  return (
    <AnimatePresence>
      {isOpen && index !== null && (
        <motion.div
          data-lenis-prevent
          className="fixed inset-0 z-50 flex flex-col bg-plum-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.micro, ease: EASE_LUX }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={images[index].caption}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-4 sm:px-8">
            <span className="text-xs uppercase tracking-widest2 text-cream/70">
              {index + 1} / {n}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center text-cream/80 transition hover:text-cream"
            >
              <span aria-hidden className="text-2xl leading-none">
                &times;
              </span>
            </button>
          </div>

          {/* Image stage — swipe / drag or arrow keys to navigate */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4 sm:px-8">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.img
                key={index}
                src={`/images/${images[index].slot}`}
                alt={images[index].caption}
                drag={reduce ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.16}
                onDragEnd={(_e, info) => {
                  if (info.offset.x < -70) navigate(1);
                  else if (info.offset.x > 70) navigate(-1);
                }}
                onClick={(e) => e.stopPropagation()}
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: dir * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: dir * -60 }}
                transition={{ duration: DURATION.base, ease: EASE_LUX }}
                className="max-h-full max-w-full cursor-grab touch-none object-contain shadow-2xl active:cursor-grabbing"
              />
            </AnimatePresence>
          </div>

          {/* Caption */}
          <div className="px-6 pb-7 pt-1 text-center">
            <p className="font-serif text-base text-cream sm:text-lg">
              {images[index].caption}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

registerModule("gallery", Gallery);
export default Gallery;
