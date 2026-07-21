"use client";

import { useState } from "react";
import { useData } from "@/lib/useData";
import { uid } from "@/lib/store";
import { parseProductText } from "@/lib/productParser";
import { PRODUCT_SECTIONS, type ProductFieldDef } from "@/content/productFields";
import type { ProductCard as Product } from "@/lib/types";
import { Btn, Card, Input, Label, SectionTitle, TextArea } from "@/components/ui";

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
  const [pasting, setPasting] = useState(false);
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

  const formOpen = creating || pasting || !!editing;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Produkty</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ku každému produktu kompletný predajno-psychologický rozbor. Keď ho vieš, vieš produkt predať poctivo.
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
                    Odpovedz si v duchu na kľúčové otázky: komu pomáha, aký problém rieši, aká je jeho hodnota, čo robiť pri
                    námietkach. Potom odkry.
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

      {/* Vloženie textu analýzy */}
      {pasting && (
        <Card>
          <SectionTitle>Vložiť text analýzy</SectionTitle>
          <PasteForm
            onParsed={(product) => {
              setEditing(product);
              setPasting(false);
            }}
            onCancel={() => setPasting(false)}
          />
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
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <SectionTitle>Moje kartičky ({products.length})</SectionTitle>
          {!formOpen && (
            <div className="flex gap-2">
              <Btn variant="ghost" onClick={() => setPasting(true)}>
                📋 Vložiť text
              </Btn>
              <Btn onClick={() => setCreating(true)}>+ Nová kartička</Btn>
            </div>
          )}
        </div>

        {products.length === 0 && !formOpen && (
          <Card>
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Zatiaľ žiadne kartičky. Začni tými, čo predávaš najčastejšie, napríklad výmena disku za SSD, čistenie
              notebooku, inštalácia Windows, antivírus, repasovaný počítač, rozšírenie RAM. Buď ich vypíš ručne, alebo
              vlož hotovú textovú analýzu tlačidlom „Vložiť text“.
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
                  <div className="mt-3 space-y-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
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

function fieldValue(p: Product, key: ProductFieldDef["key"]): string {
  return String((p as unknown as Record<string, unknown>)[key] ?? "").trim();
}

function CardBody({ p }: { p: Product }) {
  return (
    <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
      {PRODUCT_SECTIONS.map((section) => {
        const filled = section.fields.filter((f) => fieldValue(p, f.key));
        if (filled.length === 0) return null;
        return (
          <div key={section.id}>
            <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
              {section.title}
            </div>
            <div className="space-y-1.5">
              {filled.map((f) => (
                <p key={String(f.key)} className="whitespace-pre-wrap">
                  <b>{f.label}</b> {fieldValue(p, f.key)}
                </p>
              ))}
            </div>
          </div>
        );
      })}
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
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Produkt / služba</Label>
          <Input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="napr. UV ochranná fólia" />
        </div>
        <div>
          <Label>Kategória (voliteľné)</Label>
          <Input value={form.category ?? ""} onChange={(e) => set("category", e.target.value)} placeholder="servis / notebooky / príslušenstvo…" />
        </div>
      </div>

      {PRODUCT_SECTIONS.map((section) => (
        <div key={section.id} className="space-y-3 border-t border-zinc-200 pt-3 dark:border-zinc-800">
          <div className="text-xs font-semibold uppercase tracking-wide text-zinc-400 dark:text-zinc-500">
            {section.title}
          </div>
          {section.fields.map((f) => (
            <div key={String(f.key)}>
              <Label>{f.label}</Label>
              <TextArea
                rows={2}
                value={String((form as Record<string, unknown>)[f.key] ?? "")}
                onChange={(e) => set(String(f.key), e.target.value)}
                placeholder={f.hint}
              />
            </div>
          ))}
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

function PasteForm({ onParsed, onCancel }: { onParsed: (p: Product) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");

  const process = () => {
    const parsed = parseProductText(text);
    const now = Date.now();
    const product: Product = {
      ...EMPTY,
      ...parsed,
      id: uid(),
      name: name.trim(),
      category: category.trim() || undefined,
      updatedAt: now,
    } as Product;
    onParsed(product);
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Vlož hotovú textovú analýzu produktu (napr. výstup z rozboru podľa otázok o produkte). Text sa pokúsi rozdeliť do
        jednotlivých polí kartičky, výsledok si pred uložením skontroluješ a doplníš vo formulári.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label>Produkt / služba</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="napr. UV ochranná fólia" />
        </div>
        <div>
          <Label>Kategória (voliteľné)</Label>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="servis / notebooky / príslušenstvo…" />
        </div>
      </div>
      <div>
        <Label>Text analýzy</Label>
        <TextArea rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Sem vlož celý text analýzy produktu…" />
      </div>
      {text.trim().length > 0 && text.trim().length < 20 && (
        <p className="text-xs text-amber-600 dark:text-amber-400">Text je zatiaľ príliš krátky na spracovanie.</p>
      )}
      <div className="flex gap-2">
        <Btn disabled={text.trim().length < 20} onClick={process}>
          Spracovať a vyplniť kartičku
        </Btn>
        <Btn variant="ghost" onClick={onCancel}>
          Zrušiť
        </Btn>
      </div>
    </div>
  );
}
