"use client";

import { useState } from "react";
import { Button } from "@heroui/react/button";
import { NOTE } from "@/lib/copy";
import { copyText } from "@/lib/clipboard";
import { formatNote } from "@/lib/format-note";
import type { WaitingRoomAnswers } from "@/lib/session";

export function CopyNoteButton({
  answers,
  didSearch,
}: {
  answers: WaitingRoomAnswers;
  didSearch: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copyNote() {
    await copyText(formatNote(answers, didSearch));
    setCopied(true);
  }

  return (
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
  );
}
