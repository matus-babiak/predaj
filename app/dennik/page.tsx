"use client";

import { useRef, useState } from "react";
import { useData } from "@/lib/useData";
import { dayKey } from "@/lib/gamify";
import { getWeek } from "@/content/program";
import type { Reflection } from "@/lib/types";
import { Btn, Card, Label, SectionTitle, TextArea } from "@/components/ui";

export default function DennikPage() {
  const { reflections, progress, put, ready } = useData();
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const today = dayKey(Date.now());
  const week = getWeek(progress.currentWeek);
  const existing = reflections.find((r) => r.date === today);

  const [answers, setAnswers] = useState<Record<string, string>>(existing?.answers ?? {});
  const [focus, setFocus] = useState(existing?.focus ?? "");
  const [editing, setEditing] = useState(false);
  const [reflSaved, setReflSaved] = useState(false);

  const startEdit = (r?: Reflection) => {
    const src = r ?? existing;
    setAnswers(src?.answers ?? {});
    setFocus(src?.focus ?? "");
    setEditing(true);
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const cancelEdit = () => {
    setAnswers(existing?.answers ?? {});
    setFocus(existing?.focus ?? "");
    setEditing(false);
  };

  const saveReflection = () => {
    const now = Date.now();
    const r: Reflection = {
      id: today,
      date: today,
      weekId: week?.id ?? "w1",
      answers,
      focus: focus.trim() || undefined,
      updatedAt: now,
    };
    put("reflections", r);
    setEditing(false);
    setReflSaved(true);
    setTimeout(() => setReflSaved(false), 2500);
    requestAnimationFrame(() => {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  if (!ready) return null;

  const savedList = reflections.slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const showForm = editing || !existing;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Denník</h1>

      <div ref={formRef} className="scroll-mt-24">
        {showForm ? (
          <Card>
            <div id="reflexia" className="scroll-mt-24" />
            <SectionTitle>
              Večerná reflexia, {new Date().toLocaleDateString("sk-SK", { day: "numeric", month: "long" })}
              {existing ? " · úprava" : ""}
            </SectionTitle>
            <div className="space-y-4">
              {(week?.reflection ?? []).map((q) => (
                <div key={q}>
                  <Label>{q}</Label>
                  <TextArea
                    rows={2}
                    value={answers[q] ?? ""}
                    onChange={(e) => setAnswers({ ...answers, [q]: e.target.value })}
                  />
                </div>
              ))}
              <div>
                <Label>Čo chcem zajtra zlepšiť?</Label>
                <TextArea rows={2} value={focus} onChange={(e) => setFocus(e.target.value)} />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Btn onClick={saveReflection}>{existing ? "Uložiť zmeny" : "Uložiť reflexiu"}</Btn>
                {existing && (
                  <Btn variant="ghost" onClick={cancelEdit}>
                    Zrušiť
                  </Btn>
                )}
                {reflSaved && <span className="text-sm text-emerald-600">Uložené ✔</span>}
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div id="reflexia" className="scroll-mt-24" />
            <SectionTitle>
              Večerná reflexia, {new Date().toLocaleDateString("sk-SK", { day: "numeric", month: "long" })}
            </SectionTitle>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Dnešná reflexia je uložená. Na zmenu použi{" "}
              <button
                type="button"
                onClick={() => startEdit()}
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Upraviť
              </button>
              .
            </p>
            {reflSaved && <p className="mt-2 text-sm text-emerald-600">Uložené ✔</p>}
          </Card>
        )}
      </div>

      {savedList.length > 0 && (
        <div ref={listRef} className="scroll-mt-24">
          <SectionTitle>Uložené reflexie</SectionTitle>
          <div className="space-y-3">
            {savedList.map((r) => (
              <ReflectionCard
                key={r.id}
                reflection={r}
                isToday={r.date === today}
                onEdit={r.date === today ? () => startEdit(r) : undefined}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ReflectionCard({
  reflection,
  isToday,
  onEdit,
}: {
  reflection: Reflection;
  isToday?: boolean;
  onEdit?: () => void;
}) {
  const dateLabel = new Date(reflection.date).toLocaleDateString("sk-SK", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const answers = Object.entries(reflection.answers ?? {}).filter(([, v]) => String(v ?? "").trim());

  return (
    <Card className={isToday ? "border-indigo-300 dark:border-indigo-800" : undefined}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-sm font-medium capitalize text-zinc-500 dark:text-zinc-400">
          <span>{dateLabel}</span>
          {isToday && (
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold normal-case text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              dnes
            </span>
          )}
        </div>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Upraviť
          </button>
        )}
      </div>
      <div className="space-y-3 text-sm">
        {answers.map(([q, a]) => (
          <div key={q}>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">{q}</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{a}</p>
          </div>
        ))}
        {reflection.focus?.trim() && (
          <div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300">Čo chcem zajtra zlepšiť?</div>
            <p className="mt-0.5 whitespace-pre-wrap text-zinc-600 dark:text-zinc-400">{reflection.focus}</p>
          </div>
        )}
        {answers.length === 0 && !reflection.focus?.trim() && (
          <p className="text-zinc-400">Bez vyplneného textu.</p>
        )}
      </div>
    </Card>
  );
}
