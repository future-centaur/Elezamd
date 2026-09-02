import { shouldEmergencyStop } from "./emergency";
import {
  createEmptySession,
  questionPath,
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
  | { type: "SET_DID_SEARCH"; didSearch: boolean }
  | { type: "BACK_FROM_SEARCH_GATE" }
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
        currentQuestion: "feel",
        didSearch: null,
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

      if (session.currentQuestion === "feel") {
        return {
          ...session,
          status: "search_gate",
          currentQuestion: null,
        };
      }

      if (session.didSearch === null) {
        return session;
      }

      const path = questionPath(session.didSearch);
      const index = path.indexOf(session.currentQuestion);
      if (index < 0 || index >= path.length - 1) {
        return { ...session, status: "note", currentQuestion: null };
      }

      return {
        ...session,
        currentQuestion: path[index + 1],
      };
    }

    case "PREV_QUESTION": {
      if (session.status !== "asking" || session.currentQuestion === null) {
        return session;
      }

      if (session.currentQuestion === "feel") {
        return {
          ...session,
          status: "emergency_check",
          currentQuestion: null,
        };
      }

      if (session.didSearch === null) {
        return session;
      }

      const path = questionPath(session.didSearch);
      const index = path.indexOf(session.currentQuestion);
      if (index <= 1) {
        return {
          ...session,
          status: "search_gate",
          currentQuestion: null,
        };
      }

      return {
        ...session,
        currentQuestion: path[index - 1],
      };
    }

    case "SET_DID_SEARCH": {
      if (action.didSearch) {
        return {
          ...session,
          status: "asking",
          didSearch: true,
          currentQuestion: "searched",
        };
      }

      return {
        ...session,
        status: "asking",
        didSearch: false,
        currentQuestion: "fear",
        answers: {
          ...session.answers,
          searched: "",
          itSaid: "",
        },
      };
    }

    case "BACK_FROM_SEARCH_GATE":
      return {
        ...session,
        status: "asking",
        currentQuestion: "feel",
        didSearch: null,
      };

    case "DONE":
      return createEmptySession();
  }
}
