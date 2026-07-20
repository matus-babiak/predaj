"use client";

// Klientská vrstva dát: offline-first.
// - Dáta sa držia v localStorage (okamžité načítanie, funguje bez netu).
// - Pri štarte sa stiahne stav zo servera a zlúči sa podľa updatedAt.
// - Každá zmena sa uloží lokálne hneď a zaradí do fronty na odoslanie;
//   fronta sa odosiela na server, pri výpadku počká na ďalší pokus.

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { COLLECTION_NAMES, type CollectionName } from "./types";

type Item = { id: string; updatedAt: number };
export type DB = Record<CollectionName, Item[]>;

interface Mutation {
  collection: CollectionName;
  put?: Item[];
  delete?: string[];
}

export type SyncState = "loading" | "synced" | "pending" | "offline";

interface StoreCtx {
  db: DB;
  ready: boolean;
  sync: SyncState;
  put: <T extends Item>(collection: CollectionName, item: T) => void;
  remove: (collection: CollectionName, id: string) => void;
}

const CACHE_KEY = "cp_cache_v1";
const QUEUE_KEY = "cp_queue_v1";

// Presmerovanie na login len mimo login stránky — inak by sa /login
// pri každom 401 donekonečna obnovovala.
function redirectToLogin() {
  if (window.location.pathname !== "/login") window.location.href = "/login";
}

function emptyDB(): DB {
  return Object.fromEntries(COLLECTION_NAMES.map((c) => [c, []])) as unknown as DB;
}

function mergeDB(a: DB, b: DB): DB {
  const out = emptyDB();
  for (const c of COLLECTION_NAMES) {
    const byId = new Map<string, Item>();
    for (const item of a[c] ?? []) byId.set(item.id, item);
    for (const item of b[c] ?? []) {
      const existing = byId.get(item.id);
      if (!existing || (item.updatedAt ?? 0) >= (existing.updatedAt ?? 0)) byId.set(item.id, item);
    }
    out[c] = [...byId.values()];
  }
  return out;
}

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [db, setDb] = useState<DB>(emptyDB);
  const [ready, setReady] = useState(false);
  const [sync, setSync] = useState<SyncState>("loading");
  const flushing = useRef(false);
  const flushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const saveCache = (next: DB) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(next));
    } catch {}
  };

  const readQueue = (): Mutation[] => {
    try {
      return JSON.parse(localStorage.getItem(QUEUE_KEY) ?? "[]");
    } catch {
      return [];
    }
  };
  const writeQueue = (q: Mutation[]) => localStorage.setItem(QUEUE_KEY, JSON.stringify(q));

  const flush = useCallback(async () => {
    if (flushing.current) return;
    const queue = readQueue();
    if (queue.length === 0) {
      setSync("synced");
      return;
    }
    flushing.current = true;
    setSync("pending");
    try {
      const res = await fetch("/api/data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mutations: queue }),
      });
      if (res.status === 401) {
        flushing.current = false;
        redirectToLogin();
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      // odošli aj to, čo pribudlo počas requestu
      const current = readQueue();
      writeQueue(current.slice(queue.length));
      flushing.current = false;
      if (current.length > queue.length) void flush();
      else setSync("synced");
    } catch {
      flushing.current = false;
      setSync("offline");
    }
  }, []);

  // Štart: cache -> server -> merge -> flush fronty
  useEffect(() => {
    let cached = emptyDB();
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) cached = mergeDB(emptyDB(), JSON.parse(raw));
    } catch {}
    setDb(cached);
    setReady(true);

    // Na /login sa dáta nesynchronizujú — stránka je pre neprihláseného
    // a fetch by aj tak skončil 401.
    if (window.location.pathname === "/login") {
      setSync("synced");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/data");
        if (res.status === 401) {
          redirectToLogin();
          return;
        }
        if (!res.ok) throw new Error(String(res.status));
        const server = (await res.json()) as DB;
        setDb((local) => {
          const merged = mergeDB(server, local);
          saveCache(merged);
          return merged;
        });
        void flush();
      } catch {
        setSync("offline");
      }
    })();

    const onOnline = () => void flush();
    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, [flush]);

  const enqueue = (m: Mutation) => {
    writeQueue([...readQueue(), m]);
    setSync("pending");
    if (flushTimer.current) clearTimeout(flushTimer.current);
    flushTimer.current = setTimeout(() => void flush(), 800);
  };

  const put = useCallback((collection: CollectionName, item: Item) => {
    setDb((prev) => {
      const list = prev[collection] ?? [];
      const idx = list.findIndex((x) => x.id === item.id);
      const nextList = idx >= 0 ? [...list.slice(0, idx), item, ...list.slice(idx + 1)] : [...list, item];
      const next = { ...prev, [collection]: nextList };
      saveCache(next);
      return next;
    });
    enqueue({ collection, put: [item] });
  }, []);

  const remove = useCallback((collection: CollectionName, id: string) => {
    setDb((prev) => {
      const next = { ...prev, [collection]: (prev[collection] ?? []).filter((x) => x.id !== id) };
      saveCache(next);
      return next;
    });
    enqueue({ collection, delete: [id] });
  }, []);

  return <Ctx.Provider value={{ db, ready, sync, put, remove }}>{children}</Ctx.Provider>;
}

export function useStore(): StoreCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore mimo StoreProvider");
  return ctx;
}

export function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
