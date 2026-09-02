export type WaitingRoomStatus =
  | "disclosure"
  | "emergency_check"
  | "asking"
  | "search_gate"
  | "note"
  | "emergency_stop"
  | "ended";

export type QuestionId = "searched" | "itSaid" | "fear" | "feel";

export type WaitingRoomAnswers = {
  searched: string;
  itSaid: string;
  fear: string;
  feel: string;
};

export type WaitingRoomSession = {
  startedAt: string;
  status: WaitingRoomStatus;
  currentQuestion: QuestionId | null;
  answers: WaitingRoomAnswers;
  didSearch: boolean | null;
  emergencyStop: boolean;
};

export const QUESTION_IDS: QuestionId[] = [
  "searched",
  "itSaid",
  "fear",
  "feel",
];

export function questionPath(didSearch: boolean): QuestionId[] {
  if (didSearch) {
    return ["feel", "searched", "itSaid", "fear"];
  }

  return ["feel", "fear"];
}

export function questionProgress(
  questionId: QuestionId,
  didSearch: boolean | null,
): { current: number; total: number } {
  const path = questionPath(didSearch !== false);
  const index = path.indexOf(questionId);

  return {
    current: index >= 0 ? index + 1 : 1,
    total: path.length,
  };
}

export function createEmptySession(): WaitingRoomSession {
  return {
    startedAt: new Date().toISOString(),
    status: "disclosure",
    currentQuestion: null,
    answers: {
      searched: "",
      itSaid: "",
      fear: "",
      feel: "",
    },
    didSearch: null,
    emergencyStop: false,
  };
}
