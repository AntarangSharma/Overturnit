import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT } from "@/lib/prompt";
import { OverturnInput } from "@/lib/schema";

export const runtime = "nodejs";
export const maxDuration = 60;

const client = new Anthropic();

const MODEL_PRIMARY = "claude-sonnet-4-6";
const MODEL_FALLBACK = "claude-sonnet-4-5";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = OverturnInput.parse(body);

    const userMsg =
      `DENIAL LETTER:\n${input.denial_text}\n\n` +
      `STATE: ${input.state}\n` +
      `PLAN TYPE: ${input.plan_type}\n` +
      `SERVICE CATEGORY: ${input.service_category}\n` +
      `TODAY: ${new Date().toISOString().slice(0, 10)}`;

    const create = (model: string, useCache: boolean) =>
      client.messages.create({
        model,
        max_tokens: 4000,
        temperature: 0.2,
        system: useCache
          ? [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }]
          : SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMsg }],
      });

    const r = await create(MODEL_PRIMARY, true).catch(async (err: unknown) => {
      const e = err as { status?: number; message?: string };
      if (e?.status === 404 || /model/i.test(String(e?.message ?? ""))) {
        return create(MODEL_FALLBACK, false);
      }
      throw err;
    });

    const block = r.content[0];
    const text = block && block.type === "text" ? block.text : "";
    const cleaned = text.replace(/```json|```/g, "").trim();
    const json = JSON.parse(cleaned);

    return Response.json(json);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return Response.json(
      { error: "Could not analyze denial", detail: msg },
      { status: 500 }
    );
  }
}
