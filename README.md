# ElezaMD

**Eleza. Don’t diagnose.**

*Eleza* is Swahili for explain. ElezaMD is a **waiting-room note**: the patient explains, the clinician decides. It is not a doctor, not a diagnostic assistant, and not a telehealth matcher.

The patient who searched symptoms at 2am arrives handing the nurse a verdict instead of a symptom. The clinician starts from the wrong place. ElezaMD helps the patient describe, so the clinician can decide.

## What it does

A patient in the waiting room opens a number-style page, answers four questions, and shows one page on their phone to the nurse:

1. What they **searched**
2. What **it said**
3. What they **fear it is**
4. What they **actually feel**

Close the tab and ElezaMD has nothing. If the nurse copies the note into the clinic file, that copy is the clinic’s record — not ours.

## What it will not do

- Diagnose, list conditions, or say “you may have…”
- Match, rank, or book a clinician
- Store answers (no database, no `localStorage`, no share links, no URL payloads)
- Present itself as a doctor or clinic

Every session opens by saying AI is involved, this is not a diagnosis, and we keep nothing.

## Stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4. Session state is in-memory only.

The app is not scaffolded yet. Implementation follows [`SPEC.md`](./SPEC.md).

## Spec

[`SPEC.md`](./SPEC.md) is the source-of-truth implementation contract. Build only what it describes.

## License

Private hackathon project.
