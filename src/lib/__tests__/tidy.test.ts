import { describe, expect, it } from "vitest";
import {
  chooseTidyResult,
  extractTidyText,
  isQuestionId,
  isUnsafeTidyOutput,
} from "@/lib/tidy";

describe("tidy safety", () => {
  it("flags forbidden model language", () => {
    expect(isUnsafeTidyOutput("you may have a migraine")).toBe(true);
    expect(isUnsafeTidyOutput("This is likely meningitis")).toBe(true);
    expect(isUnsafeTidyOutput("consistent with pneumonia")).toBe(true);
    expect(isUnsafeTidyOutput("possible condition: flu")).toBe(true);
    expect(isUnsafeTidyOutput("Pain behind the eyes since yesterday.")).toBe(
      false,
    );
  });

  it("does not treat unlikely as likely", () => {
    expect(isUnsafeTidyOutput("they said it was unlikely to be serious")).toBe(
      false,
    );
  });

  it("extracts JSON text and rejects a conditions array", () => {
    expect(extractTidyText('{"text":"pain behind my eyes"}')).toBe(
      "pain behind my eyes",
    );
    expect(
      extractTidyText('```json\n{"text":"pain behind my eyes"}\n```'),
    ).toBe("pain behind my eyes");
    expect(
      extractTidyText('{"text":"headache","conditions":["migraine"]}'),
    ).toBe(null);
    expect(extractTidyText('{"conditions":["migraine"]}')).toBe(null);
    expect(extractTidyText("not json")).toBe(null);
  });

  it("returns allowed cleanup and drops forbidden or empty fills", () => {
    expect(
      chooseTidyResult(
        "pain behind my eyes since yesturday",
        "Pain behind my eyes since yesterday.",
      ),
    ).toBe("Pain behind my eyes since yesterday.");

    expect(
      chooseTidyResult("headache", "you may have a migraine"),
    ).toBe("headache");

    expect(chooseTidyResult("", "I have a fever")).toBe("");
    expect(chooseTidyResult("headache", null)).toBe("headache");
    expect(chooseTidyResult("headache", "   ")).toBe("headache");
  });

  it("only accepts the four question ids", () => {
    expect(isQuestionId("searched")).toBe(true);
    expect(isQuestionId("feel")).toBe(true);
    expect(isQuestionId("diagnosis")).toBe(false);
  });
});
