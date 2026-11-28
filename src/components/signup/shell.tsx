import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { LightOnly } from "@/components/signup/light-only";
import { Showcase } from "@/components/signup/showcase";

/** Split layout shared by sign-up and its confirmation: feature slides left, the form right. */
export function SignupShell({ children }: { children: ReactNode }) {
  return (
    <main
      id="main"
      className="relative isolate flex min-h-svh flex-col bg-bg lg:flex-row lg:gap-3 lg:p-3"
    >
      <LightOnly />
      {/* The password page's sky, behind the whole page. */}
      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <div className="hero-sky gate-sky absolute inset-0" />
        <div className="hero-grain absolute inset-0" />
      </div>
      <div className="lg:sticky lg:top-3 lg:flex lg:h-[calc(100svh-1.5rem)] lg:w-[55%] lg:flex-col lg:[&>section]:flex-1">
        <Showcase />
      </div>
      <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:py-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            aria-label="Clippable home"
            className="text-[1.35rem] text-fg [--logo-mark:var(--color-electric)] lg:text-white lg:[--logo-mark:var(--color-sky)]"
          >
            <Logo />
          </Link>
          <span className="rounded-full bg-white/75 px-3 py-1 text-[13px] font-medium text-fg ring-1 ring-border backdrop-blur-md">
            Private beta
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center py-8 lg:py-12">
          <div className="mx-auto w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </main>
  );
}
