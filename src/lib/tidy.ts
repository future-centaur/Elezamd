import { QUESTION_ORDER, type QuestionId } from "./session";

const TIDY_DENY = [
  "you may have",
  "you likely",
  "likely",
  "diagnos",
  "consistent with",
  "possible condition",
  "differential",
  "recommended specialty",
  "see a clinician today",
  "medical diagnosis",
] as const;

export function isQuestionId(value: unknown): value is QuestionId {
  return (
    typeof value === "string" &&
    QUESTION_ORDER.includes(value as QuestionId)
  );
}

export function isUnsafeTidyOutput(text: string): boolean {
  const lower = text.toLowerCase();
  return TIDY_DENY.some((phrase) => {
    if (phrase === "likely") {
      return /\blikely\b/.test(lower);
    }
    return lower.includes(phrase);
  });
}

export function extractTidyText(modelText: string): string | null {
  const trimmed = modelText
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (parsed && typeof parsed === "object" && "conditions" in parsed) {
      return null;
    }
    if (
      parsed &&
      typeof parsed === "object" &&
      "text" in parsed &&
      typeof parsed.text === "string"
    ) {
      return parsed.text;
    }
  } catch {
    return null;
  }

  return null;
}

export function chooseTidyResult(original: string, candidate: string | null): string {
  const source = original.trim();
  if (!source) {
    return original;
  }

  const cleaned = candidate?.trim() ?? "";
  if (!cleaned) {
    return original;
  }

  if (isUnsafeTidyOutput(cleaned)) {
    return original;
  }

  return cleaned;
}

export const TIDY_SYSTEM_PROMPT = `You clean one waiting-room answer so a nurse can read it.

Rules:
- Keep the same meaning. Do not add facts, symptoms, or details they did not state.
- Do not diagnose, list conditions, rank likelihoods, or recommend a specialty.
- Do not fill blanks or invent an answer.
- Do not write "you may have", "likely", "consistent with", or any condition list.
- For body-feeling answers, you may break the text into readable sentences without adding facts.
- Fix obvious typos or speech-to-text errors only.

Return JSON only: {"text":"..."}`;
