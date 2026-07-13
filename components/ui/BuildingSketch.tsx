import { Reveal } from "@/components/motion/Reveal";

/**
 * Building sketch — the Murano-style pen illustration (Illustrator export),
 * recoloured to the brand plum and served from /public/images. Fades/rises in
 * on scroll via the shared Reveal. (It's a filled illustration, not line
 * strokes, so the stroke "draw-on" effect doesn't apply here.)
 */
export function BuildingSketch({ className = "" }: { className?: string }) {
  return (
    <Reveal className={className}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/building-sketch.svg"
        alt="Sketch of the Serralves Garden building"
        className="w-full"
      />
    </Reveal>
  );
}
