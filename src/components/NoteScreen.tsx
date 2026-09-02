"use client";

import { useState } from "react";
import { Button } from "@heroui/react/button";
import { Chip } from "@heroui/react/chip";
import { NOTE } from "@/lib/copy";
import { copyText } from "@/lib/clipboard";
import { formatNote } from "@/lib/format-note";
import type { WaitingRoomAnswers } from "@/lib/session";

type NoteScreenProps = {
  answers: WaitingRoomAnswers;
  didSearch: boolean;
  onDone: () => void;
};

export function NoteScreen({ answers, didSearch, onDone }: NoteScreenProps) {
  const [copied, setCopied] = useState(false);

  async function copyNote() {
    await copyText(formatNote(answers, didSearch));
    setCopied(true);
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {NOTE.forTheNurse}
      </p>
      <h1 className="mt-2 text-lg font-bold tracking-tight text-foreground">
        {NOTE.title}
      </h1>
      <p className="mt-2 max-w-xl text-base text-muted">{NOTE.intro}</p>

      <article className="note-sheet mt-8 max-w-xl px-5 py-6 sm:px-7 sm:py-8">
        <Chip size="sm">{NOTE.badge}</Chip>
        <p className="mt-4 text-sm leading-6 text-muted">
          {NOTE.aiHelped} {NOTE.keepNothing}
        </p>

        <div className="mt-6 space-y-5">
          <NoteBlock label={NOTE.feelLabel} text={answers.feel} />
          <NoteBlock label={NOTE.fearLabel} quoted text={answers.fear} />
          {didSearch ? (
            <>
              <NoteBlock label={NOTE.searchedLabel} text={answers.searched} />
              <NoteBlock label={NOTE.itSaidLabel} text={answers.itSaid} />
            </>
          ) : (
            <p className="text-base leading-7">{NOTE.didNotSearch}</p>
          )}
        </div>
      </article>

      <p className="mt-5 max-w-xl text-xs leading-5 text-muted">{NOTE.clinicHint}</p>

      <div className="screen-actions">
        <Button size="lg" variant="ghost" onPress={onDone}>
          {NOTE.imDone}
        </Button>
        <Button
          className="cta-focus"
          size="lg"
          onPress={() => {
            void copyNote();
          }}
        >
          {copied ? NOTE.copied : NOTE.copyNote}
        </Button>
      </div>
    </div>
  );
}

function NoteBlock({
  label,
  text,
  quoted = false,
}: {
  label: string;
  text: string;
  quoted?: boolean;
}) {
  return (
    <section>
      <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </h2>
      {text ? (
        <p className="mt-1 whitespace-pre-wrap text-base leading-7">
          {quoted ? `“${text}”` : text}
        </p>
      ) : null}
    </section>
  );
}
