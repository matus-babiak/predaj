"use client";

// Požiadavky: čistý zoznam toho, s čím zákazníci chodia.
// Oddelené od Záznamov (predajný rozhovor). Sem len dopyt, bez výsledku predaja.
// Počet „počul som“ pomáha neskôr priorizovať, s čím má zmysel pracovať.

import { useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import type { CustomerRequest } from "@/lib/types";
import { Btn, Card, Input } from "@/components/ui";

function formatDay(ts: number): string {
  return new Date(ts).toLocaleDateString("sk-SK", { day: "numeric", month: "short", year: "numeric" });
}

export default function PoziadavkyPage() {
  const { requests, put, remove, ready } = useData();
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"open" | "done">("open");

  if (!ready) return null;

  const open = requests.filter((r) => !r.doneAt);
  const done = requests.filter((r) => r.doneAt).sort((a, b) => (b.doneAt ?? 0) - (a.doneAt ?? 0));
  const list = tab === "open" ? open : done;

  const add = () => {
    const t = text.trim();
    if (!t) return;
    const now = Date.now();
    const existing = open.find((r) => r.text.toLowerCase() === t.toLowerCase());
    if (existing) {
      put("requests", { ...existing, count: existing.count + 1, updatedAt: now } satisfies CustomerRequest);
    } else {
      put("requests", {
        id: uid(),
        ts: now,
        text: t,
        count: 1,
        updatedAt: now,
      } satisfies CustomerRequest);
    }
    setText("");
  };

  const bump = (r: CustomerRequest) => {
    const now = Date.now();
    put("requests", { ...r, count: r.count + 1, updatedAt: now });
  };

  const markDone = (r: CustomerRequest) => {
    const now = Date.now();
    put("requests", { ...r, doneAt: now, updatedAt: now });
  };

  const reopen = (r: CustomerRequest) => {
    const now = Date.now();
    put("requests", { ...r, doneAt: undefined, updatedAt: now });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Požiadavky</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Čistý zoznam toho, s čím ľudia chodia. Bez predajného záznamu. Spíš dopyt, pri opakovaní
          pripočítaj „počul som“, neskôr podľa toho rozhoduj, s čím pracovať.
        </p>
      </div>

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
          className="flex gap-2"
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="napr. puzdro na iPhone 13, výmena skla Xiaomi, powerbanka 20000 mAh"
          />
          <Btn type="submit" disabled={!text.trim()}>
            Pridať
          </Btn>
        </form>
      </Card>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("open")}
          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
            tab === "open"
              ? "border-indigo-600 bg-indigo-600 text-white"
              : "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          }`}
        >
          Otvorené ({open.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("done")}
          className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
            tab === "done"
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-zinc-300 bg-white text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          }`}
        >
          Spracované ({done.length})
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {tab === "open" ? "Žiadne otvorené požiadavky." : "Zatiaľ žiadne spracované požiadavky."}
        </p>
      ) : (
        <div className="space-y-2">
          {list.map((r) => (
            <RequestCard
              key={r.id}
              request={r}
              onBump={() => bump(r)}
              onDone={() => markDone(r)}
              onReopen={() => reopen(r)}
              onDelete={() => remove("requests", r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function RequestCard({
  request,
  onBump,
  onDone,
  onReopen,
  onDelete,
}: {
  request: CustomerRequest;
  onBump: () => void;
  onDone: () => void;
  onReopen: () => void;
  onDelete: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const done = !!request.doneAt;

  return (
    <div
      className={`rounded-xl border p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900 ${
        done
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"
          : "border-zinc-200 bg-white"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className={`text-zinc-800 dark:text-zinc-200 ${done ? "line-through opacity-70" : "font-medium"}`}>
          {request.text}
        </div>
        <span
          className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-semibold ${
            done
              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300"
          }`}
          title="Koľkokrát som to počul"
        >
          ×{request.count}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <span>{done ? `spracované ${formatDay(request.doneAt!)}` : formatDay(request.ts)}</span>
        <span className="flex items-center gap-3">
          {!done && (
            <button
              type="button"
              onClick={onBump}
              className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              počul som
            </button>
          )}
          {!done ? (
            <button
              type="button"
              onClick={onDone}
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              spracované
            </button>
          ) : (
            <button type="button" onClick={onReopen} className="hover:text-amber-600">
              vrátiť
            </button>
          )}
          {!confirm ? (
            <button type="button" onClick={() => setConfirm(true)} className="hover:text-red-600">
              zmazať
            </button>
          ) : (
            <span className="flex gap-2">
              <button type="button" onClick={onDelete} className="font-medium text-red-600">
                naozaj zmazať
              </button>
              <button type="button" onClick={() => setConfirm(false)} className="text-zinc-500">
                nie
              </button>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}
