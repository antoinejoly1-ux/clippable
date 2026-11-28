import type { Metadata } from "next";
import { SignupShell } from "@/components/signup/shell";
import { SignupForm } from "@/components/signup/signup-form";

export const metadata: Metadata = {
  title: "Sign up for the beta",
  description:
    "Create your Clippable account and get early access: clips cut live from Kick and Twitch streams, with your branding, on repeat.",
  alternates: { canonical: "/signup" },
};

export default function SignupPage() {
  return (
    <SignupShell>
      <SignupForm />
    </SignupShell>
  );
}
