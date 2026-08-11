import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildEveningSummaryPrompt } from "@/lib/mentor";
import {
  formatEntryForPrompt,
  formatReflectionForPrompt,
  loadMentorContext,
} from "@/lib/mentor-context";
import { dayKey } from "@/lib/gamify";
import { getAllCollections } from "@/lib/db";
import type { Entry, Reflection } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { reflection?: Reflection; date?: string };
    const all = await getAllCollections();
    const date = body.date || body.reflection?.date || dayKey(Date.now());
    const reflection =
      body.reflection ??
      ((all.reflections ?? []) as unknown as Reflection[]).find((r) => r.date === date);

    if (!reflection) {
      return NextResponse.json({ text: null, error: "Chýba reflexia" }, { status: 400 });
    }

    const todayEntries = ((all.entries ?? []) as unknown as Entry[])
      .filter((e) => dayKey(e.ts) === date)
      .sort((a, b) => b.ts - a.ts);

    const ctx = await loadMentorContext();
    const prompt = buildEveningSummaryPrompt(
      formatReflectionForPrompt(reflection),
      todayEntries.length
        ? todayEntries.map(formatEntryForPrompt).join("\n")
        : "(dnes žiadne záznamy)",
      ctx.text,
    );
    const text = await generateText(prompt);
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ text: null, error: String(e) }, { status: 500 });
  }
}
