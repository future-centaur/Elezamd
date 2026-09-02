import { createSharedNote } from "@/lib/share";
import { FEATURES } from "@/lib/features";
import type { WaitingRoomAnswers } from "@/lib/session";

export const dynamic = "force-dynamic";

type ShareBody = {
  answers?: unknown;
  didSearch?: unknown;
};

function isAnswers(value: unknown): value is WaitingRoomAnswers {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    typeof record.searched === "string" &&
    typeof record.itSaid === "string" &&
    typeof record.fear === "string" &&
    typeof record.feel === "string"
  );
}

export async function POST(request: Request) {
  if (!FEATURES.SHARE_LINK) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  let body: ShareBody;
  try {
    body = (await request.json()) as ShareBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isAnswers(body.answers) || typeof body.didSearch !== "boolean") {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const { code, expiresAt } = createSharedNote({
    answers: body.answers,
    didSearch: body.didSearch,
  });

  return Response.json({ code, expiresAt });
}
