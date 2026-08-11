import {
  formatChatHistory,
  loadMentorContext,
  MENTOR_CHAT_WINDOW,
  newMessageId,
  rollingChatHistory,
} from "@/lib/mentor-context";
import { buildFreeChatPrompt } from "@/lib/mentor";
import { generateText } from "@/lib/gemini";
import { getAllCollections, putItems } from "@/lib/db";
import {
  isAllowedChat,
  sendTelegramMessage,
  telegramConfigured,
  verifyTelegramSecret,
} from "@/lib/telegram";
import type { MentorMessage } from "@/lib/types";

export const dynamic = "force-dynamic";

type TelegramUpdate = {
  message?: {
    chat?: { id?: number };
    text?: string;
  };
};

function unauthorized() {
  return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

const START_HELP = `Ahoj, som tvoj Sales Dojo mentor.

Napíš mi čokoľvek o predaji, námietkach alebo dnešnom dni. Odpoviem podľa tvojich zápisov v appke.

Príklady:
• Dnes mi traja odmietli cenu, čo s tým?
• Kde strácam v posledných predajoch?
• Priprav ma na námietku nepotrebujem
• Čo mám dnes trénovať?

Do appky z Telegramu nič neukladám, len radím.`;

async function replyTelegramChat(userText: string): Promise<string> {
  const all = await getAllCollections();
  const prior = rollingChatHistory(
    (all.mentorMessages ?? []) as unknown as MentorMessage[],
    "telegram",
    MENTOR_CHAT_WINDOW,
  );
  const historyBlock = formatChatHistory(prior);
  const ctx = await loadMentorContext();
  const prompt = buildFreeChatPrompt(historyBlock, ctx.text, userText);
  const answer = await generateText(prompt);
  const reply =
    answer?.trim() ||
    "Momentálne neviem odpovedať (AI kľúč alebo sieť). Skús neskôr, alebo otvor AI Mentor v appke.";

  const now = Date.now();
  const userMsg: MentorMessage = {
    id: newMessageId(),
    channel: "telegram",
    role: "user",
    text: userText,
    ts: now,
    updatedAt: now,
  };
  const asstMsg: MentorMessage = {
    id: newMessageId(),
    channel: "telegram",
    role: "assistant",
    text: reply,
    ts: now + 1,
    updatedAt: now + 1,
  };
  await putItems("mentorMessages", [userMsg, asstMsg] as unknown as { id: string; [k: string]: unknown }[]);
  return reply;
}

export async function POST(req: Request) {
  if (!telegramConfigured()) {
    return Response.json(
      { ok: false, error: "TELEGRAM_BOT_TOKEN alebo TELEGRAM_CHAT_ID chýba" },
      { status: 500 },
    );
  }

  const headerSecret = req.headers.get("x-telegram-bot-api-secret-token");
  const querySecret = new URL(req.url).searchParams.get("secret");
  if (!verifyTelegramSecret(headerSecret, querySecret)) {
    return unauthorized();
  }

  let update: TelegramUpdate;
  try {
    update = (await req.json()) as TelegramUpdate;
  } catch {
    return Response.json({ ok: false, error: "Neplatné JSON" }, { status: 400 });
  }

  const chatId = update.message?.chat?.id;
  const text = update.message?.text?.trim();

  if (chatId == null) {
    return Response.json({ ok: true });
  }

  if (!isAllowedChat(chatId)) {
    return Response.json({ ok: true });
  }

  if (!text) {
    return Response.json({ ok: true });
  }

  if (text === "/start" || text.startsWith("/start ")) {
    await sendTelegramMessage(START_HELP, { chatId });
    return Response.json({ ok: true });
  }

  const answer = await replyTelegramChat(text);
  await sendTelegramMessage(answer, { chatId });
  return Response.json({ ok: true });
}
