// Telegram Bot API: tenký klient pre Sales Dojo mentora.
// Len odosielanie a overenie. Nezapisuje do predajných kolekcií.

function token(): string | undefined {
  return process.env.TELEGRAM_BOT_TOKEN?.trim() || undefined;
}

export function telegramChatId(): string | undefined {
  return process.env.TELEGRAM_CHAT_ID?.trim() || undefined;
}

export function telegramConfigured(): boolean {
  return Boolean(token() && telegramChatId());
}

export function verifyTelegramSecret(
  headerSecret: string | null,
  querySecret: string | null,
): boolean {
  const expected = process.env.TELEGRAM_WEBHOOK_SECRET?.trim();
  // V produkcii so zapnutým botom vyžadujeme secret; bez tokenu (lokál) nechaj prejsť.
  if (!expected) {
    return !token();
  }
  return headerSecret === expected || querySecret === expected;
}

export function isAllowedChat(chatId: number | string): boolean {
  const allowed = telegramChatId();
  if (!allowed) return false;
  return String(chatId) === allowed;
}

export async function sendTelegramMessage(
  text: string,
  opts?: { chatId?: number | string },
): Promise<boolean> {
  const botToken = token();
  const chatId = opts?.chatId ?? telegramChatId();
  if (!botToken || chatId == null) return false;

  const truncated = text.length > 3900 ? `${text.slice(0, 3900)}\n…` : text;

  try {
    const res = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: truncated,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
