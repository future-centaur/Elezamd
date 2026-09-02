const FORBIDDEN = [
  "you may have",
  "you likely",
  "possible condition",
  "differential",
  "recommended specialty",
  "see a clinician today",
  "medical diagnosis",
] as const;

const DIAGNOSIS_EXCEPTIONS = ["not a diagnosis"];

export function containsForbiddenPhrase(text: string): boolean {
  const lower = text.toLowerCase();

  if (FORBIDDEN.some((phrase) => lower.includes(phrase))) {
    return true;
  }

  if (!lower.includes("diagnosis")) {
    return false;
  }

  const withoutAllowed = DIAGNOSIS_EXCEPTIONS.reduce(
    (acc, allowed) => acc.replace(new RegExp(allowed, "g"), ""),
    lower,
  );

  return withoutAllowed.includes("diagnosis");
}

export function collectStrings(value: unknown): string[] {
  if (typeof value === "string") {
    return [value];
  }

  if (typeof value === "function") {
    return [];
  }

  if (Array.isArray(value)) {
    return value.flatMap(collectStrings);
  }

  if (value && typeof value === "object") {
    return Object.values(value).flatMap(collectStrings);
  }

  return [];
}
