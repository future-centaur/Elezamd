import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WaitingRoomClient } from "@/app/waiting-room/WaitingRoomClient";
import {
  DISCLOSURE,
  EMERGENCY_CHECK,
  EMERGENCY_STOP,
  NOTE,
  QUESTION_UI,
  QUESTIONS,
  SEARCH_GATE,
} from "@/lib/copy";
import { formatNote } from "@/lib/format-note";

vi.mock("@/lib/clipboard", () => ({
  copyText: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/features", () => ({
  FEATURES: { VOICE: false, TIDY: false },
}));

import { copyText } from "@/lib/clipboard";

const DEMO = {
  searched: "headache nausea light hurts",
  itSaid: "could be migraine or something serious",
  fear: "a brain tumour",
  feel: "pain behind my eyes since yesterday, worse in light, no fever, I slept badly",
};

async function startQuestions() {
  const user = userEvent.setup({ delay: null });
  await user.click(screen.getByRole("button", { name: DISCLOSURE.continue }));
  await user.click(screen.getByLabelText(EMERGENCY_CHECK.none));
  await user.click(screen.getByRole("button", { name: EMERGENCY_CHECK.continue }));
  return user;
}

async function answerCurrent(user: ReturnType<typeof userEvent.setup>, text: string) {
  await user.type(screen.getByRole("textbox"), text);
  await user.click(screen.getByRole("button", { name: QUESTION_UI.continue }));
}

async function completeYesPath(user: ReturnType<typeof userEvent.setup>) {
  await answerCurrent(user, DEMO.feel);
  await user.click(screen.getByRole("button", { name: SEARCH_GATE.yes }));
  await answerCurrent(user, DEMO.searched);
  await answerCurrent(user, DEMO.itSaid);
  await answerCurrent(user, DEMO.fear);
}

describe("WaitingRoomClient", () => {
  afterEach(() => {
    cleanup();
    vi.mocked(copyText).mockClear();
  });

  it("shows AI disclosure before any question", () => {
    render(<WaitingRoomClient />);
    expect(screen.getByText(DISCLOSURE.aiInvolved)).toBeDefined();
    expect(screen.queryByText(QUESTIONS.feel.prompt)).toBeNull();
    expect(screen.queryByText(QUESTIONS.searched.prompt)).toBeNull();
  });

  it("asks what they feel before asking if they searched", async () => {
    render(<WaitingRoomClient />);
    const user = await startQuestions();

    expect(screen.getByText(QUESTIONS.feel.prompt)).toBeDefined();
    expect(screen.queryByText(SEARCH_GATE.title)).toBeNull();
    expect(screen.queryByText(QUESTIONS.searched.prompt)).toBeNull();

    await answerCurrent(user, DEMO.feel);
    expect(screen.getByText(SEARCH_GATE.title)).toBeDefined();
    expect(screen.queryByText(QUESTIONS.searched.prompt)).toBeNull();
  });

  it("completes the yes path and shows body first on the note", async () => {
    render(<WaitingRoomClient />);
    const user = await startQuestions();
    await completeYesPath(user);

    expect(screen.getByText(NOTE.badge)).toBeDefined();
    expect(screen.getByText(DEMO.feel)).toBeDefined();
    expect(screen.getByText(`“${DEMO.fear}”`)).toBeDefined();
    expect(screen.getByText(DEMO.searched)).toBeDefined();
    expect(screen.getByText(DEMO.itSaid)).toBeDefined();
  });

  it("skips search questions when they did not look it up", async () => {
    render(<WaitingRoomClient />);
    const user = await startQuestions();
    await answerCurrent(user, DEMO.feel);
    await user.click(screen.getByRole("button", { name: SEARCH_GATE.no }));
    await answerCurrent(user, DEMO.fear);

    expect(screen.getByText(NOTE.badge)).toBeDefined();
    expect(screen.getByText(DEMO.feel)).toBeDefined();
    expect(screen.getByText(`“${DEMO.fear}”`)).toBeDefined();
    expect(screen.getByText(NOTE.didNotSearch)).toBeDefined();
    expect(screen.queryByText(DEMO.searched)).toBeNull();
  });

  it("does not restore answers after remount, like a refresh", async () => {
    const { unmount } = render(<WaitingRoomClient />);
    const user = await startQuestions();
    await completeYesPath(user);
    expect(screen.getByText(DEMO.searched)).toBeDefined();

    unmount();
    render(<WaitingRoomClient />);

    expect(screen.getByText(DISCLOSURE.aiInvolved)).toBeDefined();
    expect(screen.queryByText(DEMO.searched)).toBeNull();
    expect(screen.queryByText(NOTE.badge)).toBeNull();
  });

  it("returns to disclosure with empty fields after I’m done", async () => {
    render(<WaitingRoomClient />);
    const user = await startQuestions();
    await completeYesPath(user);

    await user.click(screen.getByRole("button", { name: NOTE.imDone }));

    expect(screen.getByText(DISCLOSURE.aiInvolved)).toBeDefined();
    expect(screen.queryByText(DEMO.searched)).toBeNull();
    expect(screen.queryByText(DEMO.feel)).toBeNull();
  });

  it("interrupts on a warning sign without naming a condition", async () => {
    render(<WaitingRoomClient />);
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: DISCLOSURE.continue }));
    await user.click(screen.getByLabelText("Chest pain or pressure"));
    await user.click(screen.getByRole("button", { name: EMERGENCY_CHECK.continue }));

    expect(screen.getByText(EMERGENCY_STOP.body)).toBeDefined();
    expect(screen.queryByText(QUESTIONS.feel.prompt)).toBeNull();
    expect(screen.queryByText(QUESTIONS.searched.prompt)).toBeNull();
    expect(screen.queryByText(NOTE.badge)).toBeNull();
    expect(screen.queryByText(/you may have/i)).toBeNull();
    expect(screen.queryByText(/migraine/i)).toBeNull();
    expect(screen.queryByText(/pneumonia/i)).toBeNull();
  });

  it("copies the note to the clipboard", async () => {
    render(<WaitingRoomClient />);
    const user = await startQuestions();
    await completeYesPath(user);

    await user.click(screen.getByRole("button", { name: NOTE.copyNote }));

    expect(copyText).toHaveBeenCalledWith(formatNote(DEMO, true));
  });
});
