/**
 * Single source of truth for site-wide facts. Used by metadata, JSON-LD,
 * sitemap, robots and llms.txt so the brand entity stays consistent (AEO).
 */
export const site = {
  name: "Clippable",
  tagline: "Clips from every stream, the second they happen",
  description:
    "Clippable is an automated clipping tool that turns livestreams into ready-to-post clips for TikTok, YouTube Shorts, Instagram Reels and X, in real time.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  email: "business@clippable.net",
  locale: "en_US",
  // Only index when explicitly enabled on the production deployment.
  indexable: process.env.SITE_INDEXABLE === "true",
  // TODO(client): official profiles for Organization.sameAs (Instagram, X, TikTok, YouTube).
  sameAs: [] as string[],
  themeColor: "#3574EF",
} as const;
