"use client";

import { useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import type { Note } from "@/lib/types";
import { Btn, Card, Input } from "@/components/ui";

function formatDay(ts: number): string {
  return new Date(ts).toLocaleDateString("sk-SK", { day: "numeric", month: "short", year: "numeric" });
}

export default function PoznamkyPage() {
  const { notes, put, remove, ready } = useData();
  const [text, setText] = useState("");
  const [tab, setTab] = useState<"open" | "done">("open");

  if (!ready) return null;

  const open = notes.filter((n) => !n.doneAt);
  const done = notes.filter((n) => n.doneAt).sort((a, b) => (b.doneAt ?? 0) - (a.doneAt ?? 0));
  const list = tab === "open" ? open : done;

  const add = () => {
    const t = text.trim();
    if (!t) return;
    const now = Date.now();
    put("notes", { id: uid(), ts: now, text: t, updatedAt: now } satisfies Note);
    setText("");
  };

  const markDone = (n: Note) => {
    const now = Date.now();
    put("notes", { ...n, doneAt: now, updatedAt: now });
  };

  const reopen = (n: Note) => {
    const now = Date.now();
    put("notes", { ...n, doneAt: undefined, updatedAt: now });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Poznámky</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Rýchle dôležité veci. Pridaj poznámku, označ ako vybavenú alebo zmaž.
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
            placeholder="napr. zavolať dodávateľovi ohľadom batérií"
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
          Vybavené ({done.length})
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {tab === "open" ? "Žiadne otvorené poznámky." : "Zatiaľ žiadne vybavené poznámky."}
        </p>
      ) : (
        <div className="space-y-2">
          {list.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onDone={() => markDone(n)}
              onReopen={() => reopen(n)}
              onDelete={() => remove("notes", n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function NoteCard({
  note,
  onDone,
  onReopen,
  onDelete,
}: {
  note: Note;
  onDone: () => void;
  onReopen: () => void;
  onDelete: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const done = !!note.doneAt;

  return (
    <div
      className={`rounded-xl border p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900 ${
        done
          ? "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20"
          : "border-zinc-200 bg-white"
      }`}
    >
      <div className={`text-zinc-800 dark:text-zinc-200 ${done ? "line-through opacity-70" : "font-medium"}`}>
        {note.text}
      </div>
      <div className="mt-2 flex items-center justify-between gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <span>{done ? `vybavené ${formatDay(note.doneAt!)}` : formatDay(note.ts)}</span>
        <span className="flex items-center gap-3">
          {!done ? (
            <button
              type="button"
              onClick={onDone}
              className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
            >
              vybavené
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
