"use client";

import { useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import type { StudyTopic } from "@/lib/types";
import { Btn, Card, TextArea } from "@/components/ui";

function formatDay(ts: number): string {
  return new Date(ts).toLocaleDateString("sk-SK", { day: "numeric", month: "short", year: "numeric" });
}

export default function HardverPage() {
  const { studyTopics, put, remove, ready } = useData();
  const [raw, setRaw] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<"open" | "done">("open");

  if (!ready) return null;

  const open = studyTopics.filter((t) => !t.doneAt);
  const done = studyTopics.filter((t) => t.doneAt);
  const list = tab === "open" ? open : done;

  const submit = async () => {
    const text = raw.trim();
    if (!text) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/mentor/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rawText: text }),
      });
      const json = (await res.json()) as {
        data: { title: string; situation?: string; learnPoints: string[]; whatsGo?: string } | null;
      };
      if (!json.data) {
        setError(true);
        return;
      }
      const now = Date.now();
      const topic: StudyTopic = {
        id: uid(),
        ts: now,
        rawText: text,
        title: json.data.title,
        situation: json.data.situation,
        learnPoints: json.data.learnPoints,
        whatsGo: json.data.whatsGo,
        updatedAt: now,
      };
      put("studyTopics", topic);
      setRaw("");
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Hardvér</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Hardvérové a produktové veci, ktoré si potrebuješ doštudovať. Napíš situáciu vlastnými slovami, AI ti
          dá nadpis, checklist a „čo ísť študovať“.
        </p>
      </div>

      <Card>
        <TextArea
          rows={4}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          placeholder="napr. zákazník sa pýtal na zdravie batérie iPhonu a ja som nevedel vysvetliť cykly vs. kapacitu…"
        />
        {error && (
          <p className="mt-2 text-xs text-red-500">AI momentálne nie je dostupná, skús to neskôr.</p>
        )}
        <Btn className="mt-3" onClick={submit} disabled={loading || !raw.trim()}>
          {loading ? "Spracúvam…" : "Spracovať cez AI"}
        </Btn>
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
          Na štúdium ({open.length})
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
          Naštudované ({done.length})
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          {tab === "open" ? "Zatiaľ žiadna téma. Pridaj prvú hore." : "Zatiaľ nič označené ako naštudované."}
        </p>
      ) : (
        <div className="space-y-3">
          {list.map((t) => (
            <StudyCard
              key={t.id}
              topic={t}
              onDone={() => put("studyTopics", { ...t, doneAt: Date.now(), updatedAt: Date.now() })}
              onReopen={() => put("studyTopics", { ...t, doneAt: undefined, updatedAt: Date.now() })}
              onDelete={() => remove("studyTopics", t.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StudyCard({
  topic,
  onDone,
  onReopen,
  onDelete,
}: {
  topic: StudyTopic;
  onDone: () => void;
  onReopen: () => void;
  onDelete: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const [showRaw, setShowRaw] = useState(false);
  const done = !!topic.doneAt;

  return (
    <Card className={done ? "opacity-80" : undefined}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{topic.title ?? "Bez názvu"}</h2>
        <span className="text-xs text-zinc-400">{formatDay(topic.ts)}</span>
      </div>

      {topic.situation && (
        <div className="mt-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Čo si riešil</div>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{topic.situation}</p>
        </div>
      )}

      {topic.learnPoints && topic.learnPoints.length > 0 && (
        <div className="mt-3">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400">Čo sa naučiť / pozrieť</div>
          <ul className="mt-1 list-disc space-y-1 pl-5 text-sm text-zinc-700 dark:text-zinc-300">
            {topic.learnPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {topic.whatsGo && (
        <div className="mt-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 dark:border-indigo-900 dark:bg-indigo-950/30">
          <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700 dark:text-indigo-400">
            What&apos;s Go
          </div>
          <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{topic.whatsGo}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => setShowRaw(!showRaw)}
        className="mt-3 text-xs text-indigo-600 hover:underline dark:text-indigo-400"
      >
        {showRaw ? "Skryť pôvodný text" : "Pôvodný text"}
      </button>
      {showRaw && (
        <p className="mt-1 whitespace-pre-wrap rounded-lg bg-zinc-100 p-2 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {topic.rawText}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
        {!done ? (
          <button type="button" onClick={onDone} className="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
            naštudované
          </button>
        ) : (
          <button type="button" onClick={onReopen} className="hover:text-amber-600">
            vrátiť na štúdium
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
      </div>
    </Card>
  );
}
