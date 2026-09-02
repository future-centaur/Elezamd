import { describe, expect, it } from "vitest";
import { formatNote } from "@/lib/format-note";

const answers = {
  searched: "headache nausea light hurts",
  itSaid: "could be migraine or something serious",
  fear: "a brain tumour",
  feel: "pain behind my eyes since yesterday, worse in light, no fever, I slept badly",
};

describe("formatNote", () => {
  it("leads with feel and includes search sections when they looked it up", () => {
    const note = formatNote(answers, true);
    const feelIndex = note.indexOf("What they actually feel");
    const fearIndex = note.indexOf("What they fear it is");
    const searchedIndex = note.indexOf("What they searched");

    expect(feelIndex).toBeGreaterThan(-1);
    expect(feelIndex).toBeLessThan(fearIndex);
    expect(fearIndex).toBeLessThan(searchedIndex);
    expect(note).toContain(answers.feel);
    expect(note).toContain(answers.fear);
    expect(note).toContain(answers.searched);
    expect(note).toContain(answers.itSaid);
    expect(note).toContain("This is not a diagnosis");
    expect(note).toContain("ElezaMD does not keep this when the patient leaves");
  });

  it("omits empty search blocks when they did not look it up", () => {
    const note = formatNote(
      { ...answers, searched: "", itSaid: "" },
      false,
    );

    expect(note).toContain("What they actually feel");
    expect(note).toContain(answers.feel);
    expect(note).toContain("What they fear it is");
    expect(note).toContain(answers.fear);
    expect(note).toContain("They did not look this up before this visit");
    expect(note).not.toContain("What they searched");
    expect(note).not.toContain("What it said");
  });
});
