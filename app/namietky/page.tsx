"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import { OBJECTIONS, OBJECTION_CATEGORIES, type Objection } from "@/content/objections";
import type { ObjAttempt, UserObjection } from "@/lib/types";
import { Btn, Card, Input, Label, SectionTitle, TextArea } from "@/components/ui";
import DeepLinkParam from "@/components/DeepLinkParam";

interface TrainItem {
  id: string;
  text: string;
  category: string;
  meaning?: string;
  uznaj?: string;
  zisti?: string;
  odpovedz?: string;
  hlbka?: string;
  custom?: boolean;
}

function toTrainItems(userObjections: UserObjection[]): TrainItem[] {
  const base: TrainItem[] = OBJECTIONS.map((o) => ({ ...o }));
  const custom: TrainItem[] = userObjections.map((u) => ({
    id: u.id,
    text: u.text,
    category: "vlastné",
    meaning: u.meaning,
    odpovedz: u.approach,
    custom: true,
  }));
  return [...base, ...custom];
}

function stats(attempts: ObjAttempt[], objectionId: string) {
  const list = attempts.filter((a) => a.objectionId === objectionId);
  const avg = list.length ? list.reduce((s, a) => s + a.rating, 0) / list.length : null;
  const last = list.length ? Math.max(...list.map((a) => a.ts)) : 0;
  return { count: list.length, avg, last };
}

/** Vyber ďalšiu námietku: slabšie a menej trénované chodia častejšie. */
function pickNext(items: TrainItem[], attempts: ObjAttempt[], excludeId?: string): TrainItem {
  const scored = items
    .filter((i) => i.id !== excludeId)
    .map((i) => {
      const s = stats(attempts, i.id);
      // nižšie skóre = vyššia priorita; netrénované majú avg 1.8
      const avg = s.avg ?? 1.8;
      const recency = s.last ? Math.min(1, (Date.now() - s.last) / (3 * 24 * 3600 * 1000)) : 1;
      return { item: i, score: avg - recency };
    })
    .sort((a, b) => a.score - b.score);
  const pool = scored.slice(0, Math.min(5, scored.length));
  return pool[Math.floor(Math.random() * pool.length)].item;
}

export default function NamietkyPage() {
  const { objAttempts, userObjections, put, remove, ready } = useData();
  const items = useMemo(() => toTrainItems(userObjections), [userObjections]);

  const [current, setCurrent] = useState<TrainItem | null>(null);
  const [answer, setAnswer] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [doneMsg, setDoneMsg] = useState(false);
  const [filter, setFilter] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [revealDeep, setRevealDeep] = useState(false);

  useEffect(() => {
    if (!openId) return;
    const el = document.getElementById(`obj-${openId}`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [openId]);

  if (!ready) return null;

  const start = () => {
    setCurrent(pickNext(items, objAttempts, current?.id));
    setAnswer("");
    setRevealed(false);
    setDoneMsg(false);
    setRevealDeep(false);
  };

  const rate = (rating: 1 | 2 | 3) => {
    if (!current) return;
    const now = Date.now();
    const attempt: ObjAttempt = {
      id: uid(),
      objectionId: current.id,
      ts: now,
      answer: answer.trim(),
      rating,
      updatedAt: now,
    };
    put("objAttempts", attempt);
    setDoneMsg(true);
    setTimeout(start, 900);
  };

  const trained = objAttempts.length;
  const listItems = filter ? items.filter((i) => i.category === filter) : items;

  return (
    <div className="space-y-8">
      <Suspense fallback={null}>
        <DeepLinkParam
          onValue={(id) => {
            setFilter(null);
            setOpenId(id);
          }}
        />
      </Suspense>
      <div>
        <h1 className="text-2xl font-semibold">Námietky</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Princíp: <b>uznaj → zisti → odpovedz</b>. Natrénované: {trained}.
        </p>
      </div>

      {/* Tréning */}
      <Card className="border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30">
        <SectionTitle>Tréning</SectionTitle>
        {!current ? (
          <div className="space-y-3">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Dostaneš námietku, napíšeš vlastnú reakciu a až potom sa odkryje rozbor. Slabšie námietky sa vracajú častejšie.
            </p>
            <Btn onClick={start}>Hoď mi námietku</Btn>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl bg-white p-4 text-lg font-medium shadow-sm dark:bg-zinc-900">
              🗣️ „{current.text}“
            </div>
            <div>
              <Label>Ako zareaguješ? (najprv uznaj, potom zisti, až potom odpovedz)</Label>
              <TextArea rows={4} value={answer} onChange={(e) => setAnswer(e.target.value)} autoFocus />
            </div>
            {!revealed ? (
              <Btn onClick={() => setRevealed(true)} disabled={answer.trim().length < 5}>
                Odkryť rozbor
              </Btn>
            ) : (
              <div className="space-y-3">
                <div className="space-y-2 rounded-xl bg-white p-4 text-sm dark:bg-zinc-900">
                  {current.meaning && (
                    <p>
                      <b>Čo tým asi myslí:</b> {current.meaning}
                    </p>
                  )}
                  {current.uznaj && (
                    <p>
                      <b>1 · Uznaj:</b> {current.uznaj}
                    </p>
                  )}
                  {current.zisti && (
                    <p>
                      <b>2 · Zisti:</b> {current.zisti}
                    </p>
                  )}
                  {current.odpovedz && (
                    <p>
                      <b>3 · Odpovedz:</b> {current.odpovedz}
                    </p>
                  )}
                  {!current.meaning && !current.odpovedz && (
                    <p className="text-zinc-500">K tejto vlastnej námietke zatiaľ nemáš rozbor, doplň si ho v zozname nižšie.</p>
                  )}
                  {current.hlbka && (
                    <>
                      <button
                        type="button"
                        onClick={() => setRevealDeep(!revealDeep)}
                        className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        {revealDeep ? "skryť hĺbkový rozbor" : "chcem ísť viac do hĺbky"}
                      </button>
                      {revealDeep && (
                        <p className="border-t border-zinc-200 pt-2 leading-relaxed text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                          {current.hlbka}
                        </p>
                      )}
                    </>
                  )}
                </div>
                {!doneMsg ? (
                  <div>
                    <Label>Ako blízko si bol pri princípe?</Label>
                    <div className="flex flex-wrap gap-2">
                      <Btn variant="ghost" onClick={() => rate(1)}>😅 Mimo</Btn>
                      <Btn variant="ghost" onClick={() => rate(2)}>🙂 Čiastočne</Btn>
                      <Btn variant="ghost" onClick={() => rate(3)}>🎯 Trafil som</Btn>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-emerald-600">Uložené, ďalšia ide…</div>
                )}
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Zoznam */}
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <SectionTitle>Banka námietok ({items.length})</SectionTitle>
        </div>
        <div className="mb-3 flex flex-wrap gap-1.5">
          <FilterChip label="Všetky" active={filter === null} onClick={() => setFilter(null)} />
          {OBJECTION_CATEGORIES.map((c) => (
            <FilterChip key={c.id} label={c.label} active={filter === c.id} onClick={() => setFilter(filter === c.id ? null : c.id)} />
          ))}
          {userObjections.length > 0 && (
            <FilterChip label="Vlastné" active={filter === "vlastné"} onClick={() => setFilter(filter === "vlastné" ? null : "vlastné")} />
          )}
        </div>
        <div className="space-y-2">
          {listItems.map((i) => {
            const s = stats(objAttempts, i.id);
            const open = openId === i.id;
            return (
              <Card key={i.id} id={`obj-${i.id}`} className="!p-3">
                <button type="button" className="flex w-full items-center justify-between gap-2 text-left" onClick={() => setOpenId(open ? null : i.id)}>
                  <div className="text-sm font-medium">„{i.text}“</div>
                  <div className="shrink-0 text-xs text-zinc-500">
                    {s.count > 0 ? (
                      <>
                        {s.count}× ·{" "}
                        {s.avg! >= 2.5 ? "🎯" : s.avg! >= 1.8 ? "🙂" : "😅"}
                      </>
                    ) : (
                      "nové"
                    )}
                  </div>
                </button>
                {open && (
                  <div className="mt-3 space-y-1.5 border-t border-zinc-200 pt-3 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-300">
                    {i.meaning && <p><b>Čo tým asi myslí:</b> {i.meaning}</p>}
                    {i.uznaj && <p><b>1 · Uznaj:</b> {i.uznaj}</p>}
                    {i.zisti && <p><b>2 · Zisti:</b> {i.zisti}</p>}
                    {i.odpovedz && <p><b>3 · Odpovedz:</b> {i.odpovedz}</p>}
                    {i.hlbka && (
                      <p className="border-t border-zinc-200 pt-1.5 leading-relaxed dark:border-zinc-800">
                        <b>Do hĺbky:</b> {i.hlbka}
                      </p>
                    )}
                    {i.custom && (
                      <button type="button" onClick={() => remove("userObjections", i.id)} className="text-xs text-red-500 hover:underline">
                        zmazať vlastnú námietku
                      </button>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* Pridať vlastnú */}
      <Card>
        {!showAdd ? (
          <button type="button" onClick={() => setShowAdd(true)} className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            + Pridať vlastnú námietku (počul si niečo nové v predajni?)
          </button>
        ) : (
          <AddObjection
            onSave={(o) => {
              put("userObjections", o);
              setShowAdd(false);
            }}
            onCancel={() => setShowAdd(false)}
          />
        )}
      </Card>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
        active ? "bg-indigo-600 text-white" : "bg-zinc-200 text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-300"
      }`}
    >
      {label}
    </button>
  );
}

function AddObjection({ onSave, onCancel }: { onSave: (o: UserObjection) => void; onCancel: () => void }) {
  const [text, setText] = useState("");
  const [meaning, setMeaning] = useState("");
  const [approach, setApproach] = useState("");
  return (
    <div className="space-y-3">
      <div>
        <Label>Námietka (ako ju zákazník povedal)</Label>
        <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="napr. Tablet pre dieťa? To mu radšej kúpim knihu." />
      </div>
      <div>
        <Label>Čo tým asi myslí (voliteľné)</Label>
        <TextArea rows={2} value={meaning} onChange={(e) => setMeaning(e.target.value)} />
      </div>
      <div>
        <Label>Ako na ňu chcem reagovať (voliteľné)</Label>
        <TextArea rows={2} value={approach} onChange={(e) => setApproach(e.target.value)} />
      </div>
      <div className="flex gap-2">
        <Btn
          disabled={text.trim().length < 3}
          onClick={() =>
            onSave({
              id: uid(),
              text: text.trim(),
              meaning: meaning.trim() || undefined,
              approach: approach.trim() || undefined,
              updatedAt: Date.now(),
            })
          }
        >
          Uložiť
        </Btn>
        <Btn variant="ghost" onClick={onCancel}>
          Zrušiť
        </Btn>
      </div>
    </div>
  );
}
