"use client";

import { useState } from "react";
import type { Entry } from "@/lib/types";
import { OUTCOME_LABELS } from "@/content/chips";

export function EntryRow({ entry, onDelete }: { entry: Entry; onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  const time = new Date(entry.ts).toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{OUTCOME_LABELS[entry.outcome]}</span>
          {entry.trust ? <span className="text-zinc-500">dôvera {entry.trust}/5</span> : null}
          <span className="text-zinc-400">{time}</span>
        </div>
        {!confirm ? (
          <button type="button" onClick={() => setConfirm(true)} className="text-xs text-zinc-400 hover:text-red-600">
            zmazať
          </button>
        ) : (
          <span className="flex gap-2 text-xs">
            <button type="button" onClick={onDelete} className="font-medium text-red-600">
              naozaj zmazať
            </button>
            <button type="button" onClick={() => setConfirm(false)} className="text-zinc-500">
              nie
            </button>
          </span>
        )}
      </div>
      <div className="mt-1 space-y-0.5 text-zinc-600 dark:text-zinc-300">
        {entry.want && <div>🎯 chcel: {entry.want}</div>}
        {entry.fear && <div>😟 bál sa: {entry.fear}</div>}
        {entry.why && <div>💡 prečo: {entry.why}</div>}
        {entry.objection && <div>🥊 námietka: {entry.objection}</div>}
        {entry.plus && <div className="text-emerald-700 dark:text-emerald-400">➕ {entry.plus}</div>}
        {entry.minus && <div className="text-red-700 dark:text-red-400">➖ {entry.minus}</div>}
        {entry.note && <div>📝 {entry.note}</div>}
      </div>
    </div>
  );
}
