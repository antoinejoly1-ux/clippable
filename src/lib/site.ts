/**
 * Single source of truth for site-wide facts. Used by metadata, JSON-LD,
 * sitemap, robots and llms.txt so the brand entity stays consistent (AEO).
 */
const url = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_ENV === "production" && process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
).replace(/\/$/, "");

// An indexable build must declare its real origin, or canonical URLs would point at a preview host.
if (process.env.SITE_INDEXABLE === "true" && !process.env.NEXT_PUBLIC_SITE_URL) {
  throw new Error("NEXT_PUBLIC_SITE_URL must be set when SITE_INDEXABLE=true");
}

export const site = {
  name: "Clippable",
  tagline: "Turn live streams into viral clips",
  description:
    "Clippable turns Kick and Twitch streams into vertical clips while they're live. Post them to TikTok, Shorts, Reels and X and earn on every 1,000 views.",
  url,
  email: "business@clippable.net",
  // TODO(client): point these at the app once accounts exist.
  signupUrl: "/signup",
  loginUrl: "/signup",
  locale: "en_US",
  // Only index when explicitly enabled on the production deployment.
  indexable: process.env.SITE_INDEXABLE === "true",
  // TODO(client): official profiles for Organization.sameAs (Instagram, X, TikTok, YouTube).
  sameAs: [] as string[],
  // Browser chrome colour: white, matching the light-only page.
  themeColor: "#FFFFFF",
} as const;
