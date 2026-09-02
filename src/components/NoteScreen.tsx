"use client";

import { useState } from "react";
import { Button } from "@heroui/react/button";
import { Card } from "@heroui/react/card";
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

      {FEATURES.SHARE_LINK ? (
        <div className="mt-5">
          {share.status === "ready" ? (
            <Card>
              <Card.Content>
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
                  {SHARE.createdTitle}
                </p>
                <p className="mt-2 font-mono text-sm text-foreground">
                  {share.url}
                </p>
                <p className="mt-2 text-xs text-muted">{SHARE.expiresHint}</p>
                <div className="mt-3 flex gap-2">
                  <Button
                    fullWidth
                    size="sm"
                    variant="secondary"
                    onPress={() => {
                      void copyLink(share.url);
                    }}
                  >
                    {linkCopied ? SHARE.copied : SHARE.copyLink}
                  </Button>
                  <a
                    className="button button--secondary button--sm button--full-width"
                    href={`mailto:?subject=${encodeURIComponent(
                      SHARE.emailSubject,
                    )}&body=${encodeURIComponent(SHARE.emailBody(share.url))}`}
                  >
                    {SHARE.emailButton}
                  </a>
                </div>
              </Card.Content>
            </Card>
          ) : (
            <Button
              fullWidth
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
