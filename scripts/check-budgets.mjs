#!/usr/bin/env node
/**
 * Budget gate. Run after `next build`.
 *
 * Checks:
 *   1. Hero-route (/) first-load JS <= 250 KB gzipped. Measured from the
 *      build manifests (rootMainFiles + /layout + /page entries), i.e. the
 *      JS a first visit actually downloads before interaction. Chunks that
 *      are lazy-loaded behind `next/dynamic` (the maplibre-gl cinematic)
 *      are intentionally outside the gate, same as the three.js exclusion
 *      that existed before the 3D hero was deleted on 2026-05-28.
 *   2. No single image in /public/shots exceeds 180 KB.
 *
 * Exits non-zero on violation. CI uses the exit code, not the output.
 */

import { readdir, stat, readFile } from "node:fs/promises";
import { join } from "node:path";
import { gzipSync } from "node:zlib";

const ROOT = process.cwd();
const HERO_JS_BUDGET_BYTES = 250 * 1024;
const IMAGE_BUDGET_BYTES = 180 * 1024;

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function readJson(p) {
  return JSON.parse(await readFile(p, "utf8"));
}

async function checkHeroJs() {
  const nextDir = join(ROOT, ".next");
  const buildManifest = await readJson(join(nextDir, "build-manifest.json"));
  const appManifest = await readJson(join(nextDir, "app-build-manifest.json"));

  const files = new Set([
    ...(buildManifest.rootMainFiles ?? []),
    ...(appManifest.pages?.["/layout"] ?? []),
    ...(appManifest.pages?.["/page"] ?? []),
  ]);

  let total = 0;
  const perFile = [];
  for (const f of files) {
    if (!f.endsWith(".js")) continue;
    const buf = await readFile(join(nextDir, f));
    const gz = gzipSync(buf).byteLength;
    total += gz;
    perFile.push({ file: f, gz });
  }
  perFile.sort((a, b) => b.gz - a.gz);
  return { total, perFile };
}

async function checkImages() {
  const dir = join(ROOT, "public", "shots");
  const violations = [];
  for await (const p of walk(dir)) {
    const s = await stat(p);
    if (s.size > IMAGE_BUDGET_BYTES) {
      violations.push({ path: p, size: s.size });
    }
  }
  return violations;
}

const fmt = (b) => `${(b / 1024).toFixed(1)} KB`;
let failed = false;

const { total, perFile } = await checkHeroJs();
console.log(
  `hero-route first-load JS (gzipped): ${fmt(total)} / ${fmt(HERO_JS_BUDGET_BYTES)}`,
);
for (const { file, gz } of perFile) {
  console.log(`  ${fmt(gz).padStart(9)}  ${file}`);
}
if (total > HERO_JS_BUDGET_BYTES) {
  console.error(`  BUDGET EXCEEDED by ${fmt(total - HERO_JS_BUDGET_BYTES)}`);
  failed = true;
}

const imgViolations = await checkImages();
console.log(`image weight check: ${imgViolations.length} violation(s)`);
for (const v of imgViolations) {
  console.error(`  ${v.path} -> ${fmt(v.size)} (max ${fmt(IMAGE_BUDGET_BYTES)})`);
  failed = true;
}

process.exit(failed ? 1 : 0);
