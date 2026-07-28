import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildStudyPrompt } from "@/lib/mentor";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { rawText } = (await req.json()) as { rawText?: string };
    const text = (rawText ?? "").trim();
    if (!text) {
      return NextResponse.json({ data: null, error: "Prázdny text" }, { status: 400 });
    }

    const raw = await generateText(buildStudyPrompt(text));
    if (!raw) {
      return NextResponse.json({ data: null }, { status: 200 });
    }

    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ data: null, error: "Neplatná odpoveď AI" }, { status: 200 });
    }

    const parsed = JSON.parse(jsonMatch[0]) as {
      title?: string;
      situation?: string;
      learnPoints?: unknown;
      whatsGo?: string;
    };

    const learnPoints = Array.isArray(parsed.learnPoints)
      ? parsed.learnPoints.map((p) => String(p).trim()).filter(Boolean)
      : [];

    return NextResponse.json({
      data: {
        title: String(parsed.title ?? "").trim() || "Téma na doštudovanie",
        situation: String(parsed.situation ?? "").trim() || undefined,
        learnPoints,
        whatsGo: String(parsed.whatsGo ?? "").trim() || undefined,
      },
    });
  } catch (e) {
    return NextResponse.json({ data: null, error: String(e) }, { status: 500 });
  }
}
