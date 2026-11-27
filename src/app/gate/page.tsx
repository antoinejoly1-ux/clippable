import type { Metadata } from "next";
import { Suspense } from "react";
import { LogoMark } from "@/components/logo";
import { GateForm } from "./gate-form";

export const metadata: Metadata = {
  title: "Private preview",
  robots: { index: false, follow: false },
};

export default function GatePage() {
  return (
    <main
      id="main"
      className="relative isolate flex min-h-svh flex-col items-center justify-center overflow-hidden bg-bg px-5 text-center"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="hero-sky gate-sky absolute inset-0" />
        <div className="hero-grain absolute inset-0" />
      </div>

      <div className="gate-in flex flex-col items-center [animation-delay:500ms]">
        <span className="gate-mark flex size-16 items-center justify-center rounded-[18px] bg-white/10 ring-1 ring-white/25 backdrop-blur-xl">
          <LogoMark className="h-6 w-auto text-white" />
        </span>
      </div>

      <p className="gate-in mt-8 inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1.5 text-sm font-medium text-fg ring-1 ring-border backdrop-blur-md [animation-delay:700ms]">
        <span className="relative flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-success opacity-75" />
          <span className="relative size-2 rounded-full bg-success" />
        </span>
        Private preview
      </p>

      <h1 className="gate-in mt-6 max-w-[14ch] text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.05em] text-balance text-fg [animation-delay:850ms]">
        Something&apos;s about to go live.
      </h1>
      <p className="gate-in mt-5 max-w-[38ch] text-lg text-pretty text-fg-muted [animation-delay:1000ms]">
        The new Clippable is behind this door. Enter the password to watch it first.
      </p>

      <div className="gate-in mt-9 w-full max-w-sm [animation-delay:1150ms]">
        <Suspense>
          <GateForm />
        </Suspense>
      </div>
    </main>
  );
}
