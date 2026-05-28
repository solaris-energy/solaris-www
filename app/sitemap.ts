import type { MetadataRoute } from "next";

// Static export requires the route to opt out of dynamic rendering.
export const dynamic = "force-static";

const ROUTES = [
  "",
  "/platform",
  "/satellite-intelligence",
  "/simulation-engine",
  "/for-epcs",
  "/for-asset-owners",
  "/trust",
  "/changelog",
  "/company",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://solaris.energy";
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
