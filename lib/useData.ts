"use client";

// Typované čítanie kolekcií + odvodené hodnoty (progress, odomykanie týždňov).

import { useStore } from "./store";
import type {
  Entry,
  Reflection,
  Progress,
  ObjAttempt,
  UserObjection,
  ProductCard,
  Settings,
  SelfNote,
  Question,
  MyThought,
  Note,
  CustomerRequest,
  StudyTopic,
  Manual,
  MentorMessage,
} from "./types";
import { dayKey } from "./gamify";

export function useData() {
  const store = useStore();
  const { db } = store;

  const entries = (db.entries as Entry[]).slice().sort((a, b) => b.ts - a.ts);
  const reflections = (db.reflections as Reflection[]).slice().sort((a, b) => (a.date < b.date ? 1 : -1));
  const objAttempts = db.objAttempts as ObjAttempt[];
  const userObjections = db.userObjections as UserObjection[];
  const products = db.products as ProductCard[];
  const selfNotes = ((db.selfNotes ?? []) as SelfNote[]).slice().sort((a, b) => b.ts - a.ts);
  const questions = ((db.questions ?? []) as Question[]).slice().sort((a, b) => b.ts - a.ts);
  const myThoughts = ((db.myThoughts ?? []) as MyThought[]).slice().sort((a, b) => b.ts - a.ts);
  const notes = ((db.notes ?? []) as Note[]).slice().sort((a, b) => b.ts - a.ts);
  const requests = ((db.requests ?? []) as CustomerRequest[])
    .slice()
    .sort((a, b) => b.count - a.count || b.ts - a.ts);
  const studyTopics = ((db.studyTopics ?? []) as StudyTopic[]).slice().sort((a, b) => b.ts - a.ts);
  const manuals = ((db.manuals ?? []) as Manual[]).slice().sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "sk"));
  const mentorMessages = ((db.mentorMessages ?? []) as MentorMessage[])
    .slice()
    .sort((a, b) => a.ts - b.ts);

  const progress: Progress =
    (db.progress[0] as Progress) ?? {
      id: "progress",
      startedAt: Date.now(),
      currentWeek: 1,
      completedWeeks: [],
      readLessons: [],
      weekStarts: {},
      updatedAt: 0,
    };

  const settings: Settings =
    (db.settings[0] as Settings) ?? {
      id: "settings",
      customWants: [],
      customFears: [],
      favoriteThoughts: [],
      updatedAt: 0,
    };

  /** Počet dní so záznamom od odomknutia aktuálneho týždňa. */
  const daysInCurrentWeek = (() => {
    const start = progress.weekStarts[String(progress.currentWeek)] ?? progress.startedAt;
    const days = new Set<string>();
    for (const e of entries) if (e.ts >= start) days.add(dayKey(e.ts));
    for (const r of reflections) if (r.updatedAt >= start) days.add(r.date);
    return days.size;
  })();

  return {
    ...store,
    entries,
    reflections,
    objAttempts,
    userObjections,
    products,
    selfNotes,
    questions,
    myThoughts,
    notes,
    requests,
    studyTopics,
    manuals,
    mentorMessages,
    progress,
    settings,
    daysInCurrentWeek,
  };
}
