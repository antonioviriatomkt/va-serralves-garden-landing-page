"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type {
  DevelopmentContent,
  Typology,
  UIStrings,
} from "@/types/content";
import { useMode } from "@/lib/mode/ModeProvider";
import { useTrack } from "@/lib/hooks/useTrack";
import { DURATION, EASE_LUX } from "@/lib/motion";
import {
  computeFitScore,
  type OffplanChoice,
  type Q0Answers,
  type TimelineChoice,
} from "@/config/scoring";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import type { Q0OpenOptions } from "./Q0Provider";

const CRM_STORAGE_KEY = "va_demo_crm_leads";

type StepKey =
  | "typology"
  | "purpose"
  | "strategy"
  | "timeline"
  | "offplan"
  | "location"
  | "contact";

const TYPOLOGIES: Typology[] = ["T2", "T3", "T4"];

export function Q0Modal({
  development,
  ui,
  options,
  onClose,
}: {
  development: DevelopmentContent;
  ui: UIStrings;
  options: Q0OpenOptions;
  onClose: () => void;
}) {
  const { mode, locale } = useMode();
  const t = useTrack();
  const q = ui.q0;

  const availableTypologies = useMemo(
    () =>
      Array.from(
        new Set(
          development.units
            .filter((u) => u.status === "available")
            .map((u) => u.typology),
        ),
      ),
    [development.units],
  );

  const steps = useMemo<StepKey[]>(() => {
    const base: StepKey[] = ["typology", "purpose"];
    if (mode === "inv") base.push("strategy");
    base.push("timeline", "offplan", "location", "contact");
    return base;
  }, [mode]);

  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [fitPercent, setFitPercent] = useState<number | null>(null);
  const [attemptedNext, setAttemptedNext] = useState(false);
  const reduce = useReducedMotion();

  const [answers, setAnswers] = useState<Q0Answers>({
    typology: options.typology ?? null,
    purpose: mode, // pre-filled from intent mode
    strategy: null,
    timeline: null,
    offplan: null,
    country: "",
    language: locale === "pt" ? "pt" : "en",
    name: "",
    email: "",
    phone: "",
  });

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    t("q0_started", {
      source: options.source ?? "unknown",
      unit: options.unitId ?? null,
      prefillTypology: options.typology ?? null,
    });
  }, [t, options]);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleAbandonClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, submitted]);

  function handleAbandonClose() {
    if (!submitted) {
      t("q0_abandoned", { step: steps[stepIndex], stepIndex });
    }
    onClose();
  }

  const currentStep = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;

  function update<K extends keyof Q0Answers>(key: K, value: Q0Answers[K]) {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  }

  function stepValid(step: StepKey): boolean {
    switch (step) {
      case "typology":
        return answers.typology !== null;
      case "purpose":
        return answers.purpose !== null;
      case "strategy":
        return answers.strategy !== null;
      case "timeline":
        return answers.timeline !== null;
      case "offplan":
        return answers.offplan !== null;
      case "location":
        return answers.country.trim() !== "" && answers.language !== "";
      case "contact":
        return (
          answers.name.trim() !== "" &&
          isValidEmail(answers.email) &&
          answers.phone.trim() !== ""
        );
      default:
        return true;
    }
  }

  function goNext() {
    if (!stepValid(currentStep)) {
      setAttemptedNext(true);
      return;
    }
    t("q0_step_completed", {
      step: currentStep,
      stepIndex,
      value: answerFor(currentStep),
    });
    setAttemptedNext(false);
    if (isLast) {
      submit();
    } else {
      setDirection(1);
      setStepIndex((i) => i + 1);
    }
  }

  function goBack() {
    setAttemptedNext(false);
    setDirection(-1);
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function answerFor(step: StepKey): unknown {
    switch (step) {
      case "typology":
        return answers.typology;
      case "purpose":
        return answers.purpose;
      case "strategy":
        return answers.strategy;
      case "timeline":
        return answers.timeline;
      case "offplan":
        return answers.offplan;
      case "location":
        return { country: answers.country, language: answers.language };
      case "contact":
        return { name: answers.name, email: answers.email };
      default:
        return null;
    }
  }

  function submit() {
    const score = computeFitScore(answers, availableTypologies);
    const lead = {
      id:
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? crypto.randomUUID()
          : `lead_${Date.now()}`,
      development: development.slug,
      mode,
      locale,
      source: options.source ?? "unknown",
      unit: options.unitId ?? null,
      answers,
      fitScore: score.percent,
      fitRaw: score.raw,
      fitBreakdown: score.breakdown,
      createdAt: new Date().toISOString(),
    };

    // "Demo CRM" — persist the lead locally.
    try {
      const existing = JSON.parse(
        window.localStorage.getItem(CRM_STORAGE_KEY) || "[]",
      );
      existing.push(lead);
      window.localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(existing));
    } catch {
      /* non-fatal for the demo */
    }

    t("q0_submitted", {
      fitScore: score.percent,
      fitRaw: score.raw,
      typology: answers.typology,
      purpose: answers.purpose,
      strategy: answers.strategy,
      timeline: answers.timeline,
      offplan: answers.offplan,
      country: answers.country,
      language: answers.language,
      unit: options.unitId ?? null,
    });

    setFitPercent(score.percent);
    setSubmitted(true);
  }

  const showError = attemptedNext && !stepValid(currentStep);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-plum-900/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={q.title}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) handleAbandonClose();
      }}
    >
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
        animate={reduce ? false : { opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: DURATION.base, ease: EASE_LUX }}
        className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-cream shadow-2xl sm:rounded-2xl"
      >
        <button
          type="button"
          onClick={handleAbandonClose}
          aria-label={q.buttons.close}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full text-plum-700 transition hover:bg-travertine-100"
        >
          <span aria-hidden className="text-xl leading-none">
            &times;
          </span>
        </button>

        {submitted ? (
          <Confirmation
            ui={ui}
            fitPercent={fitPercent}
            onDone={onClose}
            onWhatsApp={() =>
              t("whatsapp_clicked", { context: "q0_confirmation" })
            }
          />
        ) : (
          <>
            <header className="border-b border-travertine-200 px-6 pb-4 pt-6 sm:px-8">
              <p className="text-xs uppercase tracking-widest2 text-brass">
                {development.name} · {development.tagline}
              </p>
              <h2 className="mt-1 font-serif text-2xl text-plum-800">
                {q.title}
              </h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-travertine-200">
                  <div
                    className="h-full rounded-full bg-plum-600 transition-all duration-300"
                    style={{
                      width: `${((stepIndex + 1) / steps.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-xs tabular-nums text-ink/60">
                  {q.stepOf
                    .replace("{n}", String(stepIndex + 1))
                    .replace("{total}", String(steps.length))}
                </span>
              </div>
            </header>

            <div
              data-lenis-prevent
              className="flex-1 overflow-y-auto px-6 py-6 sm:px-8"
            >
              {reduce ? (
                <StepBody
                  step={currentStep}
                  q={q}
                  answers={answers}
                  update={update}
                  availableTypologies={availableTypologies}
                  showError={showError}
                />
              ) : (
                <AnimatePresence mode="wait" custom={direction} initial={false}>
                  <motion.div
                    key={currentStep}
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({ opacity: 0, x: d * 40 }),
                      center: { opacity: 1, x: 0 },
                      exit: (d: number) => ({ opacity: 0, x: d * -40 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: DURATION.micro, ease: EASE_LUX }}
                  >
                    <StepBody
                      step={currentStep}
                      q={q}
                      answers={answers}
                      update={update}
                      availableTypologies={availableTypologies}
                      showError={showError}
                    />
                  </motion.div>
                </AnimatePresence>
              )}
            </div>

            <footer className="flex items-center justify-between gap-3 border-t border-travertine-200 px-6 py-4 sm:px-8">
              <button
                type="button"
                onClick={goBack}
                disabled={stepIndex === 0}
                className="rounded-full px-4 py-2 text-sm text-plum-700 transition enabled:hover:bg-travertine-100 disabled:opacity-40"
              >
                {q.buttons.back}
              </button>
              <button
                type="button"
                onClick={goNext}
                className="rounded-full bg-plum-700 px-6 py-2.5 text-sm font-medium text-cream transition hover:bg-plum-600"
              >
                {isLast ? q.buttons.submit : q.buttons.next}
              </button>
            </footer>
          </>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Step body                                                          */
/* ------------------------------------------------------------------ */

function StepBody({
  step,
  q,
  answers,
  update,
  availableTypologies,
  showError,
}: {
  step: StepKey;
  q: UIStrings["q0"];
  answers: Q0Answers;
  update: <K extends keyof Q0Answers>(key: K, value: Q0Answers[K]) => void;
  availableTypologies: Typology[];
  showError: boolean;
}) {
  switch (step) {
    case "typology":
      return (
        <StepShell title={q.steps.typology.title} help={q.steps.typology.help}>
          <div className="grid grid-cols-3 gap-3">
            {TYPOLOGIES.map((typ) => (
              <OptionCard
                key={typ}
                selected={answers.typology === typ}
                onClick={() => update("typology", typ)}
                label={typ}
                available={availableTypologies.includes(typ)}
              />
            ))}
          </div>
        </StepShell>
      );

    case "purpose":
      return (
        <StepShell title={q.steps.purpose.title} help={q.steps.purpose.help}>
          <div className="grid gap-3">
            <OptionRow
              selected={answers.purpose === "res"}
              onClick={() => update("purpose", "res")}
              label={q.steps.purpose.live}
            />
            <OptionRow
              selected={answers.purpose === "inv"}
              onClick={() => update("purpose", "inv")}
              label={q.steps.purpose.invest}
            />
          </div>
        </StepShell>
      );

    case "strategy":
      return (
        <StepShell title={q.steps.strategy.title} help={q.steps.strategy.help}>
          <div className="grid gap-3">
            {(
              [
                ["longTerm", q.steps.strategy.longTerm],
                ["shortTerm", q.steps.strategy.shortTerm],
                ["resale", q.steps.strategy.resale],
                ["ownUse", q.steps.strategy.ownUse],
              ] as const
            ).map(([value, label]) => (
              <OptionRow
                key={value}
                selected={answers.strategy === value}
                onClick={() => update("strategy", value)}
                label={label}
              />
            ))}
          </div>
        </StepShell>
      );

    case "timeline":
      return (
        <StepShell title={q.steps.timeline.title} help={q.steps.timeline.help}>
          <div className="grid gap-3">
            {(
              [
                ["within3", q.steps.timeline.within3],
                ["within6", q.steps.timeline.within6],
                ["within12", q.steps.timeline.within12],
                ["beyond12", q.steps.timeline.beyond12],
              ] as const
            ).map(([value, label]) => (
              <OptionRow
                key={value}
                selected={answers.timeline === (value as TimelineChoice)}
                onClick={() => update("timeline", value as TimelineChoice)}
                label={label}
              />
            ))}
          </div>
        </StepShell>
      );

    case "offplan":
      return (
        <StepShell title={q.steps.offplan.title} help={q.steps.offplan.help}>
          <div className="grid grid-cols-2 gap-3">
            <OptionRow
              selected={answers.offplan === "yes"}
              onClick={() => update("offplan", "yes" as OffplanChoice)}
              label={q.steps.offplan.yes}
            />
            <OptionRow
              selected={answers.offplan === "no"}
              onClick={() => update("offplan", "no" as OffplanChoice)}
              label={q.steps.offplan.no}
            />
          </div>
        </StepShell>
      );

    case "location":
      return (
        <StepShell title={q.steps.location.title} help={q.steps.location.help}>
          <label className="block">
            <span className="mb-1.5 block text-sm text-ink/80">
              {q.steps.location.countryLabel}
            </span>
            <input
              type="text"
              value={answers.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder={q.steps.location.countryPlaceholder}
              className="w-full rounded-lg border border-travertine-300 bg-white px-4 py-3 text-ink outline-none transition focus:border-plum-500"
            />
          </label>
          <div className="mt-4">
            <span className="mb-1.5 block text-sm text-ink/80">
              {q.steps.location.languageLabel}
            </span>
            <div className="grid grid-cols-2 gap-3">
              <OptionRow
                selected={answers.language === "pt"}
                onClick={() => update("language", "pt")}
                label={q.steps.location.pt}
              />
              <OptionRow
                selected={answers.language === "en"}
                onClick={() => update("language", "en")}
                label={q.steps.location.en}
              />
            </div>
          </div>
          {showError && (
            <p className="mt-3 text-sm text-plum-600">{q.validation.required}</p>
          )}
        </StepShell>
      );

    case "contact":
      return (
        <StepShell title={q.steps.contact.title} help={q.steps.contact.help}>
          <div className="grid gap-4">
            <label className="block">
              <span className="mb-1.5 block text-sm text-ink/80">
                {q.steps.contact.name}
              </span>
              <input
                type="text"
                value={answers.name}
                onChange={(e) => update("name", e.target.value)}
                autoComplete="name"
                className="w-full rounded-lg border border-travertine-300 bg-white px-4 py-3 text-ink outline-none transition focus:border-plum-500"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-ink/80">
                {q.steps.contact.email}
              </span>
              <input
                type="email"
                value={answers.email}
                onChange={(e) => update("email", e.target.value)}
                autoComplete="email"
                className="w-full rounded-lg border border-travertine-300 bg-white px-4 py-3 text-ink outline-none transition focus:border-plum-500"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm text-ink/80">
                {q.steps.contact.phone}
              </span>
              <input
                type="tel"
                value={answers.phone}
                onChange={(e) => update("phone", e.target.value)}
                autoComplete="tel"
                className="w-full rounded-lg border border-travertine-300 bg-white px-4 py-3 text-ink outline-none transition focus:border-plum-500"
              />
            </label>
            {showError && (
              <p className="text-sm text-plum-600">
                {isValidEmail(answers.email)
                  ? q.validation.required
                  : q.validation.email}
              </p>
            )}
            <p className="text-xs leading-relaxed text-ink/55">
              {q.steps.contact.consent}
            </p>
          </div>
        </StepShell>
      );

    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Confirmation                                                       */
/* ------------------------------------------------------------------ */

function Confirmation({
  ui,
  fitPercent,
  onDone,
  onWhatsApp,
}: {
  ui: UIStrings;
  fitPercent: number | null;
  onDone: () => void;
  onWhatsApp: () => void;
}) {
  const c = ui.q0.confirmation;
  return (
    <div className="px-6 py-12 text-center sm:px-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brass/40 text-brass">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden
        >
          <path
            d="M5 12.5l4.2 4.2L19 7"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="mt-6 font-serif text-2xl text-plum-800">{c.title}</h2>
      <p className="mx-auto mt-3 max-w-sm text-ink/75">{c.body}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-ink/60">{c.followUp}</p>

      {fitPercent !== null && (
        <p className="mt-4 text-xs uppercase tracking-widest2 text-ink/40">
          demo · fit {fitPercent}
        </p>
      )}

      <div className="mt-8 flex flex-col items-center gap-3">
        <a
          href={buildWhatsAppUrl(ui.whatsapp.prefill)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onWhatsApp}
          className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-plum-700 px-6 py-3 text-sm font-medium text-cream transition hover:bg-plum-600"
        >
          {c.whatsapp}
        </a>
        <button
          type="button"
          onClick={onDone}
          className="text-sm text-plum-700 underline-offset-4 hover:underline"
        >
          {c.done}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small primitives                                                   */
/* ------------------------------------------------------------------ */

function StepShell({
  title,
  help,
  children,
}: {
  title: string;
  help: string;
  children: React.ReactNode;
}) {
  return (
    <div className="animate-fade-in">
      <h3 className="font-serif text-xl text-plum-800">{title}</h3>
      {help && <p className="mt-1.5 text-sm text-ink/65">{help}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function OptionCard({
  label,
  available,
  selected,
  onClick,
}: {
  label: string;
  available?: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex flex-col items-center justify-center rounded-xl border px-3 py-5 text-center transition ${
        selected
          ? "border-plum-600 bg-plum-700 text-cream"
          : "border-travertine-300 bg-white text-plum-800 hover:border-plum-400"
      }`}
    >
      <span className="font-serif text-xl">{label}</span>
      <span
        className={`mt-1.5 h-1.5 w-1.5 rounded-full ${
          available
            ? selected
              ? "bg-cream/80"
              : "bg-brass"
            : "bg-transparent"
        }`}
        aria-hidden
      />
    </button>
  );
}

function OptionRow({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-xl border px-4 py-3.5 text-left text-sm transition ${
        selected
          ? "border-plum-600 bg-plum-700 text-cream"
          : "border-travertine-300 bg-white text-plum-800 hover:border-plum-400"
      }`}
    >
      {label}
    </button>
  );
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
