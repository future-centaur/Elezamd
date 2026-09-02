import { describe, expect, it } from "vitest";
import { createEmptySession } from "@/lib/session";
import { waitingRoomReducer } from "@/lib/waiting-room-reducer";

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
    expect(session.emergencyStop).toBe(false);
  });

  it("opens the four questions after none of these", () => {
    let session = createEmptySession();
    session = waitingRoomReducer(session, { type: "CONTINUE_DISCLOSURE" });
    session = waitingRoomReducer(session, {
      type: "SELECT_WARNING_SIGNS",
      selectedIds: ["none"],
    });
    expect(session.status).toBe("asking");
    expect(session.currentQuestion).toBe("searched");
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

  it("keeps typed answers when moving back", () => {
    let session = createEmptySession();
    session = waitingRoomReducer(session, { type: "CONTINUE_DISCLOSURE" });
    session = waitingRoomReducer(session, {
      type: "SELECT_WARNING_SIGNS",
      selectedIds: ["none"],
    });
    session = waitingRoomReducer(session, {
      type: "SET_ANSWER",
      questionId: "searched",
      text: "headache nausea light hurts",
    });
    session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    session = waitingRoomReducer(session, { type: "PREV_QUESTION" });
    expect(session.currentQuestion).toBe("searched");
    expect(session.answers.searched).toBe("headache nausea light hurts");
  });

  it("shows the note after four answers and clears on done", () => {
    let session = createEmptySession();
    session = waitingRoomReducer(session, { type: "CONTINUE_DISCLOSURE" });
    session = waitingRoomReducer(session, {
      type: "SELECT_WARNING_SIGNS",
      selectedIds: ["none"],
    });

    const answers = {
      searched: "headache nausea light hurts",
      itSaid: "could be migraine or something serious",
      fear: "a brain tumour",
      feel: "pain behind my eyes since yesterday",
    } as const;

    for (const [questionId, text] of Object.entries(answers)) {
      session = waitingRoomReducer(session, {
        type: "SET_ANSWER",
        questionId: questionId as keyof typeof answers,
        text,
      });
      session = waitingRoomReducer(session, { type: "NEXT_QUESTION" });
    }

    expect(session.status).toBe("note");
    expect(session.answers).toEqual(answers);

    session = waitingRoomReducer(session, { type: "DONE" });
    expect(session.status).toBe("disclosure");
    expect(session.answers.searched).toBe("");
    expect(session.answers.feel).toBe("");
  });
});
