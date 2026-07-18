// Serverové úložisko dát.
// Produkcia (Vercel): Upstash Redis cez REST API — env premenné
//   UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN (alebo KV_REST_API_URL/KV_REST_API_TOKEN).
// Lokálny vývoj bez Redisu: dáta sa ukladajú do súboru .data.json.

import { COLLECTION_NAMES, type CollectionName } from "./types";

type Item = { id: string; [k: string]: unknown };

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;

const hasRedis = Boolean(redisUrl && redisToken);

async function redisPipeline(commands: string[][]): Promise<unknown[]> {
  const res = await fetch(`${redisUrl}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis error: ${res.status} ${await res.text()}`);
  const data = (await res.json()) as { result: unknown }[];
  return data.map((d) => d.result);
}

// HGETALL vracia pole [field, value, field, value, ...]
function parseHash(flat: unknown): Item[] {
  if (!Array.isArray(flat)) return [];
  const items: Item[] = [];
  for (let i = 1; i < flat.length; i += 2) {
    try {
      items.push(JSON.parse(String(flat[i])));
    } catch {
      // poškodený záznam preskočíme
    }
  }
  return items;
}

// ---- Lokálny fallback (len vývoj) ------------------------------------------

async function readLocal(): Promise<Record<string, Item[]>> {
  const { readFile } = await import("fs/promises");
  try {
    return JSON.parse(await readFile(".data.json", "utf8"));
  } catch {
    return {};
  }
}

async function writeLocal(data: Record<string, Item[]>): Promise<void> {
  const { writeFile } = await import("fs/promises");
  await writeFile(".data.json", JSON.stringify(data, null, 2));
}

// ---- Verejné API -----------------------------------------------------------

export async function getAllCollections(): Promise<Record<string, Item[]>> {
  if (hasRedis) {
    const results = await redisPipeline(COLLECTION_NAMES.map((c) => ["HGETALL", `cp:${c}`]));
    const out: Record<string, Item[]> = {};
    COLLECTION_NAMES.forEach((c, i) => {
      out[c] = parseHash(results[i]);
    });
    return out;
  }
  const local = await readLocal();
  const out: Record<string, Item[]> = {};
  for (const c of COLLECTION_NAMES) out[c] = local[c] ?? [];
  return out;
}

export async function putItems(collection: CollectionName, items: Item[]): Promise<void> {
  if (items.length === 0) return;
  if (hasRedis) {
    const cmd = ["HSET", `cp:${collection}`];
    for (const item of items) cmd.push(item.id, JSON.stringify(item));
    await redisPipeline([cmd]);
    return;
  }
  const local = await readLocal();
  const list = local[collection] ?? [];
  for (const item of items) {
    const idx = list.findIndex((x) => x.id === item.id);
    if (idx >= 0) list[idx] = item;
    else list.push(item);
  }
  local[collection] = list;
  await writeLocal(local);
}

export async function deleteItems(collection: CollectionName, ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  if (hasRedis) {
    await redisPipeline([["HDEL", `cp:${collection}`, ...ids]]);
    return;
  }
  const local = await readLocal();
  local[collection] = (local[collection] ?? []).filter((x) => !ids.includes(x.id));
  await writeLocal(local);
}
