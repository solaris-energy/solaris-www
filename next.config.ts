import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";

const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-eval' 'unsafe-inline' 'wasm-unsafe-eval'"
  : "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'";

const connectSrc = isDev
  ? "connect-src 'self' ws: http: https:"
  : "connect-src 'self' https://plausible.solaris.energy https://tiles.openfreemap.org https://tiles.maps.eox.at https://s2maps-tiles.eu https://server.arcgisonline.com https://*.arcgisonline.com";

// MapLibre GL spins map rendering off into a Web Worker created from a blob:
// URL; without an explicit worker-src directive Chrome falls back to script-src
// and refuses to construct the worker. Map tile imagery is served by EOX
// (Sentinel-2 cloudless, low zoom) and Esri World Imagery (high zoom).
const workerSrc = "worker-src 'self' blob:";
const imgSrc =
  "img-src 'self' data: blob: https://tiles.openfreemap.org https://tiles.maps.eox.at https://s2maps-tiles.eu https://server.arcgisonline.com https://*.arcgisonline.com";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      scriptSrc,
      workerSrc,
      "style-src 'self' 'unsafe-inline'",
      imgSrc,
      "font-src 'self' data:",
      connectSrc,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  // credentialless lets the Draco WASM decoder load without forcing the
  // full COEP: require-corp posture (which would break self-hosted fonts
  // in certain Safari versions).
  { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
];

// GitHub Pages deploys this site under https://solaris-energy.github.io/solaris-www/.
// Locally we want assets at "/" so dev/preview keeps working. The Pages workflow
// sets NEXT_PUBLIC_BASE_PATH=/solaris-www, which we honor here and re-export so
// client code can prepend it to raw asset paths that bypass next/link + next/image.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const isStaticExport = process.env.NEXT_OUTPUT === "export" || !!basePath;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Static export for GitHub Pages. `headers()` and `redirects()` are no-ops
  // under `output: "export"`; CSP is enforced via a <meta> tag in app/layout.tsx.
  ...(isStaticExport ? { output: "export" as const } : {}),
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    // GitHub Pages is a static host — Next's image optimizer can't run there.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
    deviceSizes: [360, 640, 768, 1024, 1280, 1536, 1920, 2560],
    imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [],
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  // headers() and redirects() are silently ignored under output:"export".
  // Skip registering them so the build doesn't print the warning every time.
  ...(isStaticExport
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/(.*)",
              headers: securityHeaders,
            },
            {
              source: "/fonts/(.*)",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
            },
            {
              source: "/models/(.*)",
              headers: [
                {
                  key: "Cache-Control",
                  value: "public, max-age=31536000, immutable",
                },
              ],
            },
          ];
        },
        async redirects() {
          return [
            // Docs site lives under a separate subdomain. /docs on the
            // marketing site is just a hand-off.
            {
              source: "/docs",
              destination: "https://docs.solaris.energy",
              permanent: false,
              basePath: false,
            },
            {
              source: "/docs/:path*",
              destination: "https://docs.solaris.energy/:path*",
              permanent: false,
              basePath: false,
            },
          ];
        },
      }),
};

export default nextConfig;
