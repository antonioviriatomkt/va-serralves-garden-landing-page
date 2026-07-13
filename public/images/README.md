# Image slots — Serralves Garden

The landing page renders **elegant travertine placeholder blocks** wherever an
image file is missing, so the layout never breaks in the demo. To light up real
imagery, drop files with the exact names below into this folder
(`/public/images/`). They are picked up automatically — no code changes needed.

Pull the source assets from the official portfolio page:
**https://va-properties.com/en/portfolio/serralves-garden**
(renders, façade, interiors, garden, location) and the Dec-2025 brochure.

## Required slots

| File | Used by | Suggested shot |
|------|---------|----------------|
| `hero.jpg` | Hero (full-bleed) + OG image | Exterior render, travertine façade, golden hour. Landscape, ≥ 2000px wide. |
| `gallery-1.jpg` | Gallery (large tile) | Façade / building hero. |
| `gallery-2.jpg` | Gallery | Living room in natural light. |
| `gallery-3.jpg` | Gallery | Gaggenau kitchen. |
| `gallery-4.jpg` | Gallery | Private garden. |
| `gallery-5.jpg` | Gallery | Principal suite / bathroom. |
| `gallery-6.jpg` | Gallery | Boavista / neighbourhood context. |
| `location.jpg` | Location & lifestyle | Serralves gardens or Boavista streetscape. Portrait (4:5) works best. |
| `apartment-t2.jpg` | Availability — grid view (T2 cards) | Representative T2 interior. Landscape (4:3). |
| `apartment-t3.jpg` | Availability — grid view (T3 cards) | Representative T3 interior. Landscape (4:3). |
| `apartment-t4.jpg` | Availability — grid view (T4 cards) | Representative T4 interior. Landscape (4:3). |

> Grid cards use a per-typology image by default. To give a single unit its own
> photo, set `imageSlot` on that unit in the content JSON (e.g. `"imageSlot": "unit-a.jpg"`).

## Notes

- Recommended format: optimized JPG or WebP, sRGB, ≤ 400 KB each for good
  mobile Lighthouse scores.
- `hero.jpg` doubles as the Open Graph / social share image (1200×630 crop).
- Keep the warm, muted, natural-light grade described in
  `okf/brand/visual-identity.md`.
