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

describe("WaitingRoomClient", () => {
  afterEach(() => {
    cleanup();
    vi.mocked(copyText).mockClear();
  });

  it("shows AI disclosure before any question", () => {
    render(<WaitingRoomClient />);
    expect(screen.getByText(DISCLOSURE.aiInvolved)).toBeDefined();
    expect(screen.queryByText(QUESTIONS.searched.prompt)).toBeNull();
  });

  it("completes Q1–Q4 and shows all four answers unmodified", async () => {
    render(<WaitingRoomClient />);
    const user = await startQuestions();
    await answerCurrent(user, DEMO.searched);
    await answerCurrent(user, DEMO.itSaid);
    await answerCurrent(user, DEMO.fear);
    await answerCurrent(user, DEMO.feel);

    expect(screen.getByText(NOTE.badge)).toBeDefined();
    expect(screen.getByText(DEMO.searched)).toBeDefined();
    expect(screen.getByText(DEMO.itSaid)).toBeDefined();
    expect(screen.getByText(`“${DEMO.fear}”`)).toBeDefined();
    expect(screen.getByText(DEMO.feel)).toBeDefined();
  });

  it("does not restore answers after remount, like a refresh", async () => {
    const { unmount } = render(<WaitingRoomClient />);
    const user = await startQuestions();
    await answerCurrent(user, DEMO.searched);
    await answerCurrent(user, DEMO.itSaid);
    await answerCurrent(user, DEMO.fear);
    await answerCurrent(user, DEMO.feel);
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
    await answerCurrent(user, DEMO.searched);
    await answerCurrent(user, DEMO.itSaid);
    await answerCurrent(user, DEMO.fear);
    await answerCurrent(user, DEMO.feel);

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
    expect(screen.queryByText(QUESTIONS.searched.prompt)).toBeNull();
    expect(screen.queryByText(NOTE.badge)).toBeNull();
    expect(screen.queryByText(/you may have/i)).toBeNull();
    expect(screen.queryByText(/migraine/i)).toBeNull();
    expect(screen.queryByText(/pneumonia/i)).toBeNull();
  });

  it("copies the four sections to the clipboard", async () => {
    render(<WaitingRoomClient />);
    const user = await startQuestions();
    await answerCurrent(user, DEMO.searched);
    await answerCurrent(user, DEMO.itSaid);
    await answerCurrent(user, DEMO.fear);
    await answerCurrent(user, DEMO.feel);

    await user.click(screen.getByRole("button", { name: NOTE.copyNote }));

    expect(copyText).toHaveBeenCalledWith(formatNote(DEMO));
  });
});
