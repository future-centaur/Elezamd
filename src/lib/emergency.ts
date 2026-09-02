export const WARNING_SIGN_IDS = [
  "chest_pain",
  "difficulty_breathing",
  "severe_bleeding",
  "fainting",
] as const;

export type WarningSignId = (typeof WARNING_SIGN_IDS)[number];

export const NONE_WARNING_ID = "none";

export const WARNING_SIGNS: { id: WarningSignId; label: string }[] = [
  { id: "chest_pain", label: "Chest pain or pressure" },
  { id: "difficulty_breathing", label: "Difficulty breathing" },
  { id: "severe_bleeding", label: "Severe bleeding" },
  { id: "fainting", label: "Fainting or loss of consciousness" },
];

export function shouldEmergencyStop(selectedIds: string[]): boolean {
  return selectedIds.some((id) =>
    WARNING_SIGN_IDS.includes(id as WarningSignId),
  );
}
