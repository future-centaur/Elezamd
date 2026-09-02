"use client";

import { useEffect, useRef, useState } from "react";
import { QUESTION_UI, QUESTIONS } from "@/lib/copy";
import { FEATURES } from "@/lib/features";
import { questionProgress, type QuestionId } from "@/lib/session";
import {
  commitVoice,
  getSpeechRecognitionCtor,
  previewVoice,
  transcriptFromEvent,
  type BrowserSpeechRecognition,
} from "@/lib/voice";

type QuestionScreenProps = {
  questionId: QuestionId;
  didSearch: boolean | null;
  value: string;
  tidying?: boolean;
  onChange: (text: string) => void;
  onBack: () => void;
  onContinue: () => void | Promise<void>;
};

export function QuestionScreen({
  questionId,
  didSearch,
  value,
  tidying = false,
  onChange,
  onBack,
  onContinue,
}: QuestionScreenProps) {
  const question = QUESTIONS[questionId];
  const progress = questionProgress(questionId, didSearch);
  const canContinue = value.trim().length > 0 && !tidying;
  const [speechAvailable, setSpeechAvailable] = useState(FEATURES.VOICE);
  const [listening, setListening] = useState(false);
  const [micDenied, setMicDenied] = useState(false);
  const anchorRef = useRef("");
  const liveRef = useRef("");
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  function stopListening() {
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    onChange(commitVoice(anchorRef.current, liveRef.current));
    liveRef.current = "";
    setListening(false);
  }

  function startListening() {
    if (tidying) {
      return;
    }

    const SpeechRecognition = getSpeechRecognitionCtor();
    if (!SpeechRecognition) {
      setSpeechAvailable(false);
      return;
    }

    anchorRef.current = value;
    liveRef.current = "";

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const live = transcriptFromEvent(event);
      liveRef.current = live;
      onChange(previewVoice(anchorRef.current, live));
    };
    recognition.onerror = (event) => {
      if (event.error === "not-allowed") {
        setMicDenied(true);
      }
      onChange(anchorRef.current);
      liveRef.current = "";
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
      recognitionRef.current = recognition;
      setListening(true);
    } catch {
      setSpeechAvailable(false);
    }
  }

  const showMic = FEATURES.VOICE && speechAvailable && !micDenied;

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
        {QUESTION_UI.progress(progress.current, progress.total)}
      </p>
      <h1 className="mt-2 text-xl font-semibold tracking-tight text-stone-900">
        {question.title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-stone-700">{question.prompt}</p>
      <label className="mt-5 flex flex-1 flex-col">
        <span className="sr-only">{QUESTION_UI.answerLabel}</span>
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={tidying}
          className="min-h-36 flex-1 resize-none rounded-2xl border border-stone-200 bg-white px-3 py-3 text-sm leading-6 text-stone-900 outline-none focus:border-teal-700 disabled:bg-stone-50"
        />
      </label>
      {showMic ? (
        <button
          type="button"
          disabled={tidying}
          onPointerDown={(event) => {
            event.preventDefault();
            startListening();
          }}
          onPointerUp={stopListening}
          onPointerCancel={stopListening}
          onPointerLeave={() => {
            if (listening) {
              stopListening();
            }
          }}
          className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-stone-300 text-sm font-medium text-stone-800 disabled:opacity-50"
        >
          {listening ? QUESTION_UI.listening : QUESTION_UI.holdToTalk}
        </button>
      ) : null}
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={tidying}
          className="flex h-12 flex-1 items-center justify-center rounded-full border border-stone-300 text-sm font-medium text-stone-800 disabled:opacity-50"
        >
          {QUESTION_UI.back}
        </button>
        <button
          type="button"
          disabled={!canContinue}
          onClick={onContinue}
          className="flex h-12 flex-1 items-center justify-center rounded-full bg-teal-800 text-sm font-medium text-white enabled:hover:bg-teal-900 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {tidying ? QUESTION_UI.tidying : QUESTION_UI.continue}
        </button>
      </div>
    </div>
  );
}
