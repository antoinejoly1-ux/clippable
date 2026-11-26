import { Logo } from "@/components/logo";
import { site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 text-sm text-fg-muted sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-2">
        <Logo className="text-lg text-fg" />
        <p className="max-w-sm">{site.description}</p>
      </div>
      <div className="flex flex-col gap-1 sm:items-end">
        <a href={`mailto:${site.email}`} className="font-medium text-link hover:underline">
          {site.email}
        </a>
        <p>
          © <CopyrightYear /> Clippable. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

/** Cached at build/revalidation time, so the page stays fully static. */
async function CopyrightYear() {
  "use cache";
  return new Date().getFullYear();
}
