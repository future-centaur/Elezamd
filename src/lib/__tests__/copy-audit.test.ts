import { describe, expect, it } from "vitest";
import * as copy from "@/lib/copy";
import { collectStrings, containsForbiddenPhrase } from "@/lib/forbidden-phrases";

describe("copy audit", () => {
  const strings = collectStrings(copy);

  it("includes AI disclosure copy", () => {
    expect(strings.some((text) => text.includes("AI is involved"))).toBe(true);
  });

  it("does not use forbidden clinical language in system copy", () => {
    for (const text of strings) {
      expect(containsForbiddenPhrase(text), text).toBe(false);
    }
  });

  it("flags diagnosis language except not a diagnosis", () => {
    expect(containsForbiddenPhrase("This is not a diagnosis.")).toBe(false);
    expect(containsForbiddenPhrase("you may have a migraine")).toBe(true);
    expect(containsForbiddenPhrase("recommended specialty")).toBe(true);
    expect(containsForbiddenPhrase("medical diagnosis")).toBe(true);
  });
});
