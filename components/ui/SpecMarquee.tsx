"use client";

/**
 * Continuous horizontal spec band — the finishes headlines drift past in a
 * seamless loop, brass diamonds between them. A kinetic counterpoint to the
 * static grid below. Pauses on hover; falls back to a static, wrapped row
 * under `prefers-reduced-motion`. Pure CSS animation (translateX 0 → -50% on a
 * doubled track) so it never re-renders React.
 */
export function SpecMarquee({
  items,
  className = "",
}: {
  items: { title: string }[];
  className?: string;
}) {
  if (items.length === 0) return null;

  // Pace scales with content so the band always feels unhurried.
  const duration = Math.max(28, items.length * 4);

  const Track = ({ ariaHidden = false }: { ariaHidden?: boolean }) => (
    <ul
      className="spec-marquee__track flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
    >
      {items.map((item, i) => (
        <li key={`${item.title}-${i}`} className="flex items-center">
          <span className="whitespace-nowrap px-7 font-serif text-xl text-plum-800 sm:px-9 sm:text-2xl">
            {item.title}
          </span>
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-brass"
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className={`spec-marquee group relative overflow-hidden border-y border-travertine-300 py-5 ${className}`}
    >
      <div
        className="spec-marquee__rail flex w-max"
        style={{ ["--spec-marquee-duration" as string]: `${duration}s` }}
      >
        <Track />
        <Track ariaHidden />
      </div>

      {/* Soft edge fades so items enter and leave, never abruptly clipped. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-travertine-100 to-travertine-100/0 sm:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-travertine-100 to-travertine-100/0 sm:w-24" />

      <style jsx>{`
        .spec-marquee__rail {
          animation: spec-marquee-scroll var(--spec-marquee-duration, 36s)
            linear infinite;
          will-change: transform;
        }
        .spec-marquee:hover .spec-marquee__rail {
          animation-play-state: paused;
        }
        @keyframes spec-marquee-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .spec-marquee__rail {
            animation: none;
            flex-wrap: wrap;
            width: 100%;
            justify-content: center;
          }
          .spec-marquee__track:last-child {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
