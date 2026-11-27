import type { Metadata } from "next";
import { Button } from "@/components/button";
import { LogoMark } from "@/components/logo";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center"
    >
      <LogoMark className="h-10 w-auto text-accent" />
      <h1 className="text-4xl font-semibold tracking-tight">This clip doesn&apos;t exist.</h1>
      <p className="max-w-sm text-fg-muted">
        The page you&apos;re looking for has moved or never made the cut.
      </p>
      <Button href="/">Back home</Button>
    </main>
  );
}
