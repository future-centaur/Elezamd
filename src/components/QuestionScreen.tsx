"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@heroui/react/button";
import { TextArea } from "@heroui/react/textarea";
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
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        {QUESTION_UI.progress(progress.current, progress.total)}
      </p>
      <h1 className="font-display mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {question.title}
      </h1>
      <p className="mt-4 max-w-xl text-base leading-7 text-muted">{question.prompt}</p>
      <label className="mt-8 flex max-w-xl flex-col">
        <span className="sr-only">{QUESTION_UI.answerLabel}</span>
        <TextArea
          aria-label={QUESTION_UI.answerLabel}
          className="min-h-32"
          disabled={tidying}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      {showMic ? (
        <Button
          className="mt-4 self-start"
          isDisabled={tidying}
          size="lg"
          variant="secondary"
          onPointerCancel={stopListening}
          onPointerDown={(event) => {
            event.preventDefault();
            startListening();
          }}
          onPointerLeave={() => {
            if (listening) {
              stopListening();
            }
          }}
          onPointerUp={stopListening}
        >
          {listening ? QUESTION_UI.listening : QUESTION_UI.holdToTalk}
        </Button>
      ) : null}
      <div className="screen-actions">
        <Button isDisabled={tidying} size="lg" variant="ghost" onPress={onBack}>
          {QUESTION_UI.back}
        </Button>
        <Button
          className={canContinue ? "cta-focus" : undefined}
          isDisabled={!canContinue}
          size="lg"
          onPress={() => {
            void onContinue();
          }}
        >
          <span className={tidying ? "tidying-label" : undefined}>
            {tidying ? QUESTION_UI.tidying : QUESTION_UI.continue}
          </span>
        </Button>
      </div>
    </div>
  );
}
