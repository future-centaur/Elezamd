import Anthropic from "@anthropic-ai/sdk";
import { QUESTIONS } from "@/lib/copy";
import {
  chooseTidyResult,
  extractTidyText,
  isQuestionId,
  TIDY_SYSTEM_PROMPT,
} from "@/lib/tidy";

export const dynamic = "force-dynamic";

type TidyBody = {
  questionId?: unknown;
  text?: unknown;
};

function textFromMessage(message: Anthropic.Message): string {
  const block = message.content.find((part) => part.type === "text");
  return block && block.type === "text" ? block.text : "";
}

export async function POST(request: Request) {
  let body: TidyBody;

  try {
    body = (await request.json()) as TidyBody;
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!isQuestionId(body.questionId) || typeof body.text !== "string") {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const original = body.text;
  if (!original.trim()) {
    return Response.json({ error: "Empty text" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ text: original });
  }

  try {
    const client = new Anthropic({ apiKey });
    const question = QUESTIONS[body.questionId];
    const message = await client.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5",
      max_tokens: 512,
      system: TIDY_SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Question: ${question.title}\nPrompt: ${question.prompt}\nAnswer: ${original}`,
        },
      ],
    });

    const candidate = extractTidyText(textFromMessage(message));
    return Response.json({ text: chooseTidyResult(original, candidate) });
  } catch {
    return Response.json({ text: original });
  }
}
