import type { QuestionId } from "./session";

export const PRODUCT_NAME = "ElezaMD";
export const TAGLINE = "Eleza. Don’t diagnose.";
export const SUBTITLE = "before the doctor";

export const LANDING = {
  waitingRoomLabel: "Waiting room",
  demoNumber: "+254 700 353 926",
  demoNumberHint: "A number they message",
  messageToStart: "Message to start",
  threadPreview: "ElezaMD · waiting room",
};

export const DISCLOSURE = {
  title: PRODUCT_NAME,
  aiInvolved: "AI is involved in this session.",
  notDiagnosis:
    "This is not a diagnosis. We will not tell you what you have.",
  elezaMeans:
    "Eleza means explain — you describe, the clinician decides.",
  stayOnPhone:
    "Your answers stay on this phone for you to show the nurse.",
  keepNothing: "When you close this page, ElezaMD keeps nothing.",
  clinicRecord:
    "If the nurse copies the note into the clinic file, that becomes the clinic’s record, not ours.",
  continue: "Continue",
};

export const EMERGENCY_CHECK = {
  title: "Are you having any of these right now?",
  none: "None of these",
  continue: "Continue",
  back: "Back",
};

export const EMERGENCY_STOP = {
  title: "Please seek care now",
  body: "Based on what you selected, this is not something to wait on in a queue. Please seek in-person or emergency care now.",
  done: "I’m done",
};

export const QUESTIONS: Record<
  QuestionId,
  { title: string; prompt: string }
> = {
  searched: {
    title: "What you searched",
    prompt: "What did you type into Google, ChatGPT, or another app?",
  },
  itSaid: {
    title: "What it said",
    prompt: "What did it tell you? Paste or say it in your own words.",
  },
  fear: {
    title: "What you fear it is",
    prompt: "What are you afraid this is?",
  },
  feel: {
    title: "What you actually feel",
    prompt:
      "Never mind the search. What do you actually feel in your body — where, since when, and what changed?",
  },
};

export const QUESTION_UI = {
  continue: "Continue",
  back: "Back",
  progress: (current: number, total: number) => `${current} of ${total}`,
  answerLabel: "Your answer",
  tidying: "Making this clearer…",
  holdToTalk: "Hold to talk",
  listening: "Listening…",
};

export const NOTE = {
  title: PRODUCT_NAME,
  forTheNurse: "For the nurse",
  intro: "A note the patient is showing you from their phone.",
  badge: "AI-assisted • Not a diagnosis • We keep nothing",
  aiHelped:
    "AI helped collect these answers. This is not a diagnosis.",
  keepNothing: "ElezaMD does not keep this when the patient leaves.",
  searchedLabel: "What they searched",
  itSaidLabel: "What it said",
  fearLabel: "What they fear it is",
  feelLabel: "What they actually feel",
  clinicHint:
    "If you need this in the clinic file, copy it there. That copy is the clinic’s record, not ElezaMD’s.",
  copyNote: "Copy note",
  copied: "Copied",
  imDone: "I’m done",
};

export const CHROME = {
  wordmark: PRODUCT_NAME,
  subtitle: SUBTITLE,
};
