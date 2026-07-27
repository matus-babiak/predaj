"use client";

// Automatické odhlásenie po nečinnosti, iba na zariadeniach s presným ukazovateľom
// (myš), nie na dotykových mobiloch/tabletoch. Nezávisí od store.tsx ani od
// synchronizácie dát, iba počíta čas od poslednej aktivity.

import { useCallback, useEffect, useRef, useState } from "react";

const WARNING_AFTER_MS = 25_000;
const LOGOUT_AFTER_MS = 30_000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "click", "scroll", "keydown", "touchstart"] as const;

function isDesktopPointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

export function useAutoLogout(onTimeout: () => void) {
  const [warning, setWarning] = useState(false);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const reset = useCallback(() => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    setWarning(false);
    warnTimer.current = setTimeout(() => setWarning(true), WARNING_AFTER_MS);
    logoutTimer.current = setTimeout(() => onTimeoutRef.current(), LOGOUT_AFTER_MS);
  }, []);

  useEffect(() => {
    if (!isDesktopPointer()) return;

    reset();
    for (const ev of ACTIVITY_EVENTS) window.addEventListener(ev, reset, { passive: true });

    return () => {
      if (warnTimer.current) clearTimeout(warnTimer.current);
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      for (const ev of ACTIVITY_EVENTS) window.removeEventListener(ev, reset);
    };
  }, [reset]);

  return { warning, staySignedIn: reset };
}
