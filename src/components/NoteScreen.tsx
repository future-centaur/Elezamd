"use client";

import { useState } from "react";
import { Button } from "@heroui/react/button";
import { Chip } from "@heroui/react/chip";
import { NOTE, SHARE } from "@/lib/copy";
import { copyText } from "@/lib/clipboard";
import { formatNote } from "@/lib/format-note";
import { FEATURES } from "@/lib/features";
import type { WaitingRoomAnswers } from "@/lib/session";

type NoteScreenProps = {
  answers: WaitingRoomAnswers;
  didSearch: boolean;
  onDone: () => void;
};

type ShareState =
  | { status: "idle" }
  | { status: "sending" }
  | { status: "ready"; url: string; code: string }
  | { status: "error" };

export function NoteScreen({ answers, didSearch, onDone }: NoteScreenProps) {
  const [copied, setCopied] = useState(false);
  const [share, setShare] = useState<ShareState>({ status: "idle" });
  const [linkCopied, setLinkCopied] = useState(false);

  async function copyNote() {
    await copyText(formatNote(answers, didSearch));
    setCopied(true);
  }

  async function createShareLink() {
    setShare({ status: "sending" });
    try {
      const response = await fetch("/api/waiting-room/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, didSearch }),
      });
      if (!response.ok) {
        setShare({ status: "error" });
        return;
      }
      const data: unknown = await response.json();
      if (
        data &&
        typeof data === "object" &&
        "code" in data &&
        typeof data.code === "string"
      ) {
        const url = `${window.location.origin}/share/${data.code}`;
        setShare({ status: "ready", url, code: data.code });
      } else {
        setShare({ status: "error" });
      }
    } catch {
      setShare({ status: "error" });
    }
  }

  async function copyLink(url: string) {
    await copyText(url);
    setLinkCopied(true);
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

      {FEATURES.SHARE_LINK ? (
        <div className="note-sheet mt-5 max-w-xl px-5 py-5">
          {share.status === "ready" ? (
            <>
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                {SHARE.createdTitle}
              </p>
              <p className="mt-2 font-mono text-sm text-foreground">
                {share.url}
              </p>
              <p className="mt-2 text-xs text-muted">{SHARE.expiresHint}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onPress={() => {
                    void copyLink(share.url);
                  }}
                >
                  {linkCopied ? SHARE.copied : SHARE.copyLink}
                </Button>
                <a
                  className="button button--secondary button--sm"
                  href={`mailto:?subject=${encodeURIComponent(
                    SHARE.emailSubject,
                  )}&body=${encodeURIComponent(SHARE.emailBody(share.url))}`}
                >
                  {SHARE.emailButton}
                </a>
              </div>
            </>
          ) : (
            <Button
              isDisabled={share.status === "sending"}
              size="lg"
              variant="secondary"
              onPress={() => {
                void createShareLink();
              }}
            >
              {share.status === "sending" ? SHARE.sending : SHARE.buttonLabel}
            </Button>
          )}
          {share.status === "error" ? (
            <p className="mt-2 text-xs text-danger">{SHARE.failed}</p>
          ) : null}
        </div>
      ) : null}

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
