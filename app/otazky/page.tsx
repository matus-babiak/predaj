"use client";

// Otázky, banka otázok, ktoré chcem zodpovedať.
// Nová otázka čaká medzi otvorenými; po napísaní odpovede sa presunie
// medzi zodpovedané, kde sa dá odpoveď kedykoľvek prečítať aj upraviť.

import { useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import type { Question } from "@/lib/types";
import { Btn, Card, Input, TextArea } from "@/components/ui";

function formatDay(ts: number): string {
  return new Date(ts).toLocaleDateString("sk-SK", { day: "numeric", month: "short", year: "numeric" });
}

export default function OtazkyPage() {
  const { questions, put, remove, ready } = useData();
  const [tab, setTab] = useState<"open" | "answered">("open");
  const [text, setText] = useState("");

  if (!ready) return null;

  const open = questions.filter((q) => !q.answer);
  const answered = questions
    .filter((q) => q.answer)
    .slice()
    .sort((a, b) => (b.answeredAt ?? b.ts) - (a.answeredAt ?? a.ts));

  const addQuestion = () => {
    const t = text.trim();
    if (!t) return;
    const now = Date.now();
    put("questions", { id: uid(), ts: now, text: t, updatedAt: now } satisfies Question);
    setText("");
  };

  const saveAnswer = (q: Question, answer: string) => {
    const now = Date.now();
    put("questions", { ...q, answer, answeredAt: q.answeredAt ?? now, updatedAt: now });
  };

  const reopen = (q: Question) => {
    const now = Date.now();
    put("questions", { ...q, answer: undefined, answeredAt: undefined, updatedAt: now });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Otázky</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Zoznam otázok, na ktoré si chceš nájsť odpoveď. Keď odpoveď máš, napíš ju a otázka sa presunie
          medzi zodpovedané, kedykoľvek sa k nej vieš vrátiť.
        </p>
      </div>

      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addQuestion();
          }}
          className="flex gap-2"
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="napr. Ako zistím rozpočet bez toho, aby to znelo dotieravo?"
          />
          <Btn type="submit" disabled={!text.trim()}>
            Pridať
          </Btn>
        </form>
      </Card>

      {/* Mobilné taby, na desktope sú stĺpce vedľa seba, taby netreba */}
      <div className="grid grid-cols-2 gap-2 md:hidden">
        <button
          type="button"
          onClick={() => setTab("open")}
          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
            tab === "open"
              ? "border-amber-600 bg-amber-600 text-white"
              : "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400"
          }`}
        >
          ❓ Otvorené ({open.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("answered")}
          className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
            tab === "answered"
              ? "border-emerald-600 bg-emerald-600 text-white"
              : "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400"
          }`}
        >
          ✅ Zodpovedané ({answered.length})
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <div className={tab === "open" ? "" : "hidden md:block"}>
          <Card className="border-amber-300 dark:border-amber-900">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
              ❓ Otvorené ({open.length})
            </h2>
            {open.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">Žiadne otvorené otázky, pridaj si novú hore.</p>
            ) : (
              <ul className="space-y-2">
                {open.map((q) => (
                  <OpenQuestion key={q.id} q={q} onAnswer={saveAnswer} onDelete={() => remove("questions", q.id)} />
                ))}
              </ul>
            )}
          </Card>
        </div>

        <div className={tab === "answered" ? "" : "hidden md:block"}>
          <Card className="border-emerald-300 dark:border-emerald-900">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              ✅ Zodpovedané ({answered.length})
            </h2>
            {answered.length === 0 ? (
              <p className="text-sm text-zinc-400 dark:text-zinc-500">Zatiaľ žiadna zodpovedaná otázka.</p>
            ) : (
              <ul className="space-y-2">
                {answered.map((q) => (
                  <AnsweredQuestion
                    key={q.id}
                    q={q}
                    onSave={saveAnswer}
                    onReopen={() => reopen(q)}
                    onDelete={() => remove("questions", q.id)}
                  />
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  return !confirm ? (
    <button onClick={() => setConfirm(true)} className="hover:text-red-600">
      zmazať
    </button>
  ) : (
    <span className="flex gap-2">
      <button onClick={onDelete} className="font-medium text-red-600">
        naozaj zmazať
      </button>
      <button onClick={() => setConfirm(false)} className="text-zinc-500">
        nie
      </button>
    </span>
  );
}

function OpenQuestion({
  q,
  onAnswer,
  onDelete,
}: {
  q: Question;
  onAnswer: (q: Question, answer: string) => void;
  onDelete: () => void;
}) {
  const [writing, setWriting] = useState(false);
  const [answer, setAnswer] = useState("");

  const save = () => {
    const a = answer.trim();
    if (!a) return;
    onAnswer(q, a);
    setWriting(false);
    setAnswer("");
  };

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="font-medium text-zinc-800 dark:text-zinc-200">{q.text}</div>
      {writing && (
        <div className="mt-2 space-y-2">
          <TextArea
            rows={3}
            autoFocus
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Tvoja odpoveď…"
          />
          <div className="flex gap-2">
            <Btn onClick={save} disabled={!answer.trim()}>
              Uložiť odpoveď
            </Btn>
            <Btn variant="ghost" onClick={() => setWriting(false)}>
              Zrušiť
            </Btn>
          </div>
        </div>
      )}
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <span>{formatDay(q.ts)}</span>
        <span className="flex items-center gap-3">
          {!writing && (
            <button
              onClick={() => setWriting(true)}
              className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              ✍️ Odpovedať
            </button>
          )}
          <DeleteButton onDelete={onDelete} />
        </span>
      </div>
    </li>
  );
}

function AnsweredQuestion({
  q,
  onSave,
  onReopen,
  onDelete,
}: {
  q: Question;
  onSave: (q: Question, answer: string) => void;
  onReopen: () => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [answer, setAnswer] = useState(q.answer ?? "");

  const save = () => {
    const a = answer.trim();
    if (!a) return;
    onSave(q, a);
    setEditing(false);
  };

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="font-medium text-zinc-800 dark:text-zinc-200">{q.text}</div>
      {!editing ? (
        <div className="mt-1.5 whitespace-pre-wrap rounded-lg bg-emerald-50 p-2 text-zinc-700 dark:bg-emerald-950/30 dark:text-zinc-300">
          {q.answer}
        </div>
      ) : (
        <div className="mt-2 space-y-2">
          <TextArea rows={3} autoFocus value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <div className="flex gap-2">
            <Btn onClick={save} disabled={!answer.trim()}>
              Uložiť
            </Btn>
            <Btn
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setAnswer(q.answer ?? "");
              }}
            >
              Zrušiť
            </Btn>
          </div>
        </div>
      )}
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <span>zodpovedané {formatDay(q.answeredAt ?? q.ts)}</span>
        {!editing && (
          <span className="flex items-center gap-3">
            <button
              onClick={() => setEditing(true)}
              className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
            >
              upraviť
            </button>
            <button onClick={onReopen} className="hover:text-amber-600">
              vrátiť medzi otvorené
            </button>
            <DeleteButton onDelete={onDelete} />
          </span>
        )}
      </div>
    </li>
  );
}
