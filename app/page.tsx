"use client";

import Link from "next/link";
import { useData } from "@/lib/useData";
import { getWeek } from "@/content/program";
import { Card, SectionTitle, RichText } from "@/components/ui";
import { activeDays, streak, dayKey, computeBadges } from "@/lib/gamify";
import { THOUGHTS } from "@/content/mindset";
import { OBJECTIONS } from "@/content/objections";

export default function TodayPage() {
  const { entries, reflections, objAttempts, products, userObjections, settings, progress, ready } = useData();
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

  const favoriteThoughts = (settings.favoriteThoughts ?? [])
    .map((id) => THOUGHTS.find((t) => t.id === id))
    .filter((t): t is (typeof THOUGHTS)[number] => !!t)
    .slice(0, 3);

  const topProducts = products
    .filter((p) => (p.reviewCount ?? 0) > 0)
    .sort((a, b) => (b.reviewCount ?? 0) - (a.reviewCount ?? 0) || (b.lastReviewed ?? 0) - (a.lastReviewed ?? 0))
    .slice(0, 3);

  const allObjections = [
    ...OBJECTIONS.map((o) => ({ id: o.id, text: o.text })),
    ...userObjections.map((o) => ({ id: o.id, text: o.text })),
  ];
  const seenObjectionIds = new Set<string>();
  const recentObjections = objAttempts
    .slice()
    .sort((a, b) => b.ts - a.ts)
    .filter((a) => {
      if (seenObjectionIds.has(a.objectionId)) return false;
      seenObjectionIds.add(a.objectionId);
      return true;
    })
    .slice(0, 3)
    .map((a) => allObjections.find((o) => o.id === a.objectionId))
    .filter((o): o is { id: string; text: string } => !!o);

  const hasQuickAccess = favoriteThoughts.length > 0 || topProducts.length > 0 || recentObjections.length > 0;

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
          <SectionTitle>Dnešná úloha: {week.title}</SectionTitle>
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
                ? "Zatiaľ žiadny zákazník, začni prvým."
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

      {hasQuickAccess && (
        <div>
          <SectionTitle>Rýchly prístup</SectionTitle>
          <div className="space-y-4">
            {favoriteThoughts.length > 0 && (
              <div>
                <div className="mb-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">⭐ Obľúbené myšlienky</div>
                <div className="space-y-1.5">
                  {favoriteThoughts.map((t) => (
                    <Link key={t.id} href={`/mindset?q=${t.id}`}>
                      <Card className="!p-3 transition-colors hover:border-indigo-400">
                        <p className="truncate text-sm text-zinc-700 dark:text-zinc-300">„{t.text}“</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {topProducts.length > 0 && (
              <div>
                <div className="mb-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">🗂️ Najpoužívanejšie produkty</div>
                <div className="space-y-1.5">
                  {topProducts.map((p) => (
                    <Link key={p.id} href={`/produkty?q=${p.id}`}>
                      <Card className="!p-3 transition-colors hover:border-indigo-400">
                        <p className="truncate text-sm font-medium text-zinc-700 dark:text-zinc-300">{p.name}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {recentObjections.length > 0 && (
              <div>
                <div className="mb-1.5 text-xs font-medium text-zinc-500 dark:text-zinc-400">🥊 Naposledy trénované námietky</div>
                <div className="space-y-1.5">
                  {recentObjections.map((o) => (
                    <Link key={o.id} href={`/namietky?q=${o.id}`}>
                      <Card className="!p-3 transition-colors hover:border-indigo-400">
                        <p className="truncate text-sm text-zinc-700 dark:text-zinc-300">„{o.text}“</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
