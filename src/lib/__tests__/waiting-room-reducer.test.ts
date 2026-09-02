import { describe, expect, it } from "vitest";
import { createEmptySession } from "@/lib/session";
import { waitingRoomReducer } from "@/lib/waiting-room-reducer";

function startFeel() {
  let session = createEmptySession();
  session = waitingRoomReducer(session, { type: "CONTINUE_DISCLOSURE" });
  session = waitingRoomReducer(session, {
    type: "SELECT_WARNING_SIGNS",
    selectedIds: ["none"],
  });
  return session;
}

describe("waitingRoomReducer", () => {
  it("starts empty with disclosure", () => {
    const session = createEmptySession();
    expect(session.status).toBe("disclosure");
    expect(session.answers).toEqual({
      searched: "",
      itSaid: "",
      fear: "",
      feel: "",
    });
    expect(session.didSearch).toBeNull();
    expect(session.emergencyStop).toBe(false);
  });

  it("opens the body question after none of these", () => {
    const session = startFeel();
    expect(session.status).toBe("asking");
    expect(session.currentQuestion).toBe("feel");
  });

  it("stops without a note when a warning sign is selected", () => {
    let session = createEmptySession();
    session = waitingRoomReducer(session, { type: "CONTINUE_DISCLOSURE" });
    session = waitingRoomReducer(session, {
      type: "SELECT_WARNING_SIGNS",
      selectedIds: ["chest_pain"],
    });
    expect(session.status).toBe("emergency_stop");
    expect(session.emergencyStop).toBe(true);
    expect(session.currentQuestion).toBe(null);
  });

  it("asks the search gate after the body question", () => {
    let session = startFeel();
    session = waitingRoomReducer(session, {
      type: "SET_ANSWER",
      questionId: "feel",
      text: "pain behind my eyes since yesterday",
    });
    session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    expect(session.status).toBe("search_gate");
    expect(session.currentQuestion).toBe(null);
    expect(session.answers.feel).toBe("pain behind my eyes since yesterday");
  });

  it("keeps typed answers when moving back from the gate", () => {
    let session = startFeel();
    session = waitingRoomReducer(session, {
      type: "SET_ANSWER",
      questionId: "feel",
      text: "pain behind my eyes since yesterday",
    });
    session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    session = waitingRoomReducer(session, { type: "BACK_FROM_SEARCH_GATE" });
    expect(session.status).toBe("asking");
    expect(session.currentQuestion).toBe("feel");
    expect(session.didSearch).toBeNull();
    expect(session.answers.feel).toBe("pain behind my eyes since yesterday");
  });

  it("takes the search path after yes", () => {
    let session = startFeel();
    session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    session = waitingRoomReducer(session, {
      type: "SET_DID_SEARCH",
      didSearch: true,
    });
    expect(session.status).toBe("asking");
    expect(session.currentQuestion).toBe("searched");
    expect(session.didSearch).toBe(true);
  });

  it("skips search questions after no and still asks fear", () => {
    let session = startFeel();
    session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    session = waitingRoomReducer(session, {
      type: "SET_DID_SEARCH",
      didSearch: false,
    });
    expect(session.status).toBe("asking");
    expect(session.currentQuestion).toBe("fear");
    expect(session.didSearch).toBe(false);
  });

  it("clears search answers if they later say they did not search", () => {
    let session = startFeel();
    session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    session = waitingRoomReducer(session, {
      type: "SET_DID_SEARCH",
      didSearch: true,
    });
    session = waitingRoomReducer(session, {
      type: "SET_ANSWER",
      questionId: "searched",
      text: "headache nausea light hurts",
    });
    session = waitingRoomReducer(session, { type: "PREV_QUESTION" });
    session = waitingRoomReducer(session, {
      type: "SET_DID_SEARCH",
      didSearch: false,
    });
    expect(session.currentQuestion).toBe("fear");
    expect(session.answers.searched).toBe("");
    expect(session.answers.itSaid).toBe("");
  });

  it("shows the note after the yes path and clears on done", () => {
    let session = startFeel();
    session = waitingRoomReducer(session, {
      type: "SET_ANSWER",
      questionId: "feel",
      text: "pain behind my eyes since yesterday",
    });
    session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    session = waitingRoomReducer(session, {
      type: "SET_DID_SEARCH",
      didSearch: true,
    });

    const searchAnswers = {
      searched: "headache nausea light hurts",
      itSaid: "could be migraine or something serious",
      fear: "a brain tumour",
    } as const;

    for (const [questionId, text] of Object.entries(searchAnswers)) {
      session = waitingRoomReducer(session, {
        type: "SET_ANSWER",
        questionId: questionId as keyof typeof searchAnswers,
        text,
      });
      session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    }

    expect(session.status).toBe("note");
    expect(session.answers.feel).toBe("pain behind my eyes since yesterday");
    expect(session.answers.searched).toBe(searchAnswers.searched);
    expect(session.didSearch).toBe(true);

    session = waitingRoomReducer(session, { type: "DONE" });
    expect(session.status).toBe("disclosure");
    expect(session.answers.searched).toBe("");
    expect(session.answers.feel).toBe("");
    expect(session.didSearch).toBeNull();
  });

  it("shows the note after feel, no search, and fear", () => {
    let session = startFeel();
    session = waitingRoomReducer(session, {
      type: "SET_ANSWER",
      questionId: "feel",
      text: "pain behind my eyes since yesterday",
    });
    session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    session = waitingRoomReducer(session, {
      type: "SET_DID_SEARCH",
      didSearch: false,
    });
    session = waitingRoomReducer(session, {
      type: "SET_ANSWER",
      questionId: "fear",
      text: "a brain tumour",
    });
    session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    expect(session.status).toBe("note");
    expect(session.didSearch).toBe(false);
    expect(session.answers.searched).toBe("");
  });
});
