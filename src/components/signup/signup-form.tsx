"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  GoogleIcon,
  InstagramIcon,
  MailIcon,
  TikTokIcon,
} from "@/components/signup/provider-icons";

/*
 * TODO(client): wire these to real sign-in (OAuth + email) once accounts exist. For the beta
 * preview, any choice goes straight to the confirmation page; nothing is sent anywhere.
 */
const PROVIDERS = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "instagram", label: "Continue with Instagram", Icon: InstagramIcon },
  { id: "tiktok", label: "Continue with TikTok", Icon: TikTokIcon },
] as const;

const row =
  "flex h-12 w-full items-center justify-center gap-3 rounded-[13px] border text-[16px] font-medium transition-[scale,background-color,border-color] duration-300 select-none active:scale-[0.98] active:duration-100";

export function SignupForm() {
  const router = useRouter();
  const [emailOpen, setEmailOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const done = (data: { via: string; email?: string }) => {
    try {
      sessionStorage.setItem("clippable-signup", JSON.stringify(data));
    } catch {}
    router.push("/signup/thanks");
  };

  return (
    <div>
      <h1 className="text-center text-[clamp(2.25rem,4vw,3rem)] leading-[1] font-medium tracking-[-0.045em] text-fg lg:text-left">
        <span className="block text-fg-muted">Join the beta.</span>
        Start clipping.
      </h1>

      <div className="mt-7 flex flex-col gap-2.5">
        {PROVIDERS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => done({ via: id })}
            className={`${row} border-border bg-bg text-fg shadow-[0_1px_2px_rgb(1_8_43/0.06)] hover:border-fg-subtle/50 hover:bg-bg-subtle`}
          >
            <Icon />
            {label}
          </button>
        ))}

        <div className="flex items-center gap-3 text-[13px] text-fg-subtle">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Same row as the providers; on click it becomes the email field, submit inside it. */}
        {emailOpen ? (
          <form
            className="relative animate-[signup-rise_400ms_var(--ease-out-expo)_both]"
            onSubmit={(e) => {
              e.preventDefault();
              const email = inputRef.current?.value.trim();
              if (email) done({ via: "email", email });
            }}
          >
            <label htmlFor="signup-email" className="sr-only">
              Email
            </label>
            <span className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-fg-subtle">
              <MailIcon />
            </span>
            <input
              ref={inputRef}
              id="signup-email"
              type="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
              className="h-12 w-full rounded-[13px] border border-electric bg-bg pr-14 pl-12 text-[16px] text-fg shadow-[0_1px_2px_rgb(1_8_43/0.06)] ring-4 ring-electric/15 outline-none placeholder:text-fg-subtle"
            />
            <button
              type="submit"
              aria-label="Get beta access"
              className="absolute top-1.5 right-1.5 flex size-9 items-center justify-center rounded-[9px] bg-electric text-white transition-[scale,background-color] hover:bg-royal active:scale-95"
            >
              <svg
                viewBox="0 0 16 16"
                className="size-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setEmailOpen(true)}
            className={`${row} border-border bg-bg text-fg shadow-[0_1px_2px_rgb(1_8_43/0.06)] hover:border-fg-subtle/50 hover:bg-bg-subtle`}
          >
            <MailIcon />
            Continue with email
          </button>
        )}
      </div>

      <p className="mt-6 text-center text-[13px] text-pretty text-fg-subtle">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-fg">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-fg">
          Privacy Policy
        </Link>
        . Clippable is in private beta; we&rsquo;ll email you when your access is ready.
      </p>
    </div>
  );
}
