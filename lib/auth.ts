// Jednoduché prihlásenie jedným heslom.
// Heslo je v env premennej APP_PASSWORD (nastavuje sa na Verceli, nie v kóde).
// Po prihlásení dostane prehliadač podpísaný token v httpOnly cookie.

const encoder = new TextEncoder();

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const AUTH_COOKIE = "cp_auth";
const VALID_DAYS = 180;

export async function createToken(password: string): Promise<string> {
  const exp = Date.now() + VALID_DAYS * 24 * 60 * 60 * 1000;
  const sig = await hmac(password, `cesta-predajcu:${exp}`);
  return `${exp}.${sig}`;
}

export async function verifyToken(token: string | undefined, password: string): Promise<boolean> {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  const exp = Number(expStr);
  if (!exp || !sig || exp < Date.now()) return false;
  const expected = await hmac(password, `cesta-predajcu:${exp}`);
  return sig === expected;
}
