import { beforeEach, describe, expect, it } from "vitest";
import {
  _clearSharedNotesForTests,
  createSharedNote,
  getSharedNote,
} from "@/lib/share";

const ANSWERS = {
  searched: "headache nausea light hurts",
  itSaid: "could be migraine or something serious",
  fear: "a brain tumour",
  feel: "pain behind my eyes since yesterday",
};

beforeEach(() => {
  _clearSharedNotesForTests();
});

describe("share store", () => {
  it("stores and retrieves the answers by code", () => {
    const { code } = createSharedNote({ answers: ANSWERS, didSearch: true });
    const shared = getSharedNote(code);

    expect(shared?.answers).toEqual(ANSWERS);
    expect(shared?.didSearch).toBe(true);
  });

  it("returns null for an unknown code", () => {
    expect(getSharedNote("does-not-exist")).toBeNull();
  });

  it("generates codes without ambiguous characters", () => {
    const { code } = createSharedNote({ answers: ANSWERS, didSearch: false });
    expect(code).toMatch(/^[2-9a-hj-km-np-zA-HJ-KM-NP-Z]+$/);
  });

  it("expires a note once its TTL has passed", () => {
    const now = Date.now();
    const { code, expiresAt } = createSharedNote(
      { answers: ANSWERS, didSearch: true },
      now,
    );

    expect(getSharedNote(code, expiresAt - 1)).not.toBeNull();
    expect(getSharedNote(code, expiresAt)).toBeNull();
    expect(getSharedNote(code, expiresAt)).toBeNull();
  });

  it("does not collide two notes onto the same code", () => {
    const a = createSharedNote({ answers: ANSWERS, didSearch: true });
    const b = createSharedNote({ answers: ANSWERS, didSearch: false });

    expect(a.code).not.toBe(b.code);
    expect(getSharedNote(a.code)?.didSearch).toBe(true);
    expect(getSharedNote(b.code)?.didSearch).toBe(false);
  });
});
