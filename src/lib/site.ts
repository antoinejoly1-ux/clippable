/**
 * Single source of truth for site-wide facts. Used by metadata, JSON-LD,
 * sitemap, robots and llms.txt so the brand entity stays consistent (AEO).
 */
export const site = {
  name: "Clippable",
  // TODO(brief): replace with the approved one-line positioning statement.
  tagline: "Website in progress",
  description: "Clippable — official website. Full site launching soon.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_US",
  // Only index when explicitly enabled on the production deployment.
  indexable: process.env.SITE_INDEXABLE === "true",
  // TODO(brief): official profiles for Organization.sameAs (LinkedIn, X, YouTube, ...).
  sameAs: [] as string[],
  themeColor: "#3574EF",
} as const;
