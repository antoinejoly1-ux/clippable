import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { LightOnly } from "@/components/signup/light-only";
import { Showcase } from "@/components/signup/showcase";

/** Split layout shared by sign-up and its confirmation: feature slides left, the form right. */
export function SignupShell({ children }: { children: ReactNode }) {
  return (
    <main id="main" className="flex min-h-svh flex-col bg-bg lg:flex-row lg:gap-3 lg:p-3">
      <LightOnly />
      <div className="lg:sticky lg:top-3 lg:flex lg:h-[calc(100svh-1.5rem)] lg:w-[55%] lg:flex-col lg:[&>section]:flex-1">
        <Showcase />
      </div>
      <div className="flex flex-1 flex-col px-6 py-8 sm:px-10 lg:py-8">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="Clippable home" className="text-[1.35rem] text-fg">
            <Logo />
          </Link>
          <span className="rounded-full bg-electric/10 px-3 py-1 text-[13px] font-medium text-royal">
            Private beta
          </span>
        </div>
        <div className="flex flex-1 flex-col justify-center py-12">
          <div className="mx-auto w-full max-w-[400px]">{children}</div>
        </div>
      </div>
    </main>
  );
}
