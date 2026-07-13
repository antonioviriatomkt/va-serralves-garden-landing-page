"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Media } from "@/components/ui/Media";
import { Reveal } from "@/components/motion/Reveal";
import { useMode } from "@/lib/mode/ModeProvider";
import { useTrack } from "@/lib/hooks/useTrack";
import { useQ0 } from "@/lib/q0/Q0Provider";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";
import { DURATION, EASE_INOUT, EASE_LUX } from "@/lib/motion";
import type { AvailabilityContent, Unit, UnitStatus } from "@/types/content";

type ViewMode = "list" | "grid";

const STATUS_STYLE: Record<UnitStatus, string> = {
  available: "bg-brass/15 text-brass border border-brass/30",
  reserved: "bg-plum-100 text-plum-600 border border-plum-200",
  sold: "bg-ink/5 text-ink/45 border border-ink/10",
};

function Availability({ content }: ModuleProps) {
  const { locale } = useMode();
  const t = useTrack();
  const { open } = useQ0();
  const a = content.availability;
  const [openUnit, setOpenUnit] = useState<string | null>(null);
  const [view, setView] = useState<ViewMode>("list");

  const nf = new Intl.NumberFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  const m2 = (v: number | null) => (v == null ? "—" : `${nf.format(v)} m²`);

  function toggleUnit(unit: Unit) {
    if (unit.status !== "available") return;
    const next = openUnit === unit.id ? null : unit.id;
    setOpenUnit(next);
    if (next) {
      t("unit_viewed", {
        unit: unit.id,
        typology: unit.typology,
        floor: unit.floor,
        view,
      });
    }
  }

  function requestPrice(unit: Unit) {
    t("price_requested", { unit: unit.id, typology: unit.typology, view });
    open({ source: "availability", typology: unit.typology, unitId: unit.id });
  }

  function reserve(unit: Unit) {
    t("price_requested", {
      unit: unit.id,
      typology: unit.typology,
      view,
      action: "reserve",
    });
    open({
      source: "availability_reserve",
      typology: unit.typology,
      unitId: unit.id,
    });
  }

  function changeView(next: ViewMode) {
    if (next === view) return;
    setView(next);
    setOpenUnit(null);
    t("availability_view_changed", { view: next });
  }

  return (
    <Section id="availability" tone="cream">
      <SectionHeading kicker={content.tagline} title={a.title} intro={a.intro} />

      <div className="mt-8 flex items-center justify-end">
        <ViewToggle view={view} onChange={changeView} a={a} />
      </div>

      <Reveal className="mt-6">
        {view === "list" ? (
          <TableView
            units={content.units}
            a={a}
            m2={m2}
            openUnit={openUnit}
            onToggle={toggleUnit}
            onRequestPrice={requestPrice}
            onReserve={reserve}
          />
        ) : (
          <GridView
            units={content.units}
            a={a}
            m2={m2}
            openUnit={openUnit}
            onToggle={toggleUnit}
            onRequestPrice={requestPrice}
          />
        )}
      </Reveal>

      <p className="mt-4 text-sm text-ink/55">{a.note}</p>

      {/* Mobile-only detail sheet — the inline table row is too wide to read on
          a phone, so tapping a unit slides up a full-screen panel instead. */}
      <MobileUnitDetail
        unit={
          view === "list"
            ? content.units.find((u) => u.id === openUnit) ?? null
            : null
        }
        a={a}
        m2={m2}
        onClose={() => setOpenUnit(null)}
        onReserve={reserve}
      />
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* View toggle                                                        */
/* ------------------------------------------------------------------ */

function ViewToggle({
  view,
  onChange,
  a,
}: {
  view: ViewMode;
  onChange: (v: ViewMode) => void;
  a: AvailabilityContent;
}) {
  const base =
    "flex h-11 w-11 items-center justify-center rounded-full border transition";
  const active = "border-plum-700 bg-plum-700 text-cream";
  const idle = "border-travertine-300 text-plum-700 hover:border-plum-500";
  return (
    <div className="flex items-center gap-2" role="group" aria-label="View">
      <button
        type="button"
        onClick={() => onChange("list")}
        aria-pressed={view === "list"}
        aria-label={a.viewListLabel}
        title={a.viewListLabel}
        className={`${base} ${view === "list" ? active : idle}`}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
          <circle cx="3" cy="5" r="1.4" fill="currentColor" />
          <circle cx="3" cy="10" r="1.4" fill="currentColor" />
          <circle cx="3" cy="15" r="1.4" fill="currentColor" />
          <path
            d="M7 5h10M7 10h10M7 15h10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange("grid")}
        aria-pressed={view === "grid"}
        aria-label={a.viewGridLabel}
        title={a.viewGridLabel}
        className={`${base} ${view === "grid" ? active : idle}`}
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <rect x="2" y="2" width="6.5" height="6.5" rx="1.4" />
          <rect x="11.5" y="2" width="6.5" height="6.5" rx="1.4" />
          <rect x="2" y="11.5" width="6.5" height="6.5" rx="1.4" />
          <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.4" />
        </svg>
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* List (table) view                                                  */
/* ------------------------------------------------------------------ */

interface ViewProps {
  units: Unit[];
  a: AvailabilityContent;
  m2: (v: number | null) => string;
  openUnit: string | null;
  onToggle: (u: Unit) => void;
  onRequestPrice: (u: Unit) => void;
  onReserve?: (u: Unit) => void;
}

// Sticky right-hand status/action column (stays pinned during horizontal scroll).
const STICKY_COL = "sticky right-0 z-10 border-l border-travertine-200";

function TableView({
  units,
  a,
  m2,
  openUnit,
  onToggle,
  onReserve,
}: ViewProps) {
  // Horizontal-scroll wrapper. No `data-lenis-prevent`: Lenis only virtualizes
  // vertical scroll, so it never traps this table's sideways scroll, and the
  // page keeps scrolling normally while the cursor is over the table.
  return (
    <div className="overflow-x-auto rounded-xl border border-travertine-200 bg-white">
      <table className="w-full min-w-[620px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-travertine-200 text-center text-xs uppercase tracking-wider text-ink/50">
            <th className="px-4 py-3 font-medium">{a.columns.unit}</th>
            <th className="px-4 py-3 font-medium">{a.columns.typology}</th>
            <th className="px-4 py-3 font-medium">{a.columns.floor}</th>
            <th className="px-4 py-3 font-medium">{a.columns.total}</th>
            <th className="px-4 py-3 font-medium">{a.columns.interior}</th>
            <th className="px-4 py-3 font-medium">{a.columns.parking}</th>
            <th
              className={`${STICKY_COL} z-20 bg-white px-4 py-3 text-center font-medium`}
            >
              {a.columns.status}
            </th>
          </tr>
        </thead>
        <tbody>
          {units.map((unit) => {
            const isAvailable = unit.status === "available";
            const isOpen = openUnit === unit.id;
            return (
              <UnitRows
                key={unit.id}
                unit={unit}
                isAvailable={isAvailable}
                isOpen={isOpen}
                onToggle={() => onToggle(unit)}
                onReserve={() => onReserve?.(unit)}
                a={a}
                m2={m2}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function UnitRows({
  unit,
  isAvailable,
  isOpen,
  onToggle,
  onReserve,
  a,
  m2,
}: {
  unit: Unit;
  isAvailable: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onReserve: () => void;
  a: AvailabilityContent;
  m2: (v: number | null) => string;
}) {
  const reduce = useReducedMotion();

  // The sticky cell needs its own background so scrolling content passes under
  // it — keep it in sync with the row's state (open / hover).
  const stickyBg = isOpen
    ? "bg-travertine-50"
    : isAvailable
      ? "bg-white group-hover:bg-travertine-50"
      : "bg-white";

  const detailInner = (
    <div className="px-4 pb-5 pt-1">
      <div className="border border-travertine-200 bg-white p-5">
        <p className="mb-3 font-serif text-lg text-plum-800">
          {a.detail.heading.replace("{unit}", unit.id)} · {unit.typology}
        </p>
        <UnitSpecList unit={unit} a={a} m2={m2} />
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onReserve}
            className="bg-plum-700 px-5 py-2 text-xs font-medium text-cream transition hover:bg-plum-600"
          >
            {a.reserveCta}
          </button>
          <span className="text-xs text-ink/45">{a.priceLabel}</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <tr
        onClick={onToggle}
        className={`group border-b border-travertine-100 transition ${
          isAvailable ? "cursor-pointer hover:bg-travertine-50" : "text-ink/40"
        } ${isOpen ? "bg-travertine-50" : ""}`}
      >
        <td className="px-4 py-3 text-center font-serif text-base text-plum-800">
          <span className={isAvailable ? "" : "text-ink/40"}>{unit.id}</span>
        </td>
        <td className="px-4 py-3 text-center">{unit.typology}</td>
        <td className="px-4 py-3 text-center">{unit.floor}</td>
        <td className="px-4 py-3 text-center">{m2(unit.totalM2)}</td>
        <td className="px-4 py-3 text-center">{m2(unit.interiorM2)}</td>
        <td className="px-4 py-3 text-center">{unit.parkingLabel}</td>
        <td className={`${STICKY_COL} ${stickyBg} px-4 py-3 text-center`}>
          {isAvailable ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onReserve();
              }}
              className="inline-flex w-28 items-center justify-center whitespace-nowrap bg-plum-700 px-4 py-1.5 text-xs font-medium text-cream transition hover:bg-plum-600"
            >
              {a.reserveCta}
            </button>
          ) : (
            <span
              className={`inline-flex w-28 items-center justify-center whitespace-nowrap px-2.5 py-1.5 text-xs ${STATUS_STYLE[unit.status]}`}
            >
              {a.statusLabels[unit.status]}
            </span>
          )}
        </td>
      </tr>

      {/* Desktop/tablet inline detail — height-animated open/close. On mobile a
          full-screen sheet is used instead (this row would overflow the
          horizontally-scrolling table). Reduced motion → instant show/hide. */}
      {reduce
        ? isOpen &&
          isAvailable && (
            <tr className="hidden bg-travertine-50 sm:table-row">
              <td colSpan={7} className="p-0">
                {detailInner}
              </td>
            </tr>
          )
        : null}

      {!reduce && (
        <AnimatePresence initial={false}>
          {isOpen && isAvailable && (
            <motion.tr
              key="detail"
              className="hidden bg-travertine-50 sm:table-row"
            >
              <td colSpan={7} className="p-0">
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: DURATION.base, ease: EASE_INOUT }}
                  className="overflow-hidden"
                >
                  {detailInner}
                </motion.div>
              </td>
            </motion.tr>
          )}
        </AnimatePresence>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Grid (card) view                                                   */
/* ------------------------------------------------------------------ */

function GridView({ units, a, m2, openUnit, onToggle, onRequestPrice }: ViewProps) {
  return (
    <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {units.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          a={a}
          m2={m2}
          isOpen={openUnit === unit.id}
          onToggle={() => onToggle(unit)}
          onRequestPrice={() => onRequestPrice(unit)}
        />
      ))}
    </div>
  );
}

function UnitCard({
  unit,
  a,
  m2,
  isOpen,
  onToggle,
  onRequestPrice,
}: {
  unit: Unit;
  a: AvailabilityContent;
  m2: (v: number | null) => string;
  isOpen: boolean;
  onToggle: () => void;
  onRequestPrice: () => void;
}) {
  const isAvailable = unit.status === "available";
  const imageSlot =
    unit.imageSlot ?? `apartment-${unit.typology.toLowerCase()}.jpg`;

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border transition ${
        isAvailable
          ? "border-travertine-200 bg-white"
          : "border-travertine-100 bg-travertine-50"
      }`}
    >
      <div className="relative">
        <Media
          slot={imageSlot}
          alt={`${unit.typology} · ${unit.id}`}
          rounded="rounded-none"
          className={`aspect-[4/3] w-full ${isAvailable ? "" : "opacity-60"}`}
        />
        <span className="absolute left-3 top-3">
          <StatusPill unit={unit} a={a} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-baseline justify-between">
          <span
            className={`font-serif text-2xl ${
              isAvailable ? "text-plum-800" : "text-ink/45"
            }`}
          >
            {unit.typology}
          </span>
          <span className="text-sm text-ink/55">
            {a.columns.unit}: {unit.id}
          </span>
        </div>

        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm text-ink/70">
          <CardFact label={a.columns.total} value={m2(unit.totalM2)} />
          <CardFact label={a.columns.interior} value={m2(unit.interiorM2)} />
          <CardFact label={a.columns.floor} value={String(unit.floor)} />
          <CardFact label={a.columns.parking} value={unit.parkingLabel} />
        </dl>

        <p className="mt-4 text-sm text-ink/60">{a.priceLabel}</p>

        {isOpen && isAvailable && (
          <div className="mt-4 rounded-lg border border-travertine-200 bg-travertine-50 p-4">
            <UnitSpecList unit={unit} a={a} m2={m2} />
          </div>
        )}

        {isAvailable ? (
          <div className="mt-auto flex flex-col gap-2 pt-5">
            <button
              type="button"
              onClick={onToggle}
              aria-expanded={isOpen}
              className="rounded-full border border-plum-700 px-5 py-2.5 text-sm font-medium text-plum-800 transition hover:bg-plum-700 hover:text-cream"
            >
              {a.viewDetailsCta}
            </button>
            <button
              type="button"
              onClick={onRequestPrice}
              className="rounded-full bg-plum-700 px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-plum-600"
            >
              {a.requestPriceCta}
            </button>
          </div>
        ) : (
          <div className="mt-auto pt-5">
            <span className="text-sm text-ink/40">{a.priceLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile detail sheet                                                */
/* ------------------------------------------------------------------ */

/**
 * Full-screen bottom sheet shown when a unit is tapped on a phone. The inline
 * table row can't be read on a narrow screen (the table scrolls horizontally),
 * so on mobile we surface every spec here instead. Hidden at `sm` and up, where
 * the inline expand row takes over.
 */
function MobileUnitDetail({
  unit,
  a,
  m2,
  onClose,
  onReserve,
}: {
  unit: Unit | null;
  a: AvailabilityContent;
  m2: (v: number | null) => string;
  onClose: () => void;
  onReserve: (u: Unit) => void;
}) {
  const reduce = useReducedMotion();
  const { locale } = useMode();
  const closeLabel = locale === "pt" ? "Fechar" : "Close";

  // Close on Escape while the sheet is open.
  useEffect(() => {
    if (!unit) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unit, onClose]);

  return (
    <AnimatePresence>
      {unit && (
        <motion.div
          key="mobile-unit-sheet"
          className="fixed inset-0 z-50 flex items-end bg-plum-900/60 backdrop-blur-sm sm:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: DURATION.micro, ease: EASE_LUX }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={a.detail.heading.replace("{unit}", unit.id)}
        >
          <motion.div
            className="relative flex max-h-[88vh] w-full flex-col overflow-hidden bg-cream"
            initial={reduce ? false : { y: "100%" }}
            animate={reduce ? false : { y: 0 }}
            exit={reduce ? { opacity: 0 } : { y: "100%" }}
            transition={{ duration: DURATION.base, ease: EASE_LUX }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grabber */}
            <div className="flex justify-center pb-1 pt-3">
              <span className="h-1 w-10 bg-travertine-300" aria-hidden />
            </div>

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-travertine-200 px-5 pb-4 pt-2">
              <div>
                <p className="font-serif text-xl text-plum-800">
                  {a.detail.heading.replace("{unit}", unit.id)} · {unit.typology}
                </p>
                <div className="mt-2">
                  <StatusPill unit={unit} a={a} />
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={closeLabel}
                className="-mr-1 -mt-1 flex h-9 w-9 flex-shrink-0 items-center justify-center text-plum-700 transition hover:bg-travertine-100"
              >
                <span aria-hidden className="text-2xl leading-none">
                  &times;
                </span>
              </button>
            </div>

            {/* Specs */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto px-5 py-5">
              <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                <DetailItem label={a.columns.floor} value={String(unit.floor)} />
                <DetailItem label={a.columns.parking} value={unit.parkingLabel} />
                <DetailItem label={a.detail.interior} value={m2(unit.interiorM2)} />
                <DetailItem label={a.detail.balcony} value={m2(unit.balconyM2)} />
                <DetailItem label={a.detail.yard} value={m2(unit.yardM2)} />
                <DetailItem label={a.detail.terrace} value={m2(unit.terraceM2)} />
                <DetailItem label={a.detail.garage} value={m2(unit.garageM2)} />
                <DetailItem label={a.detail.total} value={m2(unit.totalM2)} />
              </dl>
            </div>

            {/* Action */}
            <div className="border-t border-travertine-200 px-5 pb-6 pt-4">
              <button
                type="button"
                onClick={() => {
                  onReserve(unit);
                  onClose();
                }}
                className="w-full bg-plum-700 px-5 py-3.5 text-sm font-medium text-cream transition hover:bg-plum-600"
              >
                {a.reserveCta}
              </button>
              <p className="mt-2.5 text-center text-xs text-ink/45">
                {a.priceLabel}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/* Shared primitives                                                  */
/* ------------------------------------------------------------------ */

function StatusPill({ unit, a }: { unit: Unit; a: AvailabilityContent }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs ${STATUS_STYLE[unit.status]}`}
    >
      {a.statusLabels[unit.status]}
    </span>
  );
}

function UnitSpecList({
  unit,
  a,
  m2,
}: {
  unit: Unit;
  a: AvailabilityContent;
  m2: (v: number | null) => string;
}) {
  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-3">
      <DetailItem label={a.detail.interior} value={m2(unit.interiorM2)} />
      <DetailItem label={a.detail.balcony} value={m2(unit.balconyM2)} />
      <DetailItem label={a.detail.yard} value={m2(unit.yardM2)} />
      <DetailItem label={a.detail.terrace} value={m2(unit.terraceM2)} />
      <DetailItem label={a.detail.garage} value={m2(unit.garageM2)} />
      <DetailItem label={a.detail.total} value={m2(unit.totalM2)} />
    </dl>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-ink/45">{label}</dt>
      <dd className="mt-0.5 text-plum-800">{value}</dd>
    </div>
  );
}

function CardFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-plum-800">{value}</dd>
    </div>
  );
}

registerModule("availability", Availability);
export default Availability;
