"use client";

import { useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import type { ProductCard as Product } from "@/lib/types";
import { Btn, Card, Input, Label, SectionTitle, TextArea } from "@/components/ui";

const FIELDS: { key: keyof Product; label: string; hint: string }[] = [
  { key: "who", label: "Komu pomáha?", hint: "napr. každému so starším notebookom, kto sa sťažuje na pomalosť" },
  { key: "when", label: "Kedy ho odporučím?", hint: "napr. stroj je inak zdravý a má SATA/M.2 slot" },
  { key: "whenNot", label: "Kedy ho NEodporučím?", hint: "napr. základná doska na odchode — investícia sa nevráti" },
  { key: "alternatives", label: "Aké má alternatívy?", hint: "napr. viac RAM, repasovaný stroj, nový" },
  { key: "objections", label: "Najčastejšie námietky?", hint: "napr. „veď mi to funguje“ — ukázať rozdiel naživo" },
];

const EMPTY: Omit<Product, "id" | "updatedAt"> = {
  name: "",
  category: "",
  who: "",
  when: "",
  whenNot: "",
  alternatives: "",
  objections: "",
};

export default function ProduktyPage() {
  const { products, put, remove, ready } = useData();
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [quiz, setQuiz] = useState<Product | null>(null);
  const [quizRevealed, setQuizRevealed] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  if (!ready) return null;

  const sorted = products.slice().sort((a, b) => b.updatedAt - a.updatedAt);

  const startQuiz = () => {
    if (products.length === 0) return;
    const pick = products.slice().sort((a, b) => (a.lastReviewed ?? 0) - (b.lastReviewed ?? 0))[0];
    setQuiz(pick);
    setQuizRevealed(false);
  };

  const finishQuiz = () => {
    if (!quiz) return;
    put("products", { ...quiz, lastReviewed: Date.now(), reviewCount: (quiz.reviewCount ?? 0) + 1, updatedAt: Date.now() });
    setQuiz(null);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Produkty</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ku každému produktu či službe 5 odpovedí. Keď ich vieš, vieš produkt predať poctivo.
        </p>
      </div>

      {/* Skúšanie */}
      {products.length > 0 && (
        <Card className="border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30">
          <SectionTitle>Vyskúšaj sa</SectionTitle>
          {!quiz ? (
            <Btn onClick={startQuiz}>Skúšaj ma z kartičky</Btn>
          ) : (
            <div className="space-y-3">
              <div className="rounded-xl bg-white p-4 text-lg font-medium shadow-sm dark:bg-zinc-900">📦 {quiz.name}</div>
              {!quizRevealed ? (
                <>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    Odpovedz si v duchu: komu pomáha, kedy áno, kedy nie, alternatívy, námietky. Potom odkry.
                  </p>
                  <Btn onClick={() => setQuizRevealed(true)}>Odkryť kartičku</Btn>
                </>
              ) : (
                <>
                  <CardBody p={quiz} />
                  <div className="flex gap-2">
                    <Btn onClick={finishQuiz}>✔ Hotovo</Btn>
                    <Btn
                      variant="ghost"
                      onClick={() => {
                        setEditing(quiz);
                        setQuiz(null);
                      }}
                    >
                      Doplniť kartičku
                    </Btn>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Formulár */}
      {(creating || editing) && (
        <Card>
          <SectionTitle>{editing ? `Upraviť: ${editing.name}` : "Nová kartička"}</SectionTitle>
          <ProductForm
            initial={editing ?? undefined}
            onSave={(p) => {
              put("products", p);
              setCreating(false);
              setEditing(null);
            }}
            onCancel={() => {
              setCreating(false);
              setEditing(null);
            }}
          />
        </Card>
      )}

      {/* Zoznam */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <SectionTitle>Moje kartičky ({products.length})</SectionTitle>
          {!creating && !editing && <Btn onClick={() => setCreating(true)}>+ Nová kartička</Btn>}
        </div>

        {products.length === 0 && !creating && (
          <Card>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Zatiaľ žiadne kartičky. Začni tými, čo predávaš najčastejšie: výmena disku za SSD, čistenie notebooku,
              inštalácia Windows, antivírus, repasovaný počítač, rozšírenie RAM…
            </p>
          </Card>
        )}

        <div className="space-y-2">
          {sorted.map((p) => {
            const open = openId === p.id;
            return (
              <Card key={p.id} className="!p-3">
                <button type="button" className="flex w-full items-center justify-between gap-2 text-left" onClick={() => setOpenId(open ? null : p.id)}>
                  <div>
                    <div className="text-sm font-semibold">{p.name}</div>
                    {p.category && <div className="text-xs text-zinc-500">{p.category}</div>}
                  </div>
                  <div className="text-xs text-zinc-400">{p.reviewCount ? `${p.reviewCount}× skúšané` : ""}</div>
                </button>
                {open && (
                  <div className="mt-3 space-y-2 border-t border-zinc-200 pt-3 dark:border-zinc-800">
                    <CardBody p={p} />
                    <div className="flex gap-3 text-xs">
                      <button type="button" onClick={() => setEditing(p)} className="font-medium text-indigo-600 hover:underline">
                        upraviť
                      </button>
                      <DeleteLink onDelete={() => remove("products", p.id)} />
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CardBody({ p }: { p: Product }) {
  return (
    <div className="space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300">
      {FIELDS.map((f) =>
        p[f.key] ? (
          <p key={String(f.key)}>
            <b>{f.label}</b> {String(p[f.key])}
          </p>
        ) : (
          <p key={String(f.key)} className="text-zinc-400">
            <b>{f.label}</b> — nevyplnené
          </p>
        )
      )}
    </div>
  );
}

function DeleteLink({ onDelete }: { onDelete: () => void }) {
  const [confirm, setConfirm] = useState(false);
  return !confirm ? (
    <button type="button" onClick={() => setConfirm(true)} className="text-zinc-400 hover:text-red-600">
      zmazať
    </button>
  ) : (
    <span className="flex gap-2">
      <button type="button" onClick={onDelete} className="font-medium text-red-600">naozaj zmazať</button>
      <button type="button" onClick={() => setConfirm(false)} className="text-zinc-500">nie</button>
    </span>
  );
}

function ProductForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Product;
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Omit<Product, "id" | "updatedAt">>(initial ?? EMPTY);
  const set = (key: string, value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Produkt / služba</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="napr. Výmena HDD za SSD" />
        </div>
        <div>
          <Label>Kategória (voliteľné)</Label>
          <Input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} placeholder="servis / notebooky / príslušenstvo…" />
        </div>
      </div>
      {FIELDS.map((f) => (
        <div key={String(f.key)}>
          <Label>{f.label}</Label>
          <TextArea rows={2} value={String(form[f.key as keyof typeof form] ?? "")} onChange={(e) => set(String(f.key), e.target.value)} placeholder={f.hint} />
        </div>
      ))}
      <div className="flex gap-2">
        <Btn
          disabled={form.name.trim().length < 2}
          onClick={() =>
            onSave({
              ...(initial ?? { id: uid() }),
              ...form,
              name: form.name.trim(),
              updatedAt: Date.now(),
            } as Product)
          }
        >
          Uložiť kartičku
        </Btn>
        <Btn variant="ghost" onClick={onCancel}>
          Zrušiť
        </Btn>
      </div>
    </div>
  );
}
