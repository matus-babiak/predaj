"use client";

import Link from "next/link";
import { useData } from "@/lib/useData";
import { getWeek } from "@/content/program";
import { Card, SectionTitle, RichText } from "@/components/ui";
import { activeDays, streak, dayKey, computeBadges } from "@/lib/gamify";

export default function TodayPage() {
  const { entries, reflections, objAttempts, products, progress, ready } = useData();
  if (!ready) return null;

  const week = getWeek(progress.currentWeek);
  const today = dayKey(Date.now());
  const todayEntries = entries.filter((e) => dayKey(e.ts) === today);
  const hasReflection = reflections.some((r) => r.date === today);
  const s = streak(activeDays(entries, reflections));
  const badges = computeBadges({ entries, reflections, objAttempts, products, progress });
  const earned = badges.filter((b) => b.earned);

  const hour = new Date().getHours();
  const greeting = hour < 10 ? "Dobré ráno" : hour < 18 ? "Pekný deň" : "Dobrý večer";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{greeting}, Matúš 👋</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Týždeň {progress.currentWeek}/12 · Fáza {week?.phase}: {week?.phaseTitle}
          {s > 0 && <> · 🔥 {s}-dňová séria</>}
        </p>
      </div>

      {week && (
        <Card className="border-indigo-200 bg-indigo-50/60 dark:border-indigo-900 dark:bg-indigo-950/30">
          <SectionTitle>Dnešná úloha — {week.title}</SectionTitle>
          <p className="text-[15px] leading-relaxed">
            <RichText text={week.task} />
          </p>
          <Link
            href="/program"
            className="mt-3 inline-block text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Otvoriť lekciu týždňa →
          </Link>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/dennik">
          <Card className="h-full transition-colors hover:border-indigo-400">
            <div className="text-3xl">✍️</div>
            <div className="mt-2 font-semibold">Rýchly záznam</div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {todayEntries.length === 0
                ? "Zatiaľ žiadny zákazník — začni prvým."
                : `Dnes: ${todayEntries.length} ${todayEntries.length === 1 ? "zákazník" : todayEntries.length < 5 ? "zákazníci" : "zákazníkov"}.`}
            </p>
          </Card>
        </Link>
        <Link href="/dennik#reflexia">
          <Card
            className={`h-full transition-colors hover:border-indigo-400 ${hasReflection ? "opacity-70" : ""}`}
          >
            <div className="text-3xl">🌙</div>
            <div className="mt-2 font-semibold">Večerná reflexia</div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {hasReflection ? "Dnešná reflexia je hotová. ✔" : "3 otázky na koniec dňa."}
            </p>
          </Card>
        </Link>
        <Link href="/namietky">
          <Card className="h-full transition-colors hover:border-indigo-400">
            <div className="text-3xl">🥊</div>
            <div className="mt-2 font-semibold">Tréning námietok</div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {objAttempts.length} natrénovaných · daj si jednu teraz.
            </p>
          </Card>
        </Link>
        <Link href="/statistiky">
          <Card className="h-full transition-colors hover:border-indigo-400">
            <div className="text-3xl">📈</div>
            <div className="mt-2 font-semibold">Štatistiky</div>
            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              {entries.length} záznamov celkom · pozri svoje trendy.
            </p>
          </Card>
        </Link>
      </div>

      {earned.length > 0 && (
        <div>
          <SectionTitle>Odznaky ({earned.length}/{badges.length})</SectionTitle>
          <div className="flex flex-wrap gap-2">
            {earned.map((b) => (
              <span
                key={b.id}
                title={b.desc}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm dark:border-zinc-800 dark:bg-zinc-900"
              >
                {b.emoji} {b.title}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
