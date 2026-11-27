import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) {
    // Allow crawling so bots can see the X-Robots-Tag / meta noindex; a Disallow would hide it.
    return { rules: [{ userAgent: "*", allow: "/" }] };
  }
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      // AEO: AI crawlers explicitly allowed. Revisit with the client before launch.
      {
        userAgent: ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
