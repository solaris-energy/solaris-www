import type { Config } from "tailwindcss";

// Tokens are declared in styles/globals.css via @theme.
// Tailwind v4 reads them from CSS, so this file stays minimal.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
