import type { Metadata, Viewport } from "next";
import "../styles/globals.css";
import "maplibre-gl/dist/maplibre-gl.css";
import { SiteHeader } from "../components/nav/SiteHeader";

export const metadata: Metadata = {
  metadataBase: new URL("https://solaris.energy"),
  title: {
    default: "SOLARIS — Industrial solar, from satellite to signature.",
    template: "%s — SOLARIS",
  },
  description:
    "SOLARIS designs, simulates, and prices commercial and industrial solar from satellite imagery. Built for EPCs and asset owners who refuse the 21-day proposal cycle.",
  applicationName: "SOLARIS",
  authors: [{ name: "SOLARIS" }],
  generator: "Next.js",
  keywords: [
    "industrial solar",
    "commercial solar",
    "solar design",
    "PV simulation",
    "EPC",
    "asset owner",
    "satellite",
    "pvlib",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: "SOLARIS",
    title: "SOLARIS — Industrial solar, from satellite to signature.",
    description:
      "Satellite tile to signed proposal. Built for EPCs and asset owners.",
    url: "https://solaris.energy",
    images: [{ url: "/og/home.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SOLARIS",
    description:
      "Satellite tile to signed proposal. Built for EPCs and asset owners.",
    images: ["/og/home.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#05070B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Self-hosted fonts. Preload the two faces used above the fold. */}
        <link
          rel="preload"
          href="/fonts/inter-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/jetbrains-mono-variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-[color:var(--color-bg-void)] text-[color:var(--color-fg-primary)] antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
