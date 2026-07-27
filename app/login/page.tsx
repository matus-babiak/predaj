"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Btn, Input } from "@/components/ui";

/** Len relatívne cesty v rámci appky — zabráni open redirectu. */
function safeReturnPath(next: string | null): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/login")) {
    return "/";
  }
  return next;
}

function LoginForm() {
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        window.location.href = safeReturnPath(searchParams.get("next"));
      } else {
        setError("Nesprávne heslo. Skús znova.");
      }
    } catch {
      setError("Nepodarilo sa pripojiť. Skús znova.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="text-center">
          <div className="text-3xl">🥋</div>
          <h1 className="mt-2 text-xl font-semibold">Sales Dojo</h1>
        </div>
        <Input
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Btn type="submit" disabled={busy || !password} className="w-full">
          {busy ? "Prihlasujem…" : "Vstúpiť"}
        </Btn>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
