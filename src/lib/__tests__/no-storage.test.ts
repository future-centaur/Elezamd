import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_ROOT = join(__dirname, "..", "..");

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) {
      if (entry === "__tests__") {
        return [];
      }
      return walk(fullPath);
    }
    if (/\.(ts|tsx)$/.test(entry) && !entry.endsWith(".test.ts") && !entry.endsWith(".test.tsx")) {
      return [fullPath];
    }
    return [];
  });
}

describe("privacy and product boundaries", () => {
  const files = walk(SRC_ROOT);
  const contents = files.map((file) => ({
    file,
    text: readFileSync(file, "utf8"),
  }));

  it("does not persist note content in web storage", () => {
    for (const { file, text } of contents) {
      expect(text, file).not.toMatch(/localStorage/);
      expect(text, file).not.toMatch(/sessionStorage/);
      expect(text, file).not.toMatch(/indexedDB/i);
    }
  });

  it("does not read medical content from searchParams", () => {
    for (const { file, text } of contents) {
      expect(text, file).not.toMatch(/searchParams/);
    }
  });

  it("does not include clinician directory, booking, or specialty screens", () => {
    const uiFiles = contents.filter(({ file }) =>
      /[\\/](app|components)[\\/]/.test(file),
    );

    for (const { file, text } of uiFiles) {
      const lower = text.toLowerCase();
      expect(lower, file).not.toContain("recommended specialty");
      expect(lower, file).not.toContain("browse clinicians");
      expect(lower, file).not.toContain("find care");
    }

    for (const { file } of contents) {
      expect(file).not.toMatch(/clinician/i);
      expect(file).not.toMatch(/booking/i);
    }
  });

  it("does not create assessment or share API routes", () => {
    // NOTE: the `feature/share-link` branch intentionally adds a
    // practitioner share link (see SPEC.md §3 "Non-Goals" and §4 P-01/P-03/
    // H-03 for why this is normally forbidden on `main`). This allowlist is
    // the single, explicit, scoped exception — it must not grow silently.
    const ALLOWED_SHARE_PATHS = [
      "/api/waiting-room/share/route.ts",
      "/share/[code]/page.tsx",
      "/share/[code]/CopyNoteButton.tsx",
    ];

    for (const { file } of contents) {
      const normalized = file.replace(/\\/g, "/");
      const isAllowedShareRoute = ALLOWED_SHARE_PATHS.some((allowed) =>
        normalized.endsWith(allowed),
      );

      expect(normalized).not.toMatch(/\/api\/ai\//);

      if (isAllowedShareRoute) {
        continue;
      }

      expect(normalized).not.toMatch(/\/api\/share/);
      expect(normalized).not.toMatch(/\/share\//);
      if (normalized.includes("/api/")) {
        expect(normalized).toMatch(/\/api\/waiting-room\/tidy\/route\.ts$/);
      }
    }
  });
});
