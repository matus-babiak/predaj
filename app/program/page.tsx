"use client";

import { useState } from "react";
import { useData } from "@/lib/useData";
import { WEEKS, PHASES, type Week } from "@/content/program";
import { Btn, Card, RichText, SectionTitle } from "@/components/ui";
import type { Progress } from "@/lib/types";

export default function ProgramPage() {
  const { progress, daysInCurrentWeek, put, ready } = useData();
  const [openWeek, setOpenWeek] = useState<number | null>(null);
  if (!ready) return null;

  const isDone = (w: Week) => progress.completedWeeks.includes(w.num);
  const isCurrent = (w: Week) => w.num === progress.currentWeek && !isDone(w);
  const isLocked = (w: Week) => w.num > progress.currentWeek && !isDone(w);

  const markRead = (w: Week) => {
    if (progress.readLessons.includes(w.id)) return;
    const next: Progress = { ...progress, readLessons: [...progress.readLessons, w.id], updatedAt: Date.now() };
    put("progress", next);
  };

  const completeWeek = (w: Week) => {
    const now = Date.now();
    const next: Progress = {
      ...progress,
      completedWeeks: [...new Set([...progress.completedWeeks, w.num])],
      currentWeek: Math.min(12, w.num + 1),
      weekStarts: { ...progress.weekStarts, [String(w.num + 1)]: now },
      updatedAt: now,
    };
    put("progress", next);
    setOpenWeek(null);
  };

  const doneCount = progress.completedWeeks.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">12-týždňový program</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ideš vlastným tempom — ďalší týždeň sa odomkne, keď dokončíš aktuálny.
        </p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div className="h-full rounded-full bg-indigo-600 transition-all" style={{ width: `${(doneCount / 12) * 100}%` }} />
        </div>
        <div className="mt-1 text-xs text-zinc-500">{doneCount}/12 týždňov dokončených</div>
      </div>

      {PHASES.map((phase) => (
        <div key={phase.num}>
          <SectionTitle>
            Fáza {phase.num} — {phase.title}
          </SectionTitle>
          <p className="mb-3 -mt-2 text-sm text-zinc-500 dark:text-zinc-400">{phase.goal}</p>
          <div className="space-y-3">
            {WEEKS.filter((w) => w.phase === phase.num).map((w) => {
              const open = openWeek === w.num;
              const lessonRead = progress.readLessons.includes(w.id);
              return (
                <Card key={w.id} className={isLocked(w) ? "opacity-50" : ""}>
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-2 text-left"
                    onClick={() => !isLocked(w) && setOpenWeek(open ? null : w.num)}
                  >
                    <div>
                      <div className="text-sm text-zinc-500 dark:text-zinc-400">Týždeň {w.num}</div>
                      <div className="font-semibold">{w.title}</div>
                    </div>
                    <div className="text-xl">
                      {isDone(w) ? "✅" : isCurrent(w) ? "▶️" : isLocked(w) ? "🔒" : "📖"}
                    </div>
                  </button>

                  {open && !isLocked(w) && (
                    <div className="mt-4 space-y-4 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                      <div className="space-y-3 text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {w.lesson.map((p, i) => (
                          <p key={i}>
                            <RichText text={p} />
                          </p>
                        ))}
                      </div>

                      <div className="rounded-xl bg-indigo-50 p-3 text-sm dark:bg-indigo-950/40">
                        <span className="font-semibold">Úloha týždňa: </span>
                        <RichText text={w.task} />
                      </div>

                      {isCurrent(w) && (
                        <div className="space-y-3">
                          {!lessonRead ? (
                            <Btn onClick={() => markRead(w)} variant="ghost">
                              ✔ Lekciu som si prečítal
                            </Btn>
                          ) : (
                            <div className="text-sm text-emerald-600">Lekcia prečítaná ✔</div>
                          )}
                          <div className="text-sm text-zinc-600 dark:text-zinc-400">
                            Dni so záznamom v tomto týždni: <b>{Math.min(daysInCurrentWeek, w.minDays)}/{w.minDays}</b>
                          </div>
                          <div className="flex items-center gap-3">
                            <Btn
                              onClick={() => completeWeek(w)}
                              disabled={!lessonRead || daysInCurrentWeek < w.minDays}
                            >
                              Dokončiť týždeň {w.num}
                            </Btn>
                            {(!lessonRead || daysInCurrentWeek < w.minDays) && (
                              <ForceComplete onConfirm={() => completeWeek(w)} />
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function ForceComplete({ onConfirm }: { onConfirm: () => void }) {
  const [asking, setAsking] = useState(false);
  return !asking ? (
    <button type="button" onClick={() => setAsking(true)} className="text-xs text-zinc-400 hover:underline">
      dokončiť aj tak
    </button>
  ) : (
    <span className="flex items-center gap-2 text-xs">
      <span className="text-zinc-500">Naozaj? Program funguje najlepšie s praxou.</span>
      <button type="button" onClick={onConfirm} className="font-medium text-indigo-600">áno</button>
      <button type="button" onClick={() => setAsking(false)} className="text-zinc-500">nie</button>
    </span>
  );
}
