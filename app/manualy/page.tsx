"use client";

import { useEffect, useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import type { Manual } from "@/lib/types";
import { Btn, Card, Input, TextArea } from "@/components/ui";

const SEED_TITLE = "Zisťovanie";
const SEED_ID = "manual-zistovanie";

export default function ManualyPage() {
  const { manuals, put, remove, ready } = useData();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftBody, setDraftBody] = useState("");
  const [adding, setAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  // Predvolený manuál Zisťovanie raz (stabilné id, aby React Strict Mode nevytvoril duplikát)
  useEffect(() => {
    if (!ready) return;
    if (manuals.some((m) => m.id === SEED_ID)) return;
    if (manuals.length > 0) return;
    const now = Date.now();
    put("manuals", {
      id: SEED_ID,
      title: SEED_TITLE,
      body: "",
      order: 0,
      updatedAt: now,
    } satisfies Manual);
    setActiveId(SEED_ID);
  }, [ready, manuals, put]);

  // Zmaž duplicitné „Zisťovanie“ vzniknuté starým seedom (rôzne id)
  useEffect(() => {
    if (!ready) return;
    const zist = manuals.filter((m) => m.title === SEED_TITLE);
    if (zist.length < 2) return;
    const keep = zist.find((m) => m.id === SEED_ID) ?? zist.slice().sort((a, b) => a.updatedAt - b.updatedAt)[0];
    for (const m of zist) {
      if (m.id !== keep.id) remove("manuals", m.id);
    }
  }, [ready, manuals, remove]);

  useEffect(() => {
    if (!ready || manuals.length === 0) return;
    if (!activeId || !manuals.some((m) => m.id === activeId)) {
      setActiveId(manuals[0].id);
    }
  }, [ready, manuals, activeId]);

  if (!ready) return null;

  const active = manuals.find((m) => m.id === activeId) ?? null;

  const startEdit = () => {
    if (!active) return;
    setDraftTitle(active.title);
    setDraftBody(active.body);
    setEditing(true);
  };

  const saveEdit = () => {
    if (!active) return;
    const title = draftTitle.trim() || active.title;
    put("manuals", {
      ...active,
      title,
      body: draftBody,
      updatedAt: Date.now(),
    });
    setEditing(false);
  };

  const addManual = () => {
    const title = newTitle.trim();
    if (!title) return;
    const now = Date.now();
    const m: Manual = {
      id: uid(),
      title,
      body: "",
      order: manuals.length,
      updatedAt: now,
    };
    put("manuals", m);
    setNewTitle("");
    setAdding(false);
    setActiveId(m.id);
    setDraftTitle(m.title);
    setDraftBody("");
    setEditing(true);
  };

  const deleteActive = () => {
    if (!active) return;
    remove("manuals", active.id);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Manuály</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Vzdelávacie poznámky zo školení. Vyber tab a otvorí sa celý obsah manuálu.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {manuals.map((m) => {
          const on = m.id === activeId;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setActiveId(m.id);
                setEditing(false);
              }}
              className={`rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                on
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-zinc-300 bg-white text-zinc-700 hover:border-indigo-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
              }`}
            >
              {m.title}
            </button>
          );
        })}
        {!adding ? (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="rounded-xl border border-dashed border-zinc-300 px-3 py-2 text-sm text-zinc-500 hover:border-indigo-400 hover:text-indigo-600 dark:border-zinc-700"
          >
            + manuál
          </button>
        ) : (
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              addManual();
            }}
          >
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Názov manuálu"
              autoFocus
              className="w-40 sm:w-56"
            />
            <Btn type="submit" disabled={!newTitle.trim()}>
              Pridať
            </Btn>
            <Btn
              type="button"
              variant="ghost"
              onClick={() => {
                setAdding(false);
                setNewTitle("");
              }}
            >
              Zrušiť
            </Btn>
          </form>
        )}
      </div>

      {!active ? (
        <p className="text-sm text-zinc-400">Žiadny manuál. Pridaj prvý tab hore.</p>
      ) : editing ? (
        <Card>
          <Input value={draftTitle} onChange={(e) => setDraftTitle(e.target.value)} placeholder="Názov" />
          <TextArea
            className="mt-3"
            rows={16}
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            placeholder="Sem si napíš prehľad zo školenia, postupy, otázky, čo si sa naučil…"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            <Btn onClick={saveEdit}>Uložiť</Btn>
            <Btn variant="ghost" onClick={() => setEditing(false)}>
              Zrušiť
            </Btn>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-xl font-semibold">{active.title}</h2>
            <div className="flex gap-3 text-sm">
              <button
                type="button"
                onClick={startEdit}
                className="font-medium text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Upraviť
              </button>
              {manuals.length > 1 && (
                <DeleteManual onDelete={deleteActive} />
              )}
            </div>
          </div>
          {active.body.trim() ? (
            <div className="mt-4 whitespace-pre-wrap text-[15px] leading-relaxed text-zinc-700 dark:text-zinc-300">
              {active.body}
            </div>
          ) : (
            <p className="mt-4 text-sm text-zinc-400 dark:text-zinc-500">
              Manuál je zatiaľ prázdny. Klikni na Upraviť a doplň poznámky zo školenia.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

function DeleteManual({ onDelete }: { onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  if (!confirm) {
    return (
      <button type="button" onClick={() => setConfirm(true)} className="text-zinc-400 hover:text-red-600">
        zmazať
      </button>
    );
  }
  return (
    <span className="flex gap-2 text-xs">
      <button type="button" onClick={onDelete} className="font-medium text-red-600">
        naozaj zmazať
      </button>
      <button type="button" onClick={() => setConfirm(false)} className="text-zinc-500">
        nie
      </button>
    </span>
  );
}
