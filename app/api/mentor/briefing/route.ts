import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import {
  buildWeeklyBriefingPrompt,
  type BriefingEntryInput,
  type BriefingReflectionInput,
} from "@/lib/mentor";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      pluses?: string[];
      minuses?: string[];
      entries?: BriefingEntryInput[];
      reflections?: BriefingReflectionInput[];
    };
    const prompt = buildWeeklyBriefingPrompt({
      pluses: body.pluses ?? [],
      minuses: body.minuses ?? [],
      entries: body.entries ?? [],
      reflections: body.reflections ?? [],
    });
    const text = await generateText(prompt);
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ text: null, error: String(e) }, { status: 500 });
  }
}
