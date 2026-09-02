import { NOTE, PRODUCT_NAME } from "./copy";
import type { WaitingRoomAnswers } from "./session";

export function formatNote(answers: WaitingRoomAnswers): string {
  return [
    PRODUCT_NAME,
    NOTE.forTheNurse,
    NOTE.intro,
    "",
    NOTE.aiHelped,
    NOTE.keepNothing,
    "",
    NOTE.searchedLabel,
    answers.searched,
    "",
    NOTE.itSaidLabel,
    answers.itSaid,
    "",
    NOTE.fearLabel,
    answers.fear,
    "",
    NOTE.feelLabel,
    answers.feel,
    "",
    NOTE.clinicHint,
  ].join("\n");
}
