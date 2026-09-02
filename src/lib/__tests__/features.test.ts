import { describe, expect, it } from "vitest";
import { FEATURES } from "@/lib/features";

describe("feature flags", () => {
  it("keeps voice and tidy off by default", () => {
    expect(FEATURES.VOICE).toBe(false);
    expect(FEATURES.TIDY).toBe(false);
  });
});
