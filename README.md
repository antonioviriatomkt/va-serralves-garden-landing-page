# Serralves Garden — Boavista Living (Demo LP)

Demo landing page for **Serralves Garden**, a luxury off-plan condominium by
VA Properties in Boavista, Porto. It is the first instance of Viriato's reusable
real-estate lead-gen template — one codebase, configured by **preset** and
**intent mode**.

> **This is a demo for an internal presentation.** No real backend, no
> credentials, no analytics pixels. Integrations (CRM, WhatsApp, analytics) are
> mocked. It deploys to the Vercel free tier with **zero environment variables**.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  → redirects to /pt
```

```bash
npm run build      # production build (no TS errors, static PT + EN)
npm run start      # serve the production build
```

Requires Node 18.17+ (developed on Node 24).

## Deploy to Vercel

1. Push this repo to GitHub (or run `vercel` from the CLI).
2. Import into Vercel — framework **Next.js** is auto-detected.
3. No environment variables are needed. Deploy.

Fonts are self-hosted at build time via `next/font` (no runtime font requests),
so the deployed page is fully self-contained.

---

## How it works

### Preset × intent mode

Two cross-cutting dimensions drive the whole page:

| Dimension | This build | Notes |
|---|---|---|
| **Preset** | `luxury` | Set in [`config/site.ts`](config/site.ts). The system also supports `mainstream`; only the composition differs. |
| **Intent mode** | `res` \| `inv` | Resolved **per visitor** (see below). Re-orders modules and shifts copy emphasis, client-side, with no reload. |

**Intent mode resolution priority** (in [`lib/mode/ModeProvider.tsx`](lib/mode/ModeProvider.tsx)):

1. `?m=inv` / `?m=res` URL param (ad-level tagging) →
2. `localStorage` persisted choice →
3. hero chooser selection ("Para viver | Para investir") →
4. default `res` composition with the chooser visible.

Try it: `/pt?m=inv` vs `/pt?m=res`, or use the header toggle / hero chooser.

### Module registry & composition

The page is **not** a hardcoded layout. Each section is a self-registering
module ([`components/modules/*`](components/modules)), and the render order comes
from a config:

- **Composition config:** [`content/composition.json`](content/composition.json)
  — module keys + order per `preset × mode`.
- **Rendering:** [`components/PageComposition.tsx`](components/PageComposition.tsx)
  maps over `composition[mode]` → registry components.

**Reorder the page by editing JSON** — change the array order in
`composition.json` and the sections visibly reorder (no code change). In
`luxury.inv`, the Investment module is simply lifted to position 4.

### Content layer (Sanity-shaped)

No CMS dependency. Content is typed to mirror a future Sanity "Development"
schema and loaded through an adapter, so Sanity can replace the JSON later
without touching a single component:

- **Types:** [`types/content.ts`](types/content.ts) — `DevelopmentContent`,
  `UIStrings`, `Composition`, `Unit`, etc.
- **Adapter contract:** [`lib/content/ContentSource.ts`](lib/content/ContentSource.ts)
- **Local JSON adapter:** [`lib/content/jsonAdapter.ts`](lib/content/jsonAdapter.ts)
- **Content:** [`content/serralves-garden.pt.json`](content/serralves-garden.pt.json)
  · [`content/serralves-garden.en.json`](content/serralves-garden.en.json)

All copy — including UI microcopy and form labels — lives in the locale JSON.
There are **no hardcoded strings in components**. Copy is written PT-PT first,
then EN, in the VA Properties brand voice (understated, sensory, architectural).

### i18n

- Routes: `/{locale}` with **`pt` as default** and `en`.
  [`middleware.ts`](middleware.ts) adds the locale prefix (`/` → `/pt`).
- The language switch preserves the current `?m=` param.

### Qualification form (Q0)

Multi-step modal ([`lib/q0/`](lib/q0)) — Luxury variant:

`typology → purpose (pre-filled from mode) → [strategy, inv only] → timeline →
off-plan check → country + language → contact`

- **Never asks budget or financing** (Luxury rule).
- On submit it computes a **fit score** client-side, stores the lead in
  `localStorage` under `va_demo_crm_leads` (the "demo CRM"), and shows a
  brand-voice confirmation with a WhatsApp continue button.
- **Scoring weights** live in [`config/scoring.ts`](config/scoring.ts):
  timeline ≤6mo `+25`, off-plan accepted `+20`, typology matches available `+15`,
  full completion `+10`, purpose known `+10` (raw /80, normalized to 0–100).

Opening the Q0 from an availability row pre-fills that unit's typology.

### Events / instrumentation

`track(event, props)` ([`lib/track.ts`](lib/track.ts)) →
`console.debug("[track]", …)` **and** `window.dataLayer.push(…)`. Every event
carries `{ mode, locale, preset }` (injected by `useTrack()`).

Instrumented events:

```
page_view · mode_resolved · mode_switched · hero_cta_clicked · gallery_engaged
unit_viewed · price_requested · dossier_requested · investment_section_expanded
faq_opened · whatsapp_clicked · q0_started · q0_step_completed · q0_submitted
q0_abandoned
```

**Verify:** open DevTools console (filter `[track]`) or run `window.dataLayer`.

---

## Images

The page renders **elegant travertine placeholder blocks** wherever an image is
missing, so the layout never breaks. Drop real files into
[`public/images/`](public/images) using the exact slot names — they are picked
up automatically. See [`public/images/README.md`](public/images/README.md) for
the full slot list and source (pull from
`https://va-properties.com/en/portfolio/serralves-garden`).

| Slot | Where |
|---|---|
| `hero.jpg` | Hero (full-bleed) + OG image |
| `gallery-1.jpg` … `gallery-6.jpg` | Gallery |
| `location.jpg` | Location & lifestyle |

---

## Where things live

| I want to change… | Edit |
|---|---|
| Page section order (per preset × mode) | `content/composition.json` |
| Copy / content (PT / EN) | `content/serralves-garden.{pt,en}.json` |
| Fit-score weights | `config/scoring.ts` |
| Active preset, WhatsApp number, locales | `config/site.ts` |
| Content schema (future Sanity shape) | `types/content.ts` |
| A section's markup | `components/modules/<Module>.tsx` |
| Theme tokens (palette, fonts) | `tailwind.config.ts` |

## Project structure

```
app/[locale]/         # localized layout (fonts, providers, meta) + page
components/modules/    # self-registering section modules (Hero, Availability, …)
components/ui/         # Media placeholder, Section primitives
lib/mode/              # intent-mode context + resolution
lib/q0/                # multi-step qualification form
lib/content/           # ContentSource adapter (JSON now, Sanity later)
lib/modules/           # module registry
content/               # locale JSON + composition config
config/                # site + scoring config
types/                 # Sanity-shaped content types
```

## Notes & scope

- **SEO:** `noindex, nofollow` (it is a demo) — but real OG/Twitter tags so it
  looks intentional when shared.
- **Out of scope (later phases):** WhatsApp automation, CRM integration, real
  analytics/pixels, Sanity Studio, payment calculator / financing (the last two
  are excluded by the Luxury preset).
