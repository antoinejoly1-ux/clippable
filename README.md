# Clippable: website

Marketing site for Clippable. Next.js 16 · React 19 · TypeScript · Tailwind CSS v4.

## Quick start

```bash
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command                       | What it does                                             |
| ----------------------------- | -------------------------------------------------------- |
| `npm run dev`                 | Dev server                                               |
| `npm run build` / `npm start` | Production build and serve                               |
| `npm run check`               | Typecheck, lint and Prettier check (run before every PR) |
| `npm run format`              | Format everything                                        |

## Structure

```
src/app/            routes, layout, metadata routes (robots, sitemap, manifest, icons)
src/components/     UI components (logo, JSON-LD)
src/lib/site.ts     site-wide facts: name, URL, description, socials
public/brand/       logo assets
docs/               brand guide, Kylon persona and standards
inspiration/        references for the design phase
```

## Built in from day one

- **Security:** CSP, HSTS, nosniff, frame-deny, Referrer-Policy, Permissions-Policy and COOP in `next.config.ts`. CI runs `npm audit`, uses SHA-pinned actions and Dependabot.
- **SEO/AEO:** metadata, canonical, Open Graph, `robots.txt`, `sitemap.xml`, Organization and WebSite JSON-LD, `llms.txt`.
  Indexing is **off** unless `SITE_INDEXABLE=true`, so previews never get indexed.
- **Accessibility:** skip link, visible focus, reduced-motion support, AA-checked colour pairs.

## Deploy

Vercel recommended. Set `NEXT_PUBLIC_SITE_URL` and, on production only, `SITE_INDEXABLE=true`.

## Swapping in real clips

Drop the 8 clips (any orientation; they're centre-cropped to 9:16) and, optionally, the landscape stream for the hero into a folder, then run:

```bash
scripts/encode-clips.sh ~/clippable-clips ~/clippable-clips/stream.mp4
```

Clips are used in alphabetical order. Set `START_<n>=<seconds>` to choose where clip _n_ starts (e.g. `START_3=12`). The script writes AV1 and H.264 versions plus posters into `public/media/`.
