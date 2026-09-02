import { describe, expect, it } from "vitest";
import { NONE_WARNING_ID, shouldEmergencyStop } from "@/lib/emergency";

describe("shouldEmergencyStop", () => {
  it("returns false for none only", () => {
    expect(shouldEmergencyStop([NONE_WARNING_ID])).toBe(false);
  });

  it("returns false when nothing is selected", () => {
    expect(shouldEmergencyStop([])).toBe(false);
  });

  it("returns true for any warning sign", () => {
    expect(shouldEmergencyStop(["chest_pain"])).toBe(true);
    expect(shouldEmergencyStop(["difficulty_breathing"])).toBe(true);
    expect(shouldEmergencyStop(["severe_bleeding"])).toBe(true);
    expect(shouldEmergencyStop(["fainting"])).toBe(true);
  });

  it("does not let none downgrade a warning sign", () => {
    expect(shouldEmergencyStop(["chest_pain", NONE_WARNING_ID])).toBe(true);
  });
});
