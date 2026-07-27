import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import {
  buildCustomerStatsPrompt,
  parseStatsAiResponse,
  type StatsAiFreeItem,
} from "@/lib/statsAi";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      knownWants?: string[];
      knownFears?: string[];
      freeWants?: StatsAiFreeItem[];
      freeFears?: StatsAiFreeItem[];
      localWantCounts?: { label: string; count: number }[];
      localFearCounts?: { label: string; count: number }[];
    };

    const freeWants = body.freeWants ?? [];
    const freeFears = body.freeFears ?? [];

    if (freeWants.length === 0 && freeFears.length === 0) {
      return NextResponse.json({
        wants: [],
        fears: [],
        insight:
          "Zatiaľ nemáš voľné texty na zhlukovanie. Chip kategórie už vidíš v zozname. Pri ďalších zákazníkoch dopíš krátko, čo chceli a čoho sa báli, aj vlastnými slovami.",
      });
    }

    const prompt = buildCustomerStatsPrompt({
      knownWants: body.knownWants ?? [],
      knownFears: body.knownFears ?? [],
      freeWants,
      freeFears,
      localWantCounts: body.localWantCounts ?? [],
      localFearCounts: body.localFearCounts ?? [],
    });

    const text = await generateText(prompt);
    if (!text) {
      return NextResponse.json({ wants: null, fears: null, insight: null }, { status: 502 });
    }

    const parsed = parseStatsAiResponse(text);
    if (!parsed) {
      return NextResponse.json(
        { wants: null, fears: null, insight: null, error: "parse_failed" },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (e) {
    return NextResponse.json(
      { wants: null, fears: null, insight: null, error: String(e) },
      { status: 500 }
    );
  }
}
