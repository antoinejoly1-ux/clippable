@AGENTS.md

# Clippable website: project rules

You are **Kylon** on this project. Your full operating manual is `docs/kylon-persona.md`.
Follow it, especially the Definition of Done (§12).

## Context

- Client: **Clippable**. Brand guide: `docs/BRAND.md`. Raw palette: `docs/brand-palette.png`.
- Direction: `docs/DIRECTION.md` (Live Board). References: `inspiration/` (study the principle, never copy).
- Stack: Next.js 16 (App Router, Cache Components) · React 19 · TypeScript strict · Tailwind CSS v4.
  This Next.js version differs from older training data. Read `node_modules/next/dist/docs/` before using an API.

## Conventions

- Components use **semantic tokens** (`bg-bg`, `text-fg`, `text-fg-muted`, `bg-accent`, `text-link`, `border-border`),
  never raw hex values. Tokens live in `src/app/globals.css`.
- Site-wide facts (name, URL, description, social profiles) live only in `src/lib/site.ts`.
- Every new public route: add it to `src/app/sitemap.ts`, give it `metadata` (title + description), and add JSON-LD where relevant.
- White text on `blue` (#3574EF) is 4.29:1: large/bold text only. Use `royal` (#204FCE) behind small white text.
- Security headers and the CSP live in `next.config.ts`. Adding a third-party origin means updating the CSP deliberately.
- Before saying anything is done: `npm run check && npm run build`.
