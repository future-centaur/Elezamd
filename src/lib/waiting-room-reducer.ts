import { shouldEmergencyStop } from "./emergency";
import {
  createEmptySession,
  QUESTION_ORDER,
  type QuestionId,
  type WaitingRoomSession,
} from "./session";

export type WaitingRoomAction =
  | { type: "CONTINUE_DISCLOSURE" }
  | { type: "BACK_TO_DISCLOSURE" }
  | { type: "SELECT_WARNING_SIGNS"; selectedIds: string[] }
  | { type: "SET_ANSWER"; questionId: QuestionId; text: string }
  | { type: "NEXT_QUESTION" }
  | { type: "PREV_QUESTION" }
  | { type: "DONE" };

export function waitingRoomReducer(
  session: WaitingRoomSession,
  action: WaitingRoomAction,
): WaitingRoomSession {
  switch (action.type) {
    case "CONTINUE_DISCLOSURE":
      return { ...session, status: "emergency_check" };

    case "BACK_TO_DISCLOSURE":
      return { ...session, status: "disclosure" };

    case "SELECT_WARNING_SIGNS": {
      if (shouldEmergencyStop(action.selectedIds)) {
        return {
          ...session,
          status: "emergency_stop",
          emergencyStop: true,
          currentQuestion: null,
        };
      }

      return {
        ...session,
        status: "asking",
        emergencyStop: false,
        currentQuestion: "searched",
      };
    }

    case "SET_ANSWER":
      return {
        ...session,
        answers: {
          ...session.answers,
          [action.questionId]: action.text,
        },
      };

    case "NEXT_QUESTION": {
      if (session.status !== "asking" || session.currentQuestion === null) {
        return session;
      }

      const index = QUESTION_ORDER.indexOf(session.currentQuestion);
      if (index < 0) {
        return session;
      }

      if (index >= QUESTION_ORDER.length - 1) {
        return { ...session, status: "note", currentQuestion: null };
      }

      return {
        ...session,
        currentQuestion: QUESTION_ORDER[index + 1],
      };
    }

    case "PREV_QUESTION": {
      if (session.status !== "asking" || session.currentQuestion === null) {
        return session;
      }

      const index = QUESTION_ORDER.indexOf(session.currentQuestion);
      if (index <= 0) {
        return {
          ...session,
          status: "emergency_check",
          currentQuestion: null,
        };
      }

      return {
        ...session,
        currentQuestion: QUESTION_ORDER[index - 1],
      };
    }

    case "DONE":
      return createEmptySession();
  }
}
