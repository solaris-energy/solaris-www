// Resolve a public/ asset path with the deploy-time basePath prepended.
// next/link and next/image apply basePath automatically; raw <img> tags and
// <link rel="preload"> in app/layout.tsx do not, so they go through this.
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
