import { describe, expect, it } from "vitest";
import {
  commitVoice,
  previewVoice,
  transcriptFromEvent,
} from "@/lib/voice";

describe("voice commit", () => {
  it("previews live speech against already typed text", () => {
    expect(previewVoice("headache", "since yesterday")).toBe(
      "headache since yesterday",
    );
    expect(previewVoice("", "pain behind my eyes")).toBe(
      "pain behind my eyes",
    );
    expect(previewVoice("headache", "")).toBe("headache");
  });

  it("commits only the live transcript into the current answer", () => {
    expect(commitVoice("I searched", "headache nausea")).toBe(
      "I searched headache nausea",
    );
    expect(commitVoice("  typed  ", "  spoken  ")).toBe("typed spoken");
  });

  it("joins recognition results into one transcript", () => {
    expect(
      transcriptFromEvent({
        results: [[{ transcript: "pain " }], [{ transcript: "behind my eyes" }]],
      }),
    ).toBe("pain behind my eyes");
  });
});
