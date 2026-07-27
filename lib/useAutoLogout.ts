"use client";

// Automatické odhlásenie po nečinnosti, iba na zariadeniach s presným ukazovateľom
// (myš), nie na dotykových mobiloch/tabletoch. Nezávisí od store.tsx ani od
// synchronizácie dát, iba počíta čas od poslednej aktivity.

import { useCallback, useEffect, useRef, useState } from "react";

const LOGOUT_AFTER_MS = 60_000;
const COUNTDOWN_SECONDS = 5;
const WARNING_AFTER_MS = LOGOUT_AFTER_MS - COUNTDOWN_SECONDS * 1000;
const ACTIVITY_EVENTS = ["mousemove", "mousedown", "click", "scroll", "keydown", "touchstart"] as const;

function isDesktopPointer(): boolean {
  return window.matchMedia("(pointer: fine)").matches;
}

export function useAutoLogout(onTimeout: () => void) {
  const [warning, setWarning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(COUNTDOWN_SECONDS);
  const warnTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoutTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const onTimeoutRef = useRef(onTimeout);
  onTimeoutRef.current = onTimeout;

  const clearAllTimers = () => {
    if (warnTimer.current) clearTimeout(warnTimer.current);
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    if (countdownTimer.current) clearInterval(countdownTimer.current);
  };

  const reset = useCallback(() => {
    clearAllTimers();
    setWarning(false);
    setSecondsLeft(COUNTDOWN_SECONDS);

    warnTimer.current = setTimeout(() => {
      setWarning(true);
      setSecondsLeft(COUNTDOWN_SECONDS);
      countdownTimer.current = setInterval(() => {
        setSecondsLeft((s) => Math.max(0, s - 1));
      }, 1000);
    }, WARNING_AFTER_MS);

    logoutTimer.current = setTimeout(() => onTimeoutRef.current(), LOGOUT_AFTER_MS);
  }, []);

  useEffect(() => {
    if (!isDesktopPointer()) return;

    reset();
    for (const ev of ACTIVITY_EVENTS) window.addEventListener(ev, reset, { passive: true });

    return () => {
      clearAllTimers();
      for (const ev of ACTIVITY_EVENTS) window.removeEventListener(ev, reset);
    };
  }, [reset]);

  return { warning, secondsLeft, staySignedIn: reset };
}
