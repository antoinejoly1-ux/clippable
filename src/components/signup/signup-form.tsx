"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { AppleIcon, GoogleIcon, MailIcon, TikTokIcon } from "@/components/signup/provider-icons";

/*
 * TODO(client): wire these to real sign-in (OAuth + email) once accounts exist. For the beta
 * preview, any choice goes straight to the confirmation page; nothing is sent anywhere.
 */
const PROVIDERS = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "apple", label: "Continue with Apple", Icon: AppleIcon },
  { id: "tiktok", label: "Continue with TikTok", Icon: TikTokIcon },
] as const;

const row =
  "flex h-[3.25rem] w-full items-center justify-center gap-3 rounded-[13px] border text-[16px] font-medium transition-[scale,background-color,border-color] duration-300 select-none active:scale-[0.98] active:duration-100";

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
      <h1 className="text-[clamp(2.25rem,4vw,3rem)] leading-[1] font-medium tracking-[-0.045em] text-fg">
        <span className="block text-fg-muted">Join the beta.</span>
        Start clipping.
      </h1>
      <p className="mt-4 text-[17px] text-pretty text-fg-muted">
        Create your account to get early access to Clippable.
      </p>

      <div className="mt-8 flex flex-col gap-3">
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

        <div className="my-2 flex items-center gap-3 text-[13px] text-fg-subtle">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        {emailOpen ? (
          <form
            className="flex animate-[signup-rise_500ms_var(--ease-out-expo)_both] flex-col gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              const email = inputRef.current?.value.trim();
              if (email) done({ via: "email", email });
            }}
          >
            <label htmlFor="signup-email" className="sr-only">
              Email
            </label>
            <div className="relative">
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
                className="h-[3.25rem] w-full rounded-[13px] border border-border bg-bg pr-4 pl-12 text-[16px] text-fg outline-none placeholder:text-fg-subtle focus:border-electric focus:ring-4 focus:ring-electric/15"
              />
            </div>
            <button
              type="submit"
              className={`${row} border-transparent bg-[linear-gradient(180deg,#3f80ff_0%,#1f55e0_55%,var(--color-royal)_100%)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3),0_12px_28px_-12px_rgb(0_97_255/0.75)] hover:brightness-110`}
            >
              Get beta access
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setEmailOpen(true)}
            className={`${row} border-transparent bg-midnight text-white hover:bg-royal`}
          >
            <MailIcon />
            Continue with email
          </button>
        )}
      </div>

      <p className="mt-8 text-center text-[13px] text-pretty text-fg-subtle">
        Clippable is in private beta. We&rsquo;ll email you when your access is ready.
      </p>
    </div>
  );
}
