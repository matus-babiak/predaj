"use client";

// Plusy a mínusy — prehľad sebahodnotení (SW analýza).
// Zbiera plusy/mínusy zo záznamov v denníku + samostatne pridané položky.

import { useState } from "react";
import Link from "next/link";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import type { SelfNote } from "@/lib/types";
import { Btn, Card, Input, SectionTitle } from "@/components/ui";

interface SwItem {
  id: string;
  ts: number;
  text: string;
  fromDiary: boolean;
  noteId?: string; // id v selfNotes — len samostatné položky (dajú sa zmazať)
}

function formatDay(ts: number): string {
  return new Date(ts).toLocaleDateString("sk-SK", { day: "numeric", month: "short", year: "numeric" });
}

export default function PlusyMinusyPage() {
  const { entries, selfNotes, put, remove, ready } = useData();

  if (!ready) return null;

  const collect = (kind: "plus" | "minus"): SwItem[] => {
    const fromEntries: SwItem[] = entries
      .filter((e) => (kind === "plus" ? e.plus : e.minus))
      .map((e) => ({
        id: `${e.id}-${kind}`,
        ts: e.ts,
        text: (kind === "plus" ? e.plus : e.minus)!,
        fromDiary: true,
      }));
    const standalone: SwItem[] = selfNotes
      .filter((n) => n.kind === kind)
      .map((n) => ({ id: n.id, ts: n.ts, text: n.text, fromDiary: false, noteId: n.id }));
    return [...fromEntries, ...standalone].sort((a, b) => b.ts - a.ts);
  };

  const pluses = collect("plus");
  const minuses = collect("minus");

  const addNote = (kind: "plus" | "minus", text: string) => {
    const now = Date.now();
    const note: SelfNote = { id: uid(), ts: now, kind, text, updatedAt: now };
    put("selfNotes", note);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Plusy a mínusy</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Tvoja analýza silných a slabých stránok. Plusy a mínusy sa sem zbierajú zo{" "}
          <Link href="/dennik" className="text-indigo-600 hover:underline dark:text-indigo-400">
            záznamov v denníku
          </Link>{" "}
          a môžeš ich pridávať aj priamo tu.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:items-start">
        <SwColumn
          title={`➕ Plusy — čo robím dobre (${pluses.length})`}
          tone="plus"
          items={pluses}
          placeholder="napr. viem počúvať, čo zákazník naozaj potrebuje"
          onAdd={(text) => addNote("plus", text)}
          onDelete={(noteId) => remove("selfNotes", noteId)}
        />
        <SwColumn
          title={`➖ Mínusy — čo mám zlepšiť (${minuses.length})`}
          tone="minus"
          items={minuses}
          placeholder="napr. príliš rýchlo prechádzam k cene"
          onAdd={(text) => addNote("minus", text)}
          onDelete={(noteId) => remove("selfNotes", noteId)}
        />
      </div>

      {pluses.length === 0 && minuses.length === 0 && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Zatiaľ tu nič nie je. Pri každom zázname v denníku vyplň „Moje plus“ a „Moje mínus“ — alebo pridaj
          položku rovno tu hore.
        </p>
      )}
    </div>
  );
}

function SwColumn({
  title,
  tone,
  items,
  placeholder,
  onAdd,
  onDelete,
}: {
  title: string;
  tone: "plus" | "minus";
  items: SwItem[];
  placeholder: string;
  onAdd: (text: string) => void;
  onDelete: (noteId: string) => void;
}) {
  const [text, setText] = useState("");

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onAdd(t);
    setText("");
  };

  const accent =
    tone === "plus"
      ? "border-emerald-200 dark:border-emerald-900"
      : "border-red-200 dark:border-red-900";

  return (
    <Card className={accent}>
      <SectionTitle>{title}</SectionTitle>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
        className="mb-4 flex gap-2"
      >
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
        <Btn type="submit" disabled={!text.trim()}>
          Pridať
        </Btn>
      </form>
      {items.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">Zatiaľ prázdne.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <SwRow key={item.id} item={item} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </Card>
  );
}

function SwRow({ item, onDelete }: { item: SwItem; onDelete: (noteId: string) => void }) {
  const [confirm, setConfirm] = useState(false);

  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="text-zinc-800 dark:text-zinc-200">{item.text}</div>
      <div className="mt-1 flex items-center justify-between gap-2 text-xs text-zinc-400 dark:text-zinc-500">
        <span>
          {formatDay(item.ts)}
          {item.fromDiary && " · z denníka"}
        </span>
        {item.noteId &&
          (!confirm ? (
            <button onClick={() => setConfirm(true)} className="hover:text-red-600">
              zmazať
            </button>
          ) : (
            <span className="flex gap-2">
              <button onClick={() => onDelete(item.noteId!)} className="font-medium text-red-600">
                naozaj zmazať
              </button>
              <button onClick={() => setConfirm(false)} className="text-zinc-500">
                nie
              </button>
            </span>
          ))}
      </div>
    </li>
  );
}
