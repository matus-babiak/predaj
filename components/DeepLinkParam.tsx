"use client";

// Prečíta "?q=<id>" z URL (napr. z globálneho vyhľadávania) a zavolá onValue.
// Samostatný komponent kvôli Next.js požiadavke, že useSearchParams potrebuje
// Suspense hranicu.

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function DeepLinkParam({ onValue }: { onValue: (value: string) => void }) {
  const params = useSearchParams();

  useEffect(() => {
    const v = params.get("q");
    if (v) onValue(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return null;
}
