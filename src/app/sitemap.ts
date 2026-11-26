import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// Add every public route here (or generate from content) as pages are built.
const routes = ["/"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((path) => ({
    url: `${site.url}${path === "/" ? "" : path}`,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
