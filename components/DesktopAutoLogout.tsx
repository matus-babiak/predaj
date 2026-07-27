"use client";

// Automatické odhlásenie z dôvodu nečinnosti, iba na desktopoch (lib/useAutoLogout).
// Vkladá sa raz do Shell.tsx.

import { useCallback } from "react";
import { useAutoLogout } from "@/lib/useAutoLogout";
import { Btn, Modal } from "@/components/ui";

async function performLogout() {
  try {
    await fetch("/api/logout", { method: "POST" });
  } finally {
    window.location.href = "/login";
  }
}

export default function DesktopAutoLogout() {
  const onTimeout = useCallback(() => {
    void performLogout();
  }, []);

  const { warning, staySignedIn } = useAutoLogout(onTimeout);

  if (!warning) return null;

  return (
    <Modal>
      <p className="text-sm text-zinc-700 dark:text-zinc-300">
        Pre vašu bezpečnosť budete o 5 sekúnd automaticky odhlásený z dôvodu nečinnosti.
      </p>
      <Btn onClick={staySignedIn} className="mt-4 w-full">
        Som tu
      </Btn>
    </Modal>
  );
}
