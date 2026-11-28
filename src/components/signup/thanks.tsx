"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/button";

const NAMES: Record<string, string> = { google: "Google", apple: "Apple", tiktok: "TikTok" };
const read = () => {
  try {
    return sessionStorage.getItem("clippable-signup") ?? "";
  } catch {
    return "";
  }
};

export function Thanks() {
  const raw = useSyncExternalStore(
    () => () => {},
    read,
    () => "",
  );
  let data: { via?: string; email?: string } = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {}
  const where = data.email ? (
    <span className="font-medium text-fg">{data.email}</span>
  ) : data.via && NAMES[data.via] ? (
    <>the email on your {NAMES[data.via]} account</>
  ) : (
    <>your inbox</>
  );

  return (
    <div className="flex flex-col items-center text-center">
      <span className="ok-check block size-16">
        <svg viewBox="0 0 64 64" className="size-full overflow-visible" aria-hidden="true">
          <circle className="halo" cx="32" cy="32" r="30" />
          <circle className="fill" cx="32" cy="32" r="30" />
          <circle className="ring" cx="32" cy="32" r="30" pathLength={1} />
          <path className="tick" d="M20 33.5 28 41.5 45 24" pathLength={1} />
        </svg>
      </span>
      <h1 className="mt-8 text-[clamp(2.25rem,4vw,3rem)] leading-[1] font-medium tracking-[-0.045em] text-fg">
        <span className="block text-fg-muted">Thank you.</span>
        You&rsquo;re on the list.
      </h1>
      <p className="mt-5 max-w-[34ch] text-[17px] text-pretty text-fg-muted">
        Thanks for signing up for the beta. We&rsquo;ve sent an email to {where} with your access.
      </p>
      <Button href="/" className="mt-9">
        Back to Clippable
      </Button>
    </div>
  );
}
