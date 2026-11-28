import type { Metadata } from "next";
import { SignupShell } from "@/components/signup/shell";
import { Thanks } from "@/components/signup/thanks";

export const metadata: Metadata = {
  title: "You're on the list",
  description: "Thanks for signing up for the Clippable beta. Check your email for access.",
  robots: { index: false, follow: true },
};

export default function ThanksPage() {
  return (
    <SignupShell>
      <Thanks />
    </SignupShell>
  );
}
