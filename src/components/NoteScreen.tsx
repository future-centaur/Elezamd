import { useState } from "react";
import { NOTE } from "@/lib/copy";
import { copyText } from "@/lib/clipboard";
import { formatNote } from "@/lib/format-note";
import type { WaitingRoomAnswers } from "@/lib/session";

type NoteScreenProps = {
  answers: WaitingRoomAnswers;
  onDone: () => void;
};

export function NoteScreen({ answers, onDone }: NoteScreenProps) {
  const [copied, setCopied] = useState(false);

  async function copyNote() {
    await copyText(formatNote(answers));
    setCopied(true);
  }

  return (
    <div className="flex flex-1 flex-col">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
        {NOTE.forTheNurse}
      </p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-900">
        {NOTE.title}
      </h1>
      <p className="mt-1 text-sm text-stone-600">{NOTE.intro}</p>
      <p className="mt-3 inline-flex self-start rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700">
        {NOTE.badge}
      </p>
      <p className="mt-4 text-sm leading-6 text-stone-600">
        {NOTE.aiHelped} {NOTE.keepNothing}
      </p>

      <section className="mt-5 space-y-4">
        <NoteBlock label={NOTE.searchedLabel} text={answers.searched} />
        <NoteBlock label={NOTE.itSaidLabel} text={answers.itSaid} />
        <NoteBlock
          label={NOTE.fearLabel}
          text={answers.fear}
          quoted
        />
        <NoteBlock label={NOTE.feelLabel} text={answers.feel} />
      </section>

      <p className="mt-5 text-xs leading-5 text-stone-500">{NOTE.clinicHint}</p>

      <div className="mt-auto flex flex-col gap-3 pt-6">
        <button
          type="button"
          onClick={copyNote}
          className="flex h-12 w-full items-center justify-center rounded-full border border-stone-300 text-sm font-medium text-stone-800"
        >
          {copied ? NOTE.copied : NOTE.copyNote}
        </button>
        <button
          type="button"
          onClick={onDone}
          className="flex h-12 w-full items-center justify-center rounded-full bg-teal-800 text-sm font-medium text-white hover:bg-teal-900"
        >
          {NOTE.imDone}
        </button>
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
    <div className="rounded-2xl border border-stone-200 bg-white px-4 py-3">
      <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500">
        {label}
      </h2>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-stone-900">
        {quoted ? `“${text}”` : text}
      </p>
    </div>
  );
}
