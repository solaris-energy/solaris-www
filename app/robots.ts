import type { MetadataRoute } from "next";

// Static export requires the route to opt out of dynamic rendering.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: "https://solaris.energy/sitemap.xml",
  };
}
