"use client";

import { useState } from "react";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
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
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
        {NOTE.forTheNurse}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
        {NOTE.title}
      </h1>
      <p className="mt-1 text-sm text-muted">{NOTE.intro}</p>
      <Chip className="mt-3 self-start" size="sm">
        {NOTE.badge}
      </Chip>
      <p className="mt-4 text-sm leading-6 text-muted">
        {NOTE.aiHelped} {NOTE.keepNothing}
      </p>

      <section className="mt-5 space-y-4">
        <NoteBlock label={NOTE.feelLabel} text={answers.feel} />
        <NoteBlock label={NOTE.fearLabel} quoted text={answers.fear} />
        {didSearch ? (
          <>
            <NoteBlock label={NOTE.searchedLabel} text={answers.searched} />
            <NoteBlock label={NOTE.itSaidLabel} text={answers.itSaid} />
          </>
        ) : (
          <Card>
            <Card.Content>
              <p className="text-sm leading-6 text-foreground">
                {NOTE.didNotSearch}
              </p>
            </Card.Content>
          </Card>
        )}
      </section>

      <p className="mt-5 text-xs leading-5 text-muted">{NOTE.clinicHint}</p>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <Button
          className="cta-focus"
          fullWidth
          size="lg"
          onPress={() => {
            void copyNote();
          }}
        >
          {copied ? NOTE.copied : NOTE.copyNote}
        </Button>
        <Button fullWidth size="lg" variant="tertiary" onPress={onDone}>
          {NOTE.imDone}
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
    <Card>
      <Card.Header>
        <Card.Title className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {label}
        </Card.Title>
      </Card.Header>
      {text ? (
        <Card.Content>
          <p className="whitespace-pre-wrap text-sm leading-6 text-foreground">
            {quoted ? `“${text}”` : text}
          </p>
        </Card.Content>
      ) : null}
    </Card>
  );
}
