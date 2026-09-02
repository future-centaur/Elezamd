import { AppStage } from "@/components/AppStage";
import { NOTE, SHARE_VIEWER } from "@/lib/copy";
import { getSharedNote } from "@/lib/share";
import { CopyNoteButton } from "./CopyNoteButton";

export const dynamic = "force-dynamic";

export default async function SharedNotePage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const shared = getSharedNote(code);

  return (
    <AppStage variant="flow">
      {shared ? (
        <div className="flex flex-1 flex-col">
          <p className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            {SHARE_VIEWER.eyebrow}
          </p>
          <p className="mt-2 max-w-xl text-base text-muted">
            {SHARE_VIEWER.intro}
          </p>

          <article className="note-sheet mt-8 max-w-xl px-5 py-6 sm:px-7 sm:py-8">
            <div className="space-y-5">
              <NoteBlock label={NOTE.feelLabel} text={shared.answers.feel} />
              <NoteBlock
                label={NOTE.fearLabel}
                text={shared.answers.fear}
                quoted
              />
              {shared.didSearch ? (
                <>
                  <NoteBlock
                    label={NOTE.searchedLabel}
                    text={shared.answers.searched}
                  />
                  <NoteBlock
                    label={NOTE.itSaidLabel}
                    text={shared.answers.itSaid}
                  />
                </>
              ) : (
                <p className="text-base leading-7">{NOTE.didNotSearch}</p>
              )}
            </div>
          </article>

          <p className="mt-5 max-w-xl text-xs leading-5 text-muted">
            {NOTE.clinicHint}
          </p>

          <div className="screen-actions">
            <span />
            <CopyNoteButton
              answers={shared.answers}
              didSearch={shared.didSearch}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
            {SHARE_VIEWER.notFoundTitle}
          </h1>
          <p className="mt-2 text-sm text-muted">{SHARE_VIEWER.notFoundBody}</p>
        </div>
      )}
    </AppStage>
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
  if (!text) {
    return null;
  }

  return (
    <section>
      <h2 className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
        {label}
      </h2>
      <p className="mt-1 whitespace-pre-wrap text-base leading-7">
        {quoted ? `“${text}”` : text}
      </p>
    </section>
  );
}
