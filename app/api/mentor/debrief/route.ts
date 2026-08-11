import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildDebriefPrompt } from "@/lib/mentor";
import { formatEntryForPrompt, loadMentorContext } from "@/lib/mentor-context";
import type { Entry } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { entry?: Entry };
    if (!body.entry?.id || !body.entry.outcome) {
      return NextResponse.json({ text: null, error: "Chýba záznam" }, { status: 400 });
    }
    const ctx = await loadMentorContext();
    const prompt = buildDebriefPrompt(formatEntryForPrompt(body.entry), ctx.text);
    const text = await generateText(prompt);
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ text: null, error: String(e) }, { status: 500 });
  }
}
