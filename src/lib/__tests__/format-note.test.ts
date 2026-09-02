import { describe, expect, it } from "vitest";
import { formatNote } from "@/lib/format-note";

describe("formatNote", () => {
  it("includes the four sections unmodified", () => {
    const answers = {
      searched: "headache nausea light hurts",
      itSaid: "could be migraine or something serious",
      fear: "a brain tumour",
      feel: "pain behind my eyes since yesterday, worse in light, no fever, I slept badly",
    };

    const note = formatNote(answers);

    expect(note).toContain("What they searched");
    expect(note).toContain(answers.searched);
    expect(note).toContain("What it said");
    expect(note).toContain(answers.itSaid);
    expect(note).toContain("What they fear it is");
    expect(note).toContain(answers.fear);
    expect(note).toContain("What they actually feel");
    expect(note).toContain(answers.feel);
    expect(note).toContain("This is not a diagnosis");
    expect(note).toContain("ElezaMD does not keep this when the patient leaves");
  });
});
