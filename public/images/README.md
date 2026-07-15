# Image slots — Serralves Garden

The landing page renders **elegant travertine placeholder blocks** wherever an
image file is missing, so the layout never breaks. To light up real imagery,
drop files with the exact names below into this folder (`/public/images/`).
They are picked up automatically — no code changes needed.

Pull the source assets from the official portfolio page:
**https://va-properties.com/en/portfolio/serralves-garden**
(renders, façade, interiors, garden, location) and the Dec-2025 brochure.

**Status (2026-07-15): every slot below is filled with a real render.** No
placeholders remain in the current build. Replace any file in place to swap in a
higher-resolution or approved-final asset.

## Required slots

| File | Used by | Suggested shot |
|------|---------|----------------|
| `hero-side.jpg` | Hero (image panel of the editorial split) | Exterior render, travertine façade, golden hour. **Portrait** (4:5), ≥ 1600px wide — the panel is tall. |
| `hero.jpg` | Open Graph / social share image **only** | Landscape crop (1200×630) of the façade render. Not shown on-page. |
| `gallery-2.jpg` | Gallery — plate 1 | Living room in natural light. |
| `gallery-4.jpg` | Gallery — plate 2 | Private garden. |
| `gallery-6.jpg` | Location — pair (left) | Boavista / neighbourhood context, late afternoon. |
| `street.jpg` | Location — pair (right) | The development seen from the street, beside Serralves. |
| `gallery-3.jpg` | Finishes — pair (left) | Gaggenau kitchen. |
| `gallery-5.jpg` | Finishes — pair (right) | Principal suite. |
| `apartment-t2.jpg` | Availability — grid view (T2 cards) | Representative T2 interior. Landscape (4:3). |
| `apartment-t3.jpg` | Availability — grid view (T3 cards) | Representative T3 interior. Landscape (4:3). |
| `apartment-t4.jpg` | Availability — grid view (T4 cards) | Representative T4 interior. Landscape (4:3). |

> Grid cards use a per-typology image by default. To give a single unit its own
> photo, set `imageSlot` on that unit in the content JSON (e.g. `"imageSlot": "unit-a.jpg"`).

## No longer used

- `location.jpg` — the Location section now embeds a styled **Google Map**, not a
  static image, so this slot is retired. (`content…location.imageSlot` is vestigial.)
- `gallery-1.jpg` — the gallery was restructured into captioned editorial plates
  (slots `gallery-2…6` + `street`); this file is no longer referenced.

## Notes

- Recommended format: optimized JPG or WebP, sRGB. This is an unindexed ad
  landing page, so hero fidelity is prioritized over byte size; keep the smaller
  gallery/apartment slots ≤ ~500 KB for good mobile Lighthouse scores.
- Keep the warm, muted, natural-light grade described in
  `okf/brand/visual-identity.md`.
