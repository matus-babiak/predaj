import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildSwPrompt } from "@/lib/mentor";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { pluses, minuses } = (await req.json()) as { pluses?: string[]; minuses?: string[] };
    const prompt = buildSwPrompt(pluses ?? [], minuses ?? []);
    const text = await generateText(prompt);
    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ text: null, error: String(e) }, { status: 500 });
  }
}
