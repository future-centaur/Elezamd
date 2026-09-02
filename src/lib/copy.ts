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
  keepNothing: "When you close this page, this session is gone.",
  shareHint:
    "If you create a share link, that copy lasts until it expires.",
  clinicRecord:
    "If the nurse copies the note into the clinic file, that becomes the clinic’s record, not ours.",
  continue: "Continue",
};

export const EMERGENCY_CHECK = {
  title: "Is any of this happening right now?",
  hint: "These are warning signs. If one is happening, do not wait in the queue.",
  none: "None of these",
  continue: "Continue",
  back: "Back",
};

export const EMERGENCY_STOP = {
  title: "Please seek care now",
  body: "Based on what you selected, this is not something to wait on in a queue. Please seek in-person or emergency care now.",
  done: "I’m done",
};

export const SEARCH_GATE = {
  title: "Did you look this up before coming in?",
  hint: "Google, ChatGPT, or another app — about what you just described.",
  yes: "Yes",
  no: "No",
  back: "Back",
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
      "What do you actually feel in your body — where, since when, and what changed?",
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
  badge: "AI-assisted • Not a diagnosis • No patient file",
  aiHelped:
    "AI helped collect these answers. This is not a diagnosis.",
  keepNothing:
    "ElezaMD does not keep a patient file. A share link, if created, expires.",
  searchedLabel: "What they searched",
  itSaidLabel: "What it said",
  fearLabel: "What they fear it is",
  feelLabel: "What they actually feel",
  didNotSearch: "They did not look this up before this visit",
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

export const SHARE = {
  buttonLabel: "Share with practitioner",
  sending: "Creating link…",
  failed: "Could not create a link. Try again.",
  createdTitle: "Share this with the practitioner",
  codeLabel: "Code",
  linkLabel: "Link",
  copyLink: "Copy link",
  copied: "Copied",
  emailButton: "Email this link",
  emailSubject: "ElezaMD note",
  emailBody: (url: string) =>
    `Here is a link to the patient's ElezaMD note: ${url}`,
  expiresHint: "This link expires in 24 hours.",
  close: "Close",
};

export const SHARE_VIEWER = {
  title: PRODUCT_NAME,
  eyebrow: "Shared note",
  intro: "A patient shared this note with you from ElezaMD.",
  notFoundTitle: "This note is no longer available",
  notFoundBody:
    "The link may have expired, or it was never created. Ask the patient to share it again.",
};
