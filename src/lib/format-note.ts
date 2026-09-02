import { NOTE, PRODUCT_NAME } from "./copy";
import type { WaitingRoomAnswers } from "./session";

export function formatNote(
  answers: WaitingRoomAnswers,
  didSearch: boolean,
): string {
  const searchSection = didSearch
    ? [
        NOTE.searchedLabel,
        answers.searched,
        "",
        NOTE.itSaidLabel,
        answers.itSaid,
        "",
      ]
    : [NOTE.didNotSearch, ""];

  return [
    PRODUCT_NAME,
    NOTE.forTheNurse,
    NOTE.intro,
    "",
    NOTE.aiHelped,
    NOTE.keepNothing,
    "",
    NOTE.feelLabel,
    answers.feel,
    "",
    NOTE.fearLabel,
    answers.fear,
    "",
    ...searchSection,
    NOTE.clinicHint,
  ].join("\n");
}
