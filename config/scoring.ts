import type { Typology, Mode } from "@/types/content";

/**
 * Q0 fit-scoring configuration (Luxury variant).
 *
 * Weights per the Phase 1 brief §4:
 *   - timeline ≤ 6 months        → +25
 *   - off-plan delivery accepted → +20
 *   - typology matches available → +15
 *   - full form completion       → +10
 *   - purpose known              → +10
 *
 * Budget and financing are intentionally NEVER scored or asked (Luxury rule);
 * budget is inferred later from typology/project.
 */
export const SCORING_WEIGHTS = {
  timelineWithin6mo: 25,
  offPlanAccepted: 20,
  typologyAvailable: 15,
  fullCompletion: 10,
  purposeKnown: 10,
} as const;

/** Maximum attainable raw score, used to derive a 0–100 percentage. */
export const MAX_FIT_SCORE = Object.values(SCORING_WEIGHTS).reduce(
  (sum, w) => sum + w,
  0,
);

export type TimelineChoice = "within3" | "within6" | "within12" | "beyond12";
export type OffplanChoice = "yes" | "no";

export interface Q0Answers {
  typology: Typology | null;
  purpose: Mode | null;
  strategy: string | null; // inv mode only
  timeline: TimelineChoice | null;
  offplan: OffplanChoice | null;
  country: string;
  language: string;
  name: string;
  email: string;
  phone: string;
}

export interface FitScoreResult {
  raw: number;
  max: number;
  /** 0–100, normalized. */
  percent: number;
  breakdown: Record<keyof typeof SCORING_WEIGHTS, number>;
}

/**
 * Compute the client-side fit score from Q0 answers.
 * `availableTypologies` is derived from live availability so the "typology
 * matches available" signal stays truthful as inventory changes.
 */
export function computeFitScore(
  answers: Q0Answers,
  availableTypologies: Typology[],
): FitScoreResult {
  const breakdown = {
    timelineWithin6mo: 0,
    offPlanAccepted: 0,
    typologyAvailable: 0,
    fullCompletion: 0,
    purposeKnown: 0,
  } as Record<keyof typeof SCORING_WEIGHTS, number>;

  if (answers.timeline === "within3" || answers.timeline === "within6") {
    breakdown.timelineWithin6mo = SCORING_WEIGHTS.timelineWithin6mo;
  }

  if (answers.offplan === "yes") {
    breakdown.offPlanAccepted = SCORING_WEIGHTS.offPlanAccepted;
  }

  if (answers.typology && availableTypologies.includes(answers.typology)) {
    breakdown.typologyAvailable = SCORING_WEIGHTS.typologyAvailable;
  }

  if (answers.purpose) {
    breakdown.purposeKnown = SCORING_WEIGHTS.purposeKnown;
  }

  if (isComplete(answers)) {
    breakdown.fullCompletion = SCORING_WEIGHTS.fullCompletion;
  }

  const raw = Object.values(breakdown).reduce((sum, v) => sum + v, 0);
  const percent = Math.round((raw / MAX_FIT_SCORE) * 100);

  return { raw, max: MAX_FIT_SCORE, percent, breakdown };
}

/** A "full completion" means every required field carries a value. */
export function isComplete(answers: Q0Answers): boolean {
  return Boolean(
    answers.typology &&
      answers.purpose &&
      answers.timeline &&
      answers.offplan &&
      answers.country.trim() &&
      answers.language &&
      answers.name.trim() &&
      answers.email.trim() &&
      answers.phone.trim(),
  );
}
