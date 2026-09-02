export type WaitingRoomStatus =
  | "disclosure"
  | "emergency_check"
  | "asking"
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
  emergencyStop: boolean;
};

export const QUESTION_ORDER: QuestionId[] = [
  "searched",
  "itSaid",
  "fear",
  "feel",
];

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
    emergencyStop: false,
  };
}
