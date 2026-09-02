# ElezaMD — Waiting-Room Note
## Kazi: Kabla ya Daktari (“Before the doctor”)
### Agent-Ready Implementation Specification

**Product name:** ElezaMD  
**Name meaning:** Swahili *eleza* (explain / describe) + MD. The patient explains; the clinician decides. ElezaMD is **not** a doctor and must never be pitched as one. Do not expand “MD” as “medical diagnosis” in UI.  
**Tagline:** *Eleza. Don’t diagnose.*  
**Repository:** **New Git repository.** Do not add this product to `afyanow-telehealth-demo` (or any existing telehealth matcher). Create an empty repo and scaffold this app from scratch.  
**Suggested repo name:** `elezamd`.  
**Track:** Health — *The patient who searched his symptoms at 2am arrives handing the nurse a verdict instead of a symptom. The clinician starts from the wrong place. The build helps the patient describe, so the clinician can decide.*  
**Target stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4 — **new app via `create-next-app`, not a fork.**  
**Persistence:** No accounts and no durable patient file. Waiting-room session is in-memory on the phone. An optional share link may hold a copy in an in-memory TTL store until it expires.  
**Document purpose:** Source-of-truth implementation contract for this hackathon track. It **replaces** `AFYANOW_AI_VOICE_EPHEMERAL_SHARE_AGENT_SPEC.md` for Health judging.

This spec is what you build. The previous voice-consultation / differential / smart-referral spec is **out of scope**. Do not port that product’s encrypted Redis share. This repo’s share link is a short-lived in-memory copy only. The existing AfyaNow telehealth demo is a **different product** in a **different repo**; do not copy its intake, recommendation, matching, or clinician dashboard into this project.

**Patient-facing name:** ElezaMD. Subtitle allowed: “before the doctor” / “eleza — explain.” Do not present this demo as a clinician marketplace.

---

# 0. Executive Summary

ElezaMD is a **waiting-room note**, not a telehealth matcher and not a diagnostic assistant.

The patient messages in (or opens a phone page) in the waiting room. They describe what they feel first. Only if they looked this up online do we collect the internet verdict. One page stays **on their phone** to show the nurse. The patient may also create a **short-lived share link** for a practitioner who is not looking at that screen. ElezaMD does not diagnose, does not pick a clinician, and does not keep a patient file.

```text
Waiting room
      ↓
Open / message-style entry
      ↓
“AI is involved. We do not diagnose. No patient file.”
      ↓
Warning-sign check
      ↓
What they actually feel
      ↓
Did they look this up?
      ↓
If yes: searched → it said → fear
If no: fear
      ↓
One-page note on this phone
      ↓
Show the nurse
      ↓
Optional: share a short-lived link
      ↓
Close the tab → session gone
A share link, if created, expires on its own
```

If the nurse copies the note into the clinic file, that copy is **the clinic’s record under the clinic’s rules**, not ElezaMD’s.

**Judges will ask two things. The product must answer both:**

1. Did the clinician get a better starting point than a homemade Google verdict?
2. Did the build keep no durable patient file? (Session dies on close. A share link is opt-in, opaque, and time-limited.)

---

# 1. New repository (greenfield)

This work starts in a **new empty Git repo**. It is not a feature branch of the telehealth demo.

## 1.1 What agents must not do

- Do not open, fork, or commit to `afyanow-telehealth-demo` for this product.
- Do not import that repo’s `src/lib/intake.ts`, `safety.ts`, clinician matching, booking, or mock patient files.
- Do not add waiting-room routes beside an existing patient/clinician app.

## 1.2 Scaffold

1. Create the GitHub/Git repo (`elezamd`).
2. Scaffold Next.js 16 App Router + TypeScript + Tailwind (current `create-next-app` defaults for that version).
3. Implement **only** this spec.

After scaffold, agents MUST consult that app’s local Next.js docs:

```text
node_modules/next/dist/docs/
```

before writing routes, layouts, caching, client/server boundaries, or navigation. Do not copy stale Next.js 13/14 patterns from memory.

The judged journey is the entire app: waiting-room entry → feel → search gate → path questions → phone note.

---

# 2. Goals

## G1 — Help the patient describe, so the nurse can decide

Collect answers in this order:

1. What they **actually feel**
2. Whether they **looked this up** before coming in
3. If yes: what they **searched**, what **it said**, what they **fear it is**
4. If no: what they **fear it is** (search sections omitted)

The note presents those facts, body first. The nurse starts from symptoms and context, not from ElezaMD’s opinion.

## G2 — No diagnosis, no verdict, no list of conditions

ElezaMD must never say, imply, or list what the patient “may have.”  
Question 3 may record **the patient’s** feared label (the internet verdict). The app displays it as their words. It does not confirm, deny, rank, or add conditions.

## G3 — No durable patient file

No account, no history, no database, no Redis. Session state is in-memory on the phone. Close or reload ends that session.

The patient may opt in to a **short-lived share link**. That copy lives in an in-memory server store with a TTL (default 24 hours), keyed by an opaque code. It is not a patient file, not an account, and not durable across process restart. When the TTL elapses (or the process restarts), ElezaMD has nothing about that person from the link.

## G4 — The note lives on the patient’s phone (share is extra)

The primary artifact is the on-screen page (copy allowed). Showing the phone **is** the default handoff.

If the practitioner is not looking at the same screen, the patient may generate a short-lived `/share/[code]` link. There is no clinician portal, no login, and no ciphertext archive. The viewer is that one note until the link expires.

## G5 — Disclose AI at session open

Every session’s first screen states that AI is involved, that ElezaMD does not diagnose, and that ElezaMD does not keep a patient file. It must also say that closing the page ends the session, and that a share link (if created) lasts until it expires.

## G6 — The professional in the room

The recipient is the nurse or clinician **already receiving the patient**. Do not recommend, rank, or book a different professional. Do not swap the nurse for another role unless that person is on the team and in the room (demo: do not offer a clinician directory).

---

# 3. Non-Goals (locked)

Do **not** build in this repo:

- Diagnosis, differential, “possible causes,” likelihoods
- “AI-generated preliminary assessment”
- Care recommendation, specialty, urgency-to-book
- Smart referral / nearest facility / “Find care near me”
- Clinician matching, browsing, booking, or a clinician dashboard
- Adaptive clinical interview (an LLM asking until “ready for assessment”)
- Encrypted Redis share, durable share tables, or a clinician inbox that keeps notes
- Accounts, profiles, longitudinal history
- Permanent **server** storage of answers (a short-lived in-memory share store is allowed; see G3 / §10.1)
- Prescriptions, triage scores presented as clinical decisions
- Natural-language extraction into a medical specialty
- Passing symptoms in query strings or path segments
- Porting the telehealth demo’s intake wizard or recommendation engine

---

# 4. Hard Invariants

Non-negotiable. A build that violates any of these fails the track.

## 4.1 Clinical language (Kazi)

**K-01** Never use “you may have,” “likely,” “possible conditions,” or a list of candidate diagnoses in UI, prompts, or API output.

**K-02** The system must not produce a verdict about what is wrong or which specialty to see.

**K-03** Question 3 (fear) is patient-reported. Render it as a quote/field, not as ElezaMD’s finding.

**K-04** The only clinical interrupt allowed is **emergency stop** (seek in-person care now), without naming a disease.

**K-05** Do not present ElezaMD as a doctor, clinic, or diagnostic brand. “MD” in the name means the note is **for** the clinician, not **from** one.

## 4.2 Privacy (Kazi)

**P-01** No patient answers in a database, Redis, file, or other durable store this app controls. The only allowed server store is the in-memory TTL map used for share links (§10.1).

**P-02** No `localStorage`, `sessionStorage`, or IndexedDB for note content.

**P-03** No medical payload in URL query or path. Opaque share codes in `/share/[code]` are lookup keys, not answers.

**P-04** No accounts, cookies that identify the patient, or history of prior sessions.

**P-05** Server routes must not persist request bodies to disk or a database. Prefer **no server round-trip** for the four answers until the patient creates a share link. Then `POST /api/waiting-room/share` may hold them in the in-memory TTL store.

**P-06** Closing or reloading the tab must leave ElezaMD with nothing about that person **in the waiting-room session**. A share link the patient already created remains retrievable until it expires or the process restarts.

**P-07** Logs must not contain searched terms, fears, symptoms, or note text.

## 4.3 Handoff (Kazi)

**H-01** The note is shown on the patient’s device. A practitioner may also open a short-lived share link the patient created. Do not build a logged-in clinician workspace or inbox.

**H-02** Copy-to-clipboard is for the **patient** to paste or for the **nurse** to put in the clinic file. That paste is not ElezaMD’s record.

**H-03** “Share with practitioner” is allowed as a short-lived link (`/share/[code]`) the practitioner fetches from this app. Codes are opaque. Default TTL is 24 hours. Do not put answers in the URL. Do not use Redis or a database for this store.

## 4.4 Session open (Kazi)

**A-01** The first screen of every session states that AI is involved.

**A-02** The same screen states that this is not a diagnosis, that there is no patient file, that closing the page ends the session, and that a share link (if created) lasts until it expires.

## 4.5 Recipient (Kazi)

**R-01** Do not offer a list of clinicians or facilities as the outcome of the note.

**R-02** Do not replace the in-room nurse with a remote matched doctor in this flow.

---

# 5. Product Terminology

| Term | Meaning |
|---|---|
| **ElezaMD** | The product. Patient explains; clinician decides. |
| **Waiting-room session** | In-memory interaction. Not a durable entity. |
| **The questions** | Feel first, then a yes/no search gate. Search / it said only if they looked it up. Fear always. Do not add extra intake steps. |
| **Phone note** | Single page for the nurse. Body and fear first; search blocks only if they searched. |
| **Share link** | Opt-in, short-lived URL (`/share/[code]`). Practitioner opens the same note. In-memory TTL store. |
| **Internet verdict** | What search/AI/Dr Google told the patient (Q2/Q3). Treated as **their** story, not ours. |
| **Emergency stop** | Hard stop: in-person/emergency care now. No note-as-diagnosis. |

Do not use: Care Event, AI Assessment, Referral Recommendation, Ephemeral Care Share, possibleConditions.

---

# 6. User Journeys

## 6.1 Journey A — Main (judged)

```text
1. Patient in the waiting room opens the demo
   (message-style number screen, then chat/page).
2. First screen (cannot skip):
   - AI is involved in this session.
   - We do not diagnose. We do not tell you what you have.
   - Your answers stay on this phone. Closing this page ends the session.
   - If you create a share link, that copy lasts until it expires.
   - If the nurse copies this into the clinic file, that is the clinic’s record.
3. Optional: short emergency warning-sign check
   (chest pain, severe breathing difficulty, severe bleeding, loss of consciousness).
   If any selected → Journey C.
4. What they actually feel, then: did they look this up before coming in?
   Yes → searched → it said → fear.
   No → fear.
5. Phone note (one page). Body first. Search blocks only if they searched.
6. Patient shows the phone to the nurse.
7. Optional: Copy note, or Share with practitioner (short-lived link).
8. Patient closes the tab or taps “I’m done” → waiting-room state cleared. An existing share link expires on its own.
```

## 6.2 Journey B — Typed only

Same as A without microphone. Typing is first-class, not a fallback.

## 6.3 Journey C — Emergency stop

If a warning sign is selected, or committed text clearly reports one (if you parse at all):

```text
Stop the questions.
Do not generate a note that looks like an assessment.
Show: seek in-person or emergency care now.
Do not name a condition.
Do not recommend a specialty.
```

Implement a **local** warning-sign checklist in this repo (see §11). Do not depend on another codebase’s safety module. Do not show Priority/Routine as a clinical result. Do not recommend a type of doctor.

Copy must not say “you may have a medical emergency” in a way that mimics diagnosis. Prefer:

```text
Based on what you selected, this is not something to wait on in a queue.
Please seek in-person or emergency care now.
```

## 6.4 Journey D — Session end

```text
[I’m done] or tab close or refresh
  → in-memory waiting-room state gone
  → returning to the URL shows a new empty session, not the note
  → a share link already created remains until TTL / process restart
```

---

# 7. The Questions

Use this wording unless a clinician on the team tightens it without adding medical questions.

**Feel first — What you actually feel**  
“What do you actually feel in your body — where, since when, and what changed?”

**Search gate**  
“Did you look this up before coming in?”  
Hint: “Google, ChatGPT, or another app — about what you just described.”  
Yes / No.

**If yes — What you searched**  
“What did you type into Google, ChatGPT, or another app?”

**If yes — What it said**  
“What did it tell you? Paste or say it in your own words.”

**Always — What you fear it is**  
“What are you afraid this is?”

Do not add: who needs care, existing conditions lists, medication pickers, specialty, duration/severity as a routing engine. Duration and body feeling belong **inside the feel question as free text**.

---

# 8. Phone Note (locked structure)

One page. No extra clinical sections.

```text
ElezaMD
For the nurse
A note the patient is showing you from their phone.

AI helped collect these answers. This is not a diagnosis.
ElezaMD does not keep a patient file.
A share link, if created, expires.

What they actually feel
{feel}

What they fear it is
{fear}

What they searched
{searched — only if they looked it up}

What it said
{it said — only if they looked it up}

They did not look this up before this visit
{only if they did not search}

If you need this in the clinic file, copy it there.
That copy is the clinic’s record, not ElezaMD’s.
```

UI actions:

- **Copy note** (plain text)
- **Share with practitioner** (creates `/share/[code]`; copy link / email)
- **I’m done** (clear session, back to start)
- Do not: Find care, Book, See my result, Browse clinicians

---

# 9. Proposed app structure

This **is** the app. Suggested App Router layout after scaffold:

```text
src/app/
  page.tsx                   # message-style landing (“a number they message”)
  waiting-room/
    page.tsx                 # disclosure + questions (or step machine)
    WaitingRoomClient.tsx
  note/
    page.tsx                 # only reachable with in-memory state;
                             # if empty, redirect to landing / waiting-room
                             # MUST NOT read answers from the URL
  share/[code]/
    page.tsx                 # practitioner viewer; lookup by opaque code only
  api/waiting-room/
    share/route.ts           # POST: store answers in the in-memory TTL map
    tidy/route.ts            # optional; default unused
  layout.tsx
```

Prefer a **single client tree** (one page + steps) over two routes if that makes in-memory state simpler.

Do **not** create:

```text
src/app/api/ai/assessment/
src/app/api/share/           # use /api/waiting-room/share instead
src/app/patient/             # no telehealth patient portal
src/app/clinician/           # no clinician workspace
src/app/api/ai/interview/    # unless you add the optional formatter in §12
```

Keep the dependency set small: Next, React, TypeScript, Tailwind. No DB client.

---

# 10. In-Memory Session Model

No persistence.

```ts
export type WaitingRoomStatus =
  | "disclosure"
  | "emergency_check"
  | "asking"
  | "search_gate"
  | "note"
  | "emergency_stop"
  | "ended";

export type QuestionId = "searched" | "itSaid" | "fear" | "feel";

export type WaitingRoomSession = {
  startedAt: string;
  status: WaitingRoomStatus;
  currentQuestion: QuestionId | null;
  answers: {
    searched: string;
    itSaid: string;
    fear: string;
    feel: string;
  };
  didSearch: boolean | null;
  emergencyStop: boolean;
};
```

Empty strings mean not yet answered. Do not invent defaults.

React Context + `useState` / reducer is enough. Do not add a global state library.

**Navigation:** keep the wizard and the note under one client tree so React state is not lost between “questions” and “note.” If you use two routes, lift state to a shared client layout **without** writing to `localStorage`. If the note route is opened cold (no memory), show empty session — never recover from the URL.

## 10.1 Share store

In-memory only, pinned on `globalThis` so App Router chunks share one map.

```ts
createSharedNote({ answers, didSearch }) → { code, expiresAt }
getSharedNote(code) → { answers, didSearch, expiresAt } | null
```

- Opaque codes (no answers in the URL).
- Default TTL 24 hours (`SHARE_LINK_TTL_MS`).
- Unknown or expired codes render “no longer available,” not an empty note.
- Restart / new serverless instance clears the map. That is acceptable for this build.
- Do not log note content.

---

# 11. Safety (this repo only)

Only the **emergency warning-sign stop** is in scope. Implement it here; do not import another project’s triage engine.

## 11.1 Checklist (preferred)

Before the body question, one screen:

```text
Is any of this happening right now?
These are warning signs. If one is happening, do not wait in the queue.
- Chest pain or pressure
- Difficulty breathing
- Severe bleeding
- Fainting or loss of consciousness
- None of these
```

Any except “none” → emergency stop.

Keep the rule inspectable: a short function, e.g. `shouldEmergencyStop(selectedIds: string[]): boolean`. No Priority/Routine output. No specialty.

## 11.2 LLM must not own emergency

If optional STT/LLM is present, it cannot downgrade an explicit checklist Emergency. It cannot be the only gate.

---

# 12. Voice and AI (optional, constrained)

Neither is required to win the track. Four typed questions + a note is enough.

### 12.1 Voice (optional)

If implemented:

- Push-to-talk
- Live transcript; **only committed text** fills the current question
- No audio blobs kept after commit
- Mic denial → type
- Disclose AI at start **even if** voice is the only model (STT is AI)

Do not save audio to disk. Prefer browser speech APIs for the hackathon to avoid vendor keys, persistence, and extra services. If a cloud STT is used: token endpoint only, no recording storage, no transcript logs.

### 12.2 LLM (optional — default is OFF)

Default: **do not call an LLM.** Render the patient’s words on the note.

If the team insists on “AI helped describe”:

Allowed:

- Correct obvious speech-to-text errors in **the current answer only**
- Break the feel answer into readable sentences **without adding facts**

Forbidden:

- Possible conditions, differentials, likelihoods
- Specialty or facility recommendations
- Inferring symptoms they did not state
- Filling empty questions
- “You may have…”
- Summaries that replace the patient’s answers with a clinical impression

If an API exists:

```text
POST /api/waiting-room/tidy
```

Input: `{ questionId, text }`  
Output: `{ text }` (same meaning, no new medical claims)

Reject responses that contain condition lists (maintain a deny-list test: `diagnos`, `you may have`, `likely`, `consistent with`).

API keys must never ship to the browser.

**Hackathon recommendation:** ship without this endpoint.

---

# 13. Entry: “A number they message”

The track’s stated shape is a number in the waiting room.

MVP that judges can operate:

1. Landing card: a demo number (e.g. WhatsApp-style) and “Message to start”
2. Tapping it opens the disclosure + waiting-room flow (web chat UI is fine)

Do not require a real SMS gateway. A simulated thread is enough if the **questions and note** are real.

---

# 14. UI/UX

## 14.1 Disclosure (first screen)

Persistent or first-screen copy, all of:

```text
ElezaMD
AI is involved in this session.

This is not a diagnosis. We will not tell you what you have.
Eleza means explain — you describe, the clinician decides.

Your answers stay on this phone for you to show the nurse.
When you close this page, this session is gone.
If you create a share link, that copy lasts until it expires.

If the nurse copies the note into the clinic file,
that becomes the clinic’s record, not ours.
```

Primary action: **Continue**  
Do not hide this behind a footer link.

## 14.2 Question screens

- One question visible
- Back (clears nothing already typed unless they edit)
- Continue disabled until non-empty trim
- Progress: current of path length (4 if they searched, 2 if they did not)
- Optional mic on each question

## 14.3 Note screen

- Title: ElezaMD — for the nurse, patient-held
- Labeled blocks: feel, fear, then search / it said if they looked it up
- Badge: `AI-assisted • Not a diagnosis • No patient file`
- Copy note
- Share with practitioner (creates a short-lived link; copy / email)
- I’m done

Do not style it like a lab result or “assessment report.” It should look like **the patient’s words**, not a clinical conclusion.

## 14.4 Chrome

Phone-first, quiet UI. Wordmark: **ElezaMD**. No “switch to clinician demo,” no marketplace header, no browse-clinicians CTA.

---

# 15. Copy rules (automated tests)

Forbidden in waiting-room UI strings and any tidy-API output:

```text
you may have
you likely
possible condition
differential
diagnosis          (except “not a diagnosis”)
recommended specialty
see a clinician today
migraine / pneumonia / … as system-attributed findings
medical diagnosis    (as an expansion of MD)
```

Allowed:

```text
not a diagnosis
what they fear it is
what they actually feel
AI is involved
we keep nothing
no patient file
eleza / explain
```

Q3 may contain words like “cancer” **typed by the patient**. Tests should flag **system** copy and **model** output, not the patient’s textarea value.

---

# 16. Feature flags

```ts
export const FEATURES = {
  VOICE: process.env.NEXT_PUBLIC_FEATURE_VOICE === "true",
  TIDY: process.env.NEXT_PUBLIC_FEATURE_TIDY === "true",
  SHARE_LINK: process.env.NEXT_PUBLIC_FEATURE_SHARE_LINK !== "false",
};
```

Default: voice off, tidy off, share-link **on**. The note flow is the whole product (always on). Share is part of the note screen; set `NEXT_PUBLIC_FEATURE_SHARE_LINK=false` only to hide it.

---

# 17. Testing

Required before calling the demo done:

1. Completing the yes path (feel → searched → it said → fear) shows those answers on the note, unmodified (if tidy off). Completing the no path omits search blocks.
2. Refresh on the note (or home) does not restore answers.
3. I’m done returns to disclosure with empty fields.
4. Emergency checklist interrupts; no condition named.
5. No `localStorage.setItem` / `sessionStorage` / IndexedDB for note content.
6. Routes do not parse medical content from `searchParams`.
7. UI strings contain “AI” / “AI is involved” on the first step.
8. UI strings do not contain “you may have.”
9. The app has no clinician directory, booking, or “recommended specialty” screen.
10. Copy note puts the note sections in the clipboard.
11. Share with practitioner creates an opaque `/share/[code]` URL; the viewer shows the same note; unknown/expired codes show unavailable.
12. Share does not put answers in the URL.

If tidy API exists: reject payloads that add a conditions array or “you may have.”

---

# 18. Definition of done

## Patient

- [ ] Sees AI disclosure before any question
- [ ] Describes what they feel before being asked about search
- [ ] Is asked whether they looked this up; search questions only if yes
- [ ] Gets one page to show the nurse
- [ ] Can copy the note
- [ ] Can share a short-lived link with a practitioner
- [ ] Can type without voice
- [ ] Emergency path stops the flow without a diagnostic note

## Nurse (demo)

- [ ] Can read feel and fear first, then search vs internet if they looked it up
- [ ] Does not receive a condition list or specialty from ElezaMD
- [ ] Understands the note is on the patient’s phone, or from a short-lived share link the patient created

## Privacy

- [ ] No DB, no Redis, no durable share table
- [ ] No localStorage of answers
- [ ] No answers in the URL (opaque share codes only)
- [ ] Reload/close clears the waiting-room session
- [ ] Share store is in-memory with a TTL; expired codes are gone

## Engineering

- [ ] Lives in the **new** `elezamd` repo, not the telehealth demo
- [ ] `npm run lint` and `npm run build` pass
- [ ] Tests in §17 pass
- [ ] Next.js APIs checked against that app’s local docs

---

# 19. Demo script (judges)

**Setup:** Phone or narrow browser. This is the only product you demo for this track.

**One-liner:** ElezaMD — *eleza* means explain. The patient explains; the MD decides. No patient file.

**Patient (2am story):**

> Searched: “headache nausea light hurts”  
> It said: “could be migraine or something serious”  
> Fear: “a brain tumour”  
> Feel: “pain behind my eyes since yesterday, worse in light, no fever, I slept badly”

**Show the nurse the note.** Point out four boxes: search, internet, fear, body. Say: we did not tell them what they have; there is no patient file; if you copy this into the clinic file, that’s yours. Optionally create a share link and open it on another device.

**Then:** refresh the patient’s tab. The waiting-room note is gone. The share link still works until it expires.

**Emergency (optional):** select chest pain → stop screen, no assessment.

Do not show: another repo’s telehealth matcher, possible migraine likelihood, GP recommendation, nearby clinics.

---

# 20. Agent execution (small team)

Work only in the new `elezamd` repo.

### Agent A — App shell + waiting-room flow + note

Scaffold, session state, disclosure, body-first questions with search gate, note, copy, share link, I’m done, emergency checklist UI. Wordmark ElezaMD.

### Agent B — Tests + copy audit

Forbidden-phrase tests, no-durable-storage checks, share TTL unit tests, emergency-stop unit tests.

### Agent C (optional) — Voice

Push-to-talk into the current question only. No LLM.

**Do not** implement share crypto, Redis, LLM assessment, referral ranking, interview APIs, or anything from the telehealth demo.

Merge order: A → B → C.

---

# 21. Mapping from the previous (rejected) spec

Those ideas were for a different product. Do not re-open them in this repo.

| Previous spec | This spec |
|---|---|
| Build in the telehealth demo repo | **New repo (`elezamd`)** |
| Voice consultation | Optional mic on each question |
| Claude adaptive interview | Deleted |
| Preliminary AI assessment / possibleConditions | Deleted |
| Smart referral | Deleted |
| Ephemeral encrypted share + doctor viewer | Replaced: short-lived opaque `/share/[code]`, in-memory TTL, no Redis/encryption. Show the phone remains the primary handoff. |
| In-memory session | Kept |
| No durable medical DB | Kept; share store is in-memory TTL only |
| AI disclosure | Kept; first screen, mandatory |
| Multi-tier safety + specialty routing | Emergency **stop** only, implemented here |
| “AI assessment, not confirmed diagnosis” | Replaced: **no assessment at all** |

---

# 22. Architectural summary

```text
NEW REPO (elezamd)
        │
        ▼
PATIENT PHONE (waiting room)
        │
        ▼
 Disclosure: AI involved, no diagnosis, no patient file
        │
        ▼
 Emergency checklist ──yes──► Stop. Seek in-person care.
        │ no
        ▼
 Feel → Did you look this up?
        │
        ├── yes → searched → it said → fear
        └── no  → fear
        │
        ▼
 One-page ElezaMD note (session in memory)
        │
        ├── show nurse
        ├── copy → clinic file (clinic’s record)
        └── optional share → /share/[code] (in-memory TTL)
        │
        ▼
 Close / I’m done / refresh
        │
        ▼
 Waiting-room session gone
 Share link, if created, expires on its own
```

**Desired product:**

> The patient puts down the internet verdict and picks up a description. The nurse starts from what they feel. ElezaMD does not keep a patient file.

---

# 23. Orchestrator prompt

> Create a **new** Git repository named `elezamd`. Do **not** implement this in `afyanow-telehealth-demo` or any existing telehealth codebase. Scaffold a new Next.js 16 App Router + TypeScript + Tailwind app. Then implement the ElezaMD Waiting-Room Note spec (`SPEC.md`). Inspect the new app’s `node_modules/next/dist/docs/` before writing Next.js APIs. Product name is ElezaMD (eleza = explain; the patient explains, the clinician decides — the app is not a doctor). Build: landing (message-style number) → disclosure → optional emergency checklist → what they feel → did they look this up → search questions only if yes → fear → one-page phone note → copy / optional share with practitioner / I’m done. Keep waiting-room session state in memory only. Share links use an opaque `/share/[code]` and an in-memory TTL store (default 24h). No localStorage, no answers in the URL, no database, no Redis, no differentials, no specialty recommendation, no clinician matching. Do not create `/api/ai/assessment`. Use `/api/waiting-room/share` for share, not `/api/share`. Do not port files from the telehealth demo. Default off: LLM tidy and cloud STT. Share-link default on. Every session must open by saying AI is involved. Add the tests listed in the spec.
