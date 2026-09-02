import type { WaitingRoomAnswers } from "./session";

const CODE_ALPHABET = "23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ";
const CODE_LENGTH = 10;

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1000;
const TTL_MS = (() => {
  const parsed = Number(process.env.SHARE_LINK_TTL_MS);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_MS;
})();

export type SharedNoteData = {
  answers: WaitingRoomAnswers;
  didSearch: boolean;
};

type StoredNote = SharedNoteData & {
  createdAt: number;
  expiresAt: number;
};

// In-memory only: this store lives in the process' heap, so a restart, a
// redeploy, or a serverless cold start on a second instance loses every
// shared note. That is a deliberate trade-off for a prototype branch, not a
// production-ready store — swap this module for a real datastore (with the
// same TTL/one-time-code semantics) before relying on it beyond a demo.
//
// It is pinned on `globalThis` rather than a plain module-scope variable
// because Next.js's App Router bundles a page route and an API route as
// separate chunks — each can end up with its own copy of this module, so a
// closure-scoped Map would silently split into two stores that never see
// each other's writes even within a single running process.
declare global {
  var __elezamdShareStore: Map<string, StoredNote> | undefined;
}

const store: Map<string, StoredNote> =
  globalThis.__elezamdShareStore ?? new Map<string, StoredNote>();
globalThis.__elezamdShareStore = store;

function generateCode(length: number = CODE_LENGTH): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => CODE_ALPHABET[byte % CODE_ALPHABET.length]).join("");
}

function cleanup(now: number): void {
  for (const [code, entry] of store) {
    if (entry.expiresAt <= now) {
      store.delete(code);
    }
  }
}

export function createSharedNote(
  data: SharedNoteData,
  now: number = Date.now(),
): { code: string; expiresAt: number } {
  cleanup(now);

  let code = generateCode();
  while (store.has(code)) {
    code = generateCode();
  }

  const expiresAt = now + TTL_MS;
  store.set(code, { ...data, createdAt: now, expiresAt });

  return { code, expiresAt };
}

export function getSharedNote(
  code: string,
  now: number = Date.now(),
): (SharedNoteData & { expiresAt: number }) | null {
  cleanup(now);

  const entry = store.get(code);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= now) {
    store.delete(code);
    return null;
  }

  return {
    answers: entry.answers,
    didSearch: entry.didSearch,
    expiresAt: entry.expiresAt,
  };
}

export function _clearSharedNotesForTests(): void {
  store.clear();
}
