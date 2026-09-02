export function previewVoice(committed: string, live: string): string {
  const base = committed.trim();
  const incoming = live.trim();
  if (!incoming) {
    return committed;
  }
  if (!base) {
    return incoming;
  }
  return `${base} ${incoming}`;
}

export function commitVoice(committed: string, live: string): string {
  return previewVoice(committed, live).trim();
}

type SpeechRecognitionCtor = new () => BrowserSpeechRecognition;

export type BrowserSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

export type BrowserSpeechRecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

export function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") {
    return null;
  }

  const withSpeech = window as Window & {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };

  return withSpeech.SpeechRecognition ?? withSpeech.webkitSpeechRecognition ?? null;
}

export function transcriptFromEvent(event: BrowserSpeechRecognitionEvent): string {
  let live = "";
  for (let i = 0; i < event.results.length; i += 1) {
    live += event.results[i][0]?.transcript ?? "";
  }
  return live;
}
