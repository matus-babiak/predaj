"use client";

import { useState } from "react";
import type { Entry } from "@/lib/types";
import {
  NEXT_STEP_PLAN_LABELS,
  OBJECTION_REACTION_LABELS,
  OUTCOME_LABELS,
  PRICE_TIMING_LABELS,
} from "@/content/chips";

export function EntryRow({
  entry,
  onDelete,
  onAskMentor,
  mentorBusy,
}: {
  entry: Entry;
  onDelete: () => void;
  onAskMentor?: () => void;
  mentorBusy?: boolean;
}) {
  const [confirm, setConfirm] = useState(false);
  const time = new Date(entry.ts).toLocaleTimeString("sk-SK", { hour: "2-digit", minute: "2-digit" });
  const itemLabel =
    entry.itemCount == null ? null : entry.itemCount >= 5 ? "5+ položiek" : `${entry.itemCount} položiek`;

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">{OUTCOME_LABELS[entry.outcome]}</span>
          {itemLabel && <span className="text-zinc-500">{itemLabel}</span>}
          {entry.askedReview ? <span className="text-zinc-500">recenzia ✔</span> : null}
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
        {entry.requestText && <div>📋 požiadavka: {entry.requestText}</div>}
        {entry.priceTiming && (
          <div>💶 {PRICE_TIMING_LABELS[entry.priceTiming] ?? entry.priceTiming}</div>
        )}
        {entry.objection && <div>🥊 námietka: {entry.objection}</div>}
        {entry.objectionReaction && entry.objectionReaction !== "none" && (
          <div className="text-zinc-500">
            (staré) reakcia: {OBJECTION_REACTION_LABELS[entry.objectionReaction] ?? entry.objectionReaction}
          </div>
        )}
        {entry.hadNextStepPlan && (
          <div>🧭 {NEXT_STEP_PLAN_LABELS[entry.hadNextStepPlan] ?? entry.hadNextStepPlan}</div>
        )}
        {entry.want && <div>🎯 chcel: {entry.want}</div>}
        {entry.fear && <div>😟 bál sa: {entry.fear}</div>}
        {entry.why && <div>💡 prečo: {entry.why}</div>}
        {(entry.pluses ?? []).map((p, i) => (
          <div key={`p-${i}`} className="text-emerald-700 dark:text-emerald-400">
            ➕ {p}
          </div>
        ))}
        {entry.plus && <div className="text-emerald-700 dark:text-emerald-400">➕ {entry.plus}</div>}
        {(entry.minuses ?? []).map((m, i) => (
          <div key={`m-${i}`} className="text-red-700 dark:text-red-400">
            ➖ {m}
          </div>
        ))}
        {entry.minus && <div className="text-red-700 dark:text-red-400">➖ {entry.minus}</div>}
        {entry.note && <div>📝 {entry.note}</div>}
      </div>
      {onAskMentor && (
        <div className="mt-2">
          <button
            type="button"
            onClick={onAskMentor}
            disabled={mentorBusy}
            className="text-xs font-medium text-indigo-600 hover:underline disabled:opacity-50 dark:text-indigo-400"
          >
            {mentorBusy ? "Mentor pripravuje…" : "Spýtaj sa mentora na tento predaj"}
          </button>
        </div>
      )}
    </div>
  );
}
