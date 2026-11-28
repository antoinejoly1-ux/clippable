"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";

type State = "idle" | "checking" | "wrong" | "open";

/** Password field. Shakes on a miss; on success the page floods white and the site opens. */
export function GateForm() {
  const params = useSearchParams();
  const pathname = usePathname();
  // The gate is shown in place of the page asked for (a rewrite), so that page is where to go next.
  const asked = pathname && pathname !== "/gate" ? pathname : "/";
  const next = params.get("next") ?? asked;
  const [state, setState] = useState<State>(params.get("e") ? "wrong" : "idle");
  const inputRef = useRef<HTMLInputElement>(null);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "checking" || state === "open") return;
    setState("checking");
    try {
      const res = await fetch("/api/gate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password: inputRef.current?.value ?? "", next }),
      });
      const data = (await res.json()) as { ok: boolean; next?: string };
      if (data.ok) {
        setState("open");
        window.setTimeout(() => window.location.assign(data.next ?? "/"), 650);
      } else {
        setState("wrong");
        inputRef.current?.select();
      }
    } catch {
      setState("wrong");
    }
  };

  return (
    <>
      <form
        action="/api/gate"
        method="post"
        onSubmit={submit}
        data-state={state}
        className="gate-form flex items-center gap-1.5 rounded-[16px] bg-white/80 p-1.5 shadow-[0_24px_60px_-24px_rgb(1_8_43/0.45)] ring-1 ring-border backdrop-blur-xl"
      >
        <input type="hidden" name="next" value={next} />
        <label htmlFor="gate-password" className="sr-only">
          Password
        </label>
        <input
          ref={inputRef}
          id="gate-password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Password"
          aria-invalid={state === "wrong"}
          aria-describedby="gate-status"
          onChange={() => state === "wrong" && setState("idle")}
          className="h-12 min-w-0 flex-1 rounded-[11px] bg-transparent px-4 text-base text-fg outline-none placeholder:text-fg-subtle"
        />
        <button
          type="submit"
          className="h-12 shrink-0 rounded-[11px] bg-[linear-gradient(180deg,#3f80ff_0%,#1f55e0_55%,var(--color-royal)_100%)] px-6 text-base font-medium text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_10px_24px_-10px_rgb(0_97_255/0.8)] transition-[scale,filter] duration-300 select-none hover:brightness-110 active:scale-[0.97]"
        >
          {state === "checking" ? "Checking…" : "Enter"}
        </button>
      </form>
      <p id="gate-status" role="status" className="mt-3 h-5 text-sm text-fg-muted">
        {state === "wrong" ? "That's not it. Try again." : ""}
      </p>
      {/* Success: white floods up from the field, then the site loads. */}
      <div
        aria-hidden="true"
        data-open={state === "open"}
        className="gate-flood pointer-events-none fixed inset-0 z-50 bg-white"
      />
    </>
  );
}
