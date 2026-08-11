import { NextRequest, NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildFreeChatPrompt } from "@/lib/mentor";
import {
  formatChatHistory,
  loadMentorContext,
  MENTOR_CHAT_WINDOW,
  newMessageId,
  rollingChatHistory,
} from "@/lib/mentor-context";
import { getAllCollections, putItems } from "@/lib/db";
import type { MentorMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      message?: string;
      /** Ak klient pošle históriu, použije sa (web). Inak sa načíta zo servera. */
      history?: { role: "user" | "assistant"; text: string }[];
      persist?: boolean;
    };

    const message = body.message?.trim();
    if (!message) {
      return NextResponse.json({ text: null, error: "Prázdna správa" }, { status: 400 });
    }

    let historyBlock: string;
    if (Array.isArray(body.history) && body.history.length > 0) {
      const sliced = body.history.slice(-MENTOR_CHAT_WINDOW);
      historyBlock = sliced
        .map((m) => `${m.role === "user" ? "Predajca" : "Mentor"}: ${m.text}`)
        .join("\n");
    } else {
      const all = await getAllCollections();
      const msgs = rollingChatHistory((all.mentorMessages ?? []) as unknown as MentorMessage[], "web");
      historyBlock = formatChatHistory(msgs);
    }

    const ctx = await loadMentorContext();
    const prompt = buildFreeChatPrompt(historyBlock, ctx.text, message);
    const text = await generateText(prompt);

    if (body.persist && text) {
      const now = Date.now();
      const userMsg: MentorMessage = {
        id: newMessageId(),
        channel: "web",
        role: "user",
        text: message,
        ts: now,
        updatedAt: now,
      };
      const asstMsg: MentorMessage = {
        id: newMessageId(),
        channel: "web",
        role: "assistant",
        text,
        ts: now + 1,
        updatedAt: now + 1,
      };
      await putItems("mentorMessages", [userMsg, asstMsg] as unknown as { id: string; [k: string]: unknown }[]);
    }

    return NextResponse.json({ text });
  } catch (e) {
    return NextResponse.json({ text: null, error: String(e) }, { status: 500 });
  }
}
