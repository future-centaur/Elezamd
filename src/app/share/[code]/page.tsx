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
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
            {SHARE_VIEWER.eyebrow}
          </p>
          <p className="mt-1 text-sm text-muted">{SHARE_VIEWER.intro}</p>

          <section className="mt-5 space-y-4">
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
                <NoteBlock label={NOTE.itSaidLabel} text={shared.answers.itSaid} />
              </>
            ) : (
              <div className="rounded-2xl border border-border bg-surface px-4 py-3">
                <p className="text-sm leading-6 text-foreground">
                  {NOTE.didNotSearch}
                </p>
              </div>
            )}
          </section>

          <p className="mt-5 text-xs leading-5 text-muted">
            {NOTE.clinicHint}
          </p>

          <div className="mt-auto pt-6">
            <CopyNoteButton
              answers={shared.answers}
              didSearch={shared.didSearch}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
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
    <div className="rounded-2xl border border-border bg-surface px-4 py-3">
      <h2 className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
        {label}
      </h2>
      <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-foreground">
        {quoted ? `“${text}”` : text}
      </p>
    </div>
  );
}
