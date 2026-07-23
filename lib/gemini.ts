// Nízka úroveň: volanie Gemini API.
// Pri akejkoľvek chybe (chýbajúci kľúč, network error, prázdna odpoveď) vráti
// null namiesto hodenia výnimky, takže appka nikdy nespadne kvôli AI, len sa
// daná sekcia jednoducho nezobrazí. Žiadne SDK, čistý fetch.

const MODEL = "gemini-flash-latest";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export async function generateText(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": apiKey,
      },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });
    if (!res.ok) return null;

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return typeof text === "string" && text.trim() ? text.trim() : null;
  } catch {
    return null;
  }
}
