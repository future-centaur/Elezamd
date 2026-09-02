import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Home from "@/app/page";
import { LANDING, PRODUCT_NAME } from "@/lib/copy";

describe("landing", () => {
  it("shows a message-style number and start action", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: PRODUCT_NAME })).toBeDefined();
    expect(screen.getByText(LANDING.demoNumber)).toBeDefined();
    expect(
      screen.getByRole("link", { name: LANDING.messageToStart }),
    ).toHaveProperty("href");
    expect(screen.queryByText(/you may have/i)).toBeNull();
    expect(screen.queryByText(/recommended specialty/i)).toBeNull();
  });
});
