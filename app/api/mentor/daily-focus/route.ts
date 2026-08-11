import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildDailyFocusPrompt } from "@/lib/mentor";
import { loadMentorContext } from "@/lib/mentor-context";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const ctx = await loadMentorContext();
    const prompt = buildDailyFocusPrompt(ctx.text);
    const text = await generateText(prompt);
    return NextResponse.json({ text, fingerprint: ctx.fingerprint });
  } catch (e) {
    return NextResponse.json({ text: null, error: String(e) }, { status: 500 });
  }
}
