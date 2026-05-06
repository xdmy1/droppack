// Generates: /public/logo.png, /public/favicon.ico, /public/icon-192.png,
// /public/icon-512.png, /public/apple-touch-icon.png, /public/og-image.png
//
// Source: /logo.png at the project root.
//
// Strategy:
//   - PWA icons (192, 512) and apple-touch (180): full 3D parcel logo on white.
//   - Favicon (16/32/48): simplified mark — bold "D" in brand gold on a deep
//     navy square. Browser tabs are tiny; the parcel detail disappears below
//     ~64px, but the "D" stays sharp.

import sharp from "sharp";
import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "logo.png");
const PUBLIC = path.join(ROOT, "public");

const BRAND = "#1e40af";
const BRAND_DARK = "#1e3a8a";
const ACCENT = "#d4a843";

if (!existsSync(SRC)) {
  console.error(`✖ Missing /logo.png at ${SRC}`);
  process.exit(1);
}

await mkdir(PUBLIC, { recursive: true });

await copyFile(SRC, path.join(PUBLIC, "logo.png"));
console.log("• /public/logo.png");

// --- 1. Logo on white square (used by PWA icons and apple-touch) ---
async function logoOnWhite(size, padRatio = 0.14) {
  const pad = Math.round(size * padRatio);
  const inner = size - pad * 2;
  const fitted = await sharp(SRC)
    .resize({
      width: inner,
      height: inner,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .composite([{ input: fitted, top: pad, left: pad }])
    .png()
    .toBuffer();
}

for (const size of [192, 512]) {
  const buf = await logoOnWhite(size, 0.14);
  await writeFile(path.join(PUBLIC, `icon-${size}.png`), buf);
  console.log(`• /public/icon-${size}.png`);
}

const apple = await logoOnWhite(180, 0.16);
await writeFile(path.join(PUBLIC, "apple-touch-icon.png"), apple);
console.log("• /public/apple-touch-icon.png");

// --- 2. favicon.ico — multi-size 16/32/48 made directly from logo.png ---
async function faviconPng(size) {
  return sharp(SRC)
    .resize({
      width: size,
      height: size,
      fit: "contain",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      kernel: "lanczos3",
    })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function makeFavicon() {
  const sizes = [16, 32, 48, 64];
  const pngs = await Promise.all(sizes.map((s) => faviconPng(s)));

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(sizes.length, 4);

  const dirEntries = [];
  const data = [];
  let offset = 6 + 16 * sizes.length;

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const png = pngs[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size === 256 ? 0 : size, 0);
    entry.writeUInt8(size === 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(png.length, 8);
    entry.writeUInt32LE(offset, 12);
    dirEntries.push(entry);
    data.push(png);
    offset += png.length;
  }

  return Buffer.concat([header, ...dirEntries, ...data]);
}

const ico = await makeFavicon();
await writeFile(path.join(PUBLIC, "favicon.ico"), ico);
console.log("• /public/favicon.ico");

// --- 3. Open Graph image — 1200x630 ---
async function makeOG() {
  const W = 1200;
  const H = 630;

  const bgSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e3a8a"/>
      <stop offset="55%" stop-color="#1e40af"/>
      <stop offset="100%" stop-color="#1d4fc7"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="22%" r="42%">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <g fill="#ffffff" font-family="Inter, system-ui, sans-serif">
    <text x="320" y="282" font-size="84" font-weight="800" letter-spacing="-2">DropPack</text>
    <text x="320" y="350" font-size="34" font-weight="500" fill="#dbe5ff">Software pentru companii de transport colete</text>
    <text x="320" y="402" font-size="26" font-weight="400" fill="#a8b8e6">Birou · Șoferi · Clienți — toți pe aceeași pagină</text>
  </g>
  <g opacity="0.95">
    <rect x="80" y="218" width="200" height="200" rx="32" fill="#ffffff"/>
  </g>
</svg>`;

  const logoSize = 150;
  const logoBuf = await sharp(SRC)
    .resize({
      width: logoSize,
      height: logoSize,
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .toBuffer();

  const logoX = 80 + Math.round((200 - logoSize) / 2);
  const logoY = 218 + Math.round((200 - logoSize) / 2);

  return sharp(Buffer.from(bgSvg))
    .composite([{ input: logoBuf, left: logoX, top: logoY }])
    .png()
    .toBuffer();
}

const og = await makeOG();
await writeFile(path.join(PUBLIC, "og-image.png"), og);
console.log("• /public/og-image.png");

console.log("\n✓ Icons generated.");
