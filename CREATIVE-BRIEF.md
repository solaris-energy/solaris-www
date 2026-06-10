# Creative Brief — solaris-www

> One screen, one promise: SOLARIS turns a satellite tile into a signable
> proposal in under thirty minutes. Everything below serves that line.

---

## 1. Voice

### Principles

1. **Numbers before adjectives.** "30 minutes" beats "blazingly fast".
2. **Restraint over enthusiasm.** Mission control, not a pitch deck.
3. **Technical credibility first, conversion second.** If the reader is a
   solar engineer, the copy survives their skepticism.
4. **Short sentences. Long thoughts.** Hemingway, not LinkedIn.
5. **No assumed inevitability.** We have to earn the claim every time.

### Vocabulary

**Use:**
satellite, irradiance, kWp, kWh, P50, P90, capacity factor, performance
ratio, bill of quantities, single-line diagram, string, MPPT, payback,
LCOE, EPC, asset owner, ground truth, telemetry, twin, simulation,
yield, polygon, AHJ, setback, ballast.

**Avoid:**
revolutionize, unleash, synergy, leverage (verb), next-generation,
seamless, holistic, end-to-end (when not literally true), AI-powered,
disruptive, game-changer, supercharge, empower, journey, ecosystem,
solutions (plural noun), best-in-class, world-class, paradigm,
innovative, cutting-edge, transformative.

**Banned outright:**
"In today's fast-paced world", "We believe", "Our mission is to",
anything ending in `™` outside a footer, the rocket emoji, the lightbulb
emoji, any emoji on landing copy.

### Tone calibration

| Surface        | Register                                                  |
| -------------- | --------------------------------------------------------- |
| Hero headline  | Declarative. Engineer-grade. No verbs of feeling.         |
| Section heads  | Telegraphic. Two to five words.                           |
| Body           | One idea per sentence. Numbers where possible.            |
| CTA            | Imperative, specific. "Request access" not "Get started". |
| Footer / legal | Neutral. No copy stunts.                                  |
| Error pages    | Honest. State what broke, offer a path.                   |

---

## 2. Color System

Dark-default. Light theme is a v2 concern. Single accent.

### Decision: solar-flare amber `#FFB23F`

Three reasons.

1. **Domain truth.** Amber is what irradiance heatmaps actually look like at
   peak. The color carries information the moment a returning visitor sees it.
2. **Differentiation.** Every clean-energy site of the last five years has
   defaulted to a cyan-green-electric-blue palette. Amber on near-black reads
   as a control-room signal, not a startup brochure.
3. **Optical weight.** Amber holds AAA contrast against our base at all UI
   sizes without needing to brighten to a neon. Cyan would have forced us
   into 200-level saturation and lost the restraint.

### Tokens

| Token                | Hex       | Use                                                      |
| -------------------- | --------- | -------------------------------------------------------- |
| `--bg-void`          | `#05070B` | Page base. The deepest surface.                          |
| `--bg-deep`          | `#0A0E14` | Section bands.                                           |
| `--bg-elevated`      | `#11161F` | Cards, code blocks.                                      |
| `--bg-edge`          | `#1B2230` | Borders, dividers.                                       |
| `--fg-primary`       | `#F4F6FA` | Primary text. Contrast 16.1:1 on `--bg-void`.            |
| `--fg-secondary`     | `#A7B0C0` | Secondary text. Contrast 7.8:1 on `--bg-void`.           |
| `--fg-tertiary`      | `#6B7488` | Captions, metadata. Contrast 4.6:1 on `--bg-void`.       |
| `--accent-flare`     | `#FFB23F` | The single brand accent. Contrast 10.2:1 on `--bg-void`. |
| `--accent-flare-hot` | `#FFD27A` | Hover, focus-ring brightening only.                      |
| `--accent-flare-dim` | `#A86F1F` | Pressed state, disabled accent.                          |
| `--signal-good`      | `#5DD39E` | Telemetry-OK, success.                                   |
| `--signal-warn`      | `#F2C94C` | Anomaly, warning.                                        |
| `--signal-bad`       | `#E5484D` | Error, failure.                                          |
| `--grid-line`        | `#1B2230` | Background grid stroke.                                  |

Contrast ratios verified against WCAG 2.2 AA (4.5:1 normal text, 3:1 large
text, 3:1 non-text components).

### Usage rules

- One accent per viewport. If two amber elements compete, demote one.
- Never use the accent as a background fill larger than 240 px on a side.
- Status colors are for status only — never decorative.

---

## 3. Typography

### Pairing

- **Display + UI sans:** `Inter Display` (700, 600) and `Inter` (500, 400).
- **Monospace:** `JetBrains Mono` (500, 400) for numbers, telemetry,
  inline code, and any string that represents a measured value.

### Why this pairing

Inter is the modern grotesque with the best optical sizing engine and the
widest weight range — it gives us cinematic display type and credible UI
type from one family, halving font payload. JetBrains Mono pairs cleanly
because both were designed in the same modern-humanist tradition, with
matching x-height proportions; the contrast is texture (mono vs. proportional),
not style clash. Rejected: IBM Plex (heavier on screen), Söhne (license
cost), system stack (no display weight).

### Scale (modular, 1.25 ratio, base 16 px)

| Token       | Size    | Line height | Use                     |
| ----------- | ------- | ----------- | ----------------------- |
| `display-1` | 72 / 80 | 1.05        | Hero headline (desktop) |
| `display-2` | 56 / 64 | 1.05        | Section heroes          |
| `h1`        | 40      | 1.15        | Page titles             |
| `h2`        | 32      | 1.2         | Section heads           |
| `h3`        | 24      | 1.3         | Sub-sections            |
| `body-l`    | 18      | 1.55        | Lede paragraphs         |
| `body`      | 16      | 1.6         | Body                    |
| `body-s`    | 14      | 1.55        | Secondary               |
| `mono-l`    | 16      | 1.5         | Inline measurements     |
| `mono`      | 14      | 1.5         | Metadata, captions      |
| `mono-s`    | 12      | 1.4         | Telemetry annotations   |

Mobile: `display-1` shrinks to 44 / 48 with a fluid `clamp()`.

### Rules

- Numbers in body copy use `JetBrains Mono` even mid-sentence. Tabular
  figures only.
- Never letterspace lowercase. Tracking is for uppercase mono only.
- No italics outside MDX prose. Italics in UI signal nothing and add weight.

---

## 4. Motion

### Principles

1. **Motion has meaning or it doesn't ship.** Decoration is not a reason.
2. **Sub-250 ms for UI feedback.** Cinematic set-pieces may run longer
   when they communicate something physical (a satellite resolving, a
   panel array populating).
3. **Easing is mechanical, not bouncy.** No overshoot, no spring rebound.
   We are not a consumer app.
4. **Hover is a hint, not a show.** Color shift, underline accent. No
   transforms larger than 2 px.
5. **Scroll-linked motion never traps the user.** No scroll-jacking;
   `position: sticky` over fake scroll any day.

### Tokens

| Token             | Value                            |
| ----------------- | -------------------------------- |
| `--ease-out`      | `cubic-bezier(0.2, 0.6, 0.1, 1)` |
| `--ease-inout`    | `cubic-bezier(0.5, 0, 0.2, 1)`   |
| `--dur-instant`   | `80ms`                           |
| `--dur-fast`      | `160ms`                          |
| `--dur-base`      | `220ms`                          |
| `--dur-slow`      | `400ms`                          |
| `--dur-cinematic` | `1200ms` (set-pieces only)       |

### Reduced motion

Under `prefers-reduced-motion: reduce`:

- All shaders freeze to the first painted frame.
- Scroll-linked transforms become opacity fades only (200 ms).
- The hero 3D scene falls back to a single rendered still (`/public/hero-still.avif`).
- Auto-playing sequences pause; user can opt in via a "Play sequence" button.

---

## 5. Iconography & Illustration

### Iconography

- Stroke-based, 1.5 px at 24 px, square corners, no fills.
- Source: Phosphor Icons (regular weight). Custom icons match grid + stroke.
- Color: `--fg-secondary`. Accent only when the icon represents the
  accent-colored state.
- Never decorative inside text. Icons earn pixels.

### Illustration register

Not illustrated. We use:

- **Diagrams** (single-line, mono labels, accent for the critical path).
- **Annotated screenshots** of the product, captured at 2x, dark theme,
  with telemetry-style callouts.
- **Map cutouts** (MapLibre exports of real warehouses, redacted address).
- **Data visualizations** (Observable Plot or D3, dark theme, accent on
  the focal series).

No stock photography. No 3D renders of cartoon people. No isometric
illustrations of "the cloud".

---

## 6. Photography & 3D Treatment

### Photography (rare; only on `/company` and case studies)

- Documentary, not staged. Real installations, real teams.
- Warm grade with shadows pulled toward `#0A0E14`; highlights toward
  `#F4F6FA`. Saturation -10. No HDR halos.
- 4:3 or 3:2. No extreme widescreen crops.

### 3D treatment

- Subject: satellites, rooftops, panel arrays, irradiance fields. Never
  abstract blobs or "data spheres".
- Materials: matte metallic for satellites, low-spec for terrain. No
  glass, no chrome, no automotive paint.
- Lighting: single directional key at golden-hour angle (45 deg az,
  15 deg el), `#FFE3B0`, plus a hemispheric fill at `#0A0E14`.
- Postprocessing: subtle film grain (0.02), no bloom above 0.15, no
  chromatic aberration.
- Polycount: under 80 k triangles on the hero scene. Draco-compressed
  GLB.
- The scene runs at 30 fps minimum on Iris Xe. Below that, drop to the
  still image.

---

## 7. Voice Examples (do / don't)

| Don't                                              | Do                                                                 |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| "Unleash the power of AI for your solar projects." | "From satellite tile to signed proposal in 28 minutes, median."    |
| "Our cutting-edge platform empowers EPCs."         | "Built for EPCs running 5 to 50 MW per year of C&I installations." |
| "Revolutionize your design workflow."              | "Replace the screenshot. Keep the engineer."                       |
| "Seamless end-to-end integration."                 | "OIDC, OpenAPI 3.1, AsyncAPI 3. Pin a tag, ship."                  |
| "Solar made simple."                               | "Solar is not simple. Your tools should be."                       |
