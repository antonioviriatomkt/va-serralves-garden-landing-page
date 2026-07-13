import type { CSSProperties } from "react";

/**
 * Progressive (gradient / "variable") blur — a blur whose radius ramps across a
 * gradient instead of being uniform, so content dissolves softly into the edge.
 *
 * CSS can't vary blur radius along an axis natively, so we stack N layers, each
 * with a doubling `backdrop-filter: blur()` and a gradient `mask` that reveals
 * it over a progressively lower slice. The masks feather the discrete blur
 * levels into a smooth ramp.
 *
 * Pure presentational (no hooks) — safe in server or client trees. For the
 * scroll-reveal viewport effect, see components/EdgeBlur.tsx.
 */
export function ProgressiveBlur({
  position = "bottom",
  height = 150,
  layers = 6,
  baseBlur = 0.5,
  fixed = true,
  className = "",
}: {
  position?: "top" | "bottom";
  /** Height of the blur band — px (number) or any CSS length (e.g. "55%"). */
  height?: number | string;
  /** Number of stacked blur layers (more = smoother, slightly heavier). */
  layers?: number;
  /** Blur radius of the first (subtlest) layer, in px; each layer doubles it. */
  baseBlur?: number;
  /** `fixed` to the viewport (BELFOZ effect) or `absolute` within a parent. */
  fixed?: boolean;
  className?: string;
}) {
  const dir = position === "bottom" ? "to bottom" : "to top";
  const step = 100 / (layers + 1);

  const posClass = `${fixed ? "fixed" : "absolute"} inset-x-0 ${
    position === "bottom" ? "bottom-0" : "top-0"
  }`;

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${posClass} ${className}`}
      style={{ height }}
    >
      {Array.from({ length: layers }).map((_, i) => {
        const blur = baseBlur * 2 ** i;
        const stops = [i, i + 1, i + 2, i + 3].map((n) => n * step);
        const mask =
          `linear-gradient(${dir}, rgba(0,0,0,0) ${stops[0]}%, ` +
          `rgba(0,0,0,1) ${stops[1]}%, rgba(0,0,0,1) ${stops[2]}%, ` +
          `rgba(0,0,0,0) ${stops[3]}%)`;
        const style: CSSProperties = {
          position: "absolute",
          inset: 0,
          zIndex: i + 1,
          backdropFilter: `blur(${blur}px)`,
          WebkitBackdropFilter: `blur(${blur}px)`,
          maskImage: mask,
          WebkitMaskImage: mask,
        };
        return <div key={i} style={style} />;
      })}
    </div>
  );
}
