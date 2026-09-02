import { describe, expect, it } from "vitest";
import { questionPath, questionProgress } from "@/lib/session";

describe("questionPath", () => {
  it("puts feel first and includes search questions only after yes", () => {
    expect(questionPath(true)).toEqual(["feel", "searched", "itSaid", "fear"]);
    expect(questionPath(false)).toEqual(["feel", "fear"]);
  });
});

describe("questionProgress", () => {
  it("counts the yes path until they opt out of search", () => {
    expect(questionProgress("feel", null)).toEqual({ current: 1, total: 4 });
    expect(questionProgress("searched", true)).toEqual({ current: 2, total: 4 });
    expect(questionProgress("fear", true)).toEqual({ current: 4, total: 4 });
  });

  it("counts two steps when they did not search", () => {
    expect(questionProgress("fear", false)).toEqual({ current: 2, total: 2 });
  });
});
