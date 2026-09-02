import { describe, expect, it } from "vitest";
import { FEATURES } from "@/lib/features";

describe("feature flags", () => {
  it("keeps voice, tidy, and share-link off by default", () => {
    expect(FEATURES.VOICE).toBe(false);
    expect(FEATURES.TIDY).toBe(false);
    expect(FEATURES.SHARE_LINK).toBe(false);
  });
});
