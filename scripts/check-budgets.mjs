#!/usr/bin/env node
/**
 * Budget gate. Run after `next build`.
 *
 * Checks:
 *   1. Hero-route JS payload (excl. three.js chunks) <= 250 KB gzipped.
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

async function checkHeroJs() {
  const chunks = join(ROOT, ".next", "static", "chunks");
  let total = 0;
  const skipped = [];
  for await (const p of walk(chunks)) {
    if (!p.endsWith(".js")) continue;
    // Exclude three / R3F chunks — they are explicitly lazy.
    if (/three|fiber|drei|postprocessing/.test(p)) {
      skipped.push(p);
      continue;
    }
    const buf = await readFile(p);
    total += gzipSync(buf).byteLength;
  }
  return { total, skipped };
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

const { total, skipped } = await checkHeroJs();
console.log(`hero JS (gzipped, excl. 3D): ${fmt(total)} / ${fmt(HERO_JS_BUDGET_BYTES)}`);
console.log(`  excluded chunks: ${skipped.length}`);
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
