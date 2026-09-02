import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  DISCLOSURE,
  EMERGENCY_CHECK,
  QUESTION_UI,
  SEARCH_GATE,
} from "@/lib/copy";

vi.mock("@/lib/features", () => ({
  FEATURES: { VOICE: false, TIDY: true },
}));

vi.mock("@/lib/clipboard", () => ({
  copyText: vi.fn().mockResolvedValue(undefined),
}));

import { WaitingRoomClient } from "@/app/waiting-room/WaitingRoomClient";

describe("WaitingRoomClient tidy", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("writes a tidied answer into the current question before advancing", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ text: "headache nausea light sensitivity" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<WaitingRoomClient />);
    const user = userEvent.setup({ delay: null });
    await user.click(screen.getByRole("button", { name: DISCLOSURE.continue }));
    await user.click(screen.getByLabelText(EMERGENCY_CHECK.none));
    await user.click(screen.getByRole("button", { name: EMERGENCY_CHECK.continue }));
    await user.type(screen.getByRole("textbox"), "headache nausea lite hurts");
    await user.click(screen.getByRole("button", { name: QUESTION_UI.continue }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/waiting-room/tidy",
        expect.objectContaining({ method: "POST" }),
      );
    });
    await waitFor(() => {
      expect(screen.getByText(SEARCH_GATE.title)).toBeDefined();
    });

    await user.click(screen.getByRole("button", { name: SEARCH_GATE.yes }));
    expect(screen.getByText("2 of 4")).toBeDefined();
  });
});
