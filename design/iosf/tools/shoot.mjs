// Render a .dc.html artboard as a standalone page and screenshot it.
// Google Fonts are fetched via curl (proxy-aware) and inlined as data URIs,
// because the sandboxed browser has no egress of its own.
// usage: node tools/shoot.mjs <Artboard.dc.html> <out.png> [widthPx]
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import pw from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pw;

const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';
const CACHE = '/tmp/claude-0/-home-user-Luna-tune/b2867e04-785a-517e-a96f-458bb2645a57/scratchpad/fontcache';
if (!existsSync(CACHE)) mkdirSync(CACHE, { recursive: true });
const curl = (url, bin) => {
  const key = join(CACHE, Buffer.from(url).toString('base64url').slice(0, 120) + (bin ? '.bin' : '.txt'));
  if (!existsSync(key)) execFileSync('curl', ['-sSL', '-A', UA, '-o', key, url], { stdio: ['ignore', 'ignore', 'inherit'] });
  return bin ? readFileSync(key) : readFileSync(key, 'utf8');
};

const [src, out, widthArg] = process.argv.slice(2);
if (!src || !out) { console.error('usage: shoot.mjs <Artboard.dc.html> <out.png> [width]'); process.exit(1); }
const width = Number(widthArg || 1160);

const raw = readFileSync(resolve(src), 'utf8');
const bodyMatch = raw.match(/<x-dc>([\s\S]*?)<\/x-dc>/);
if (!bodyMatch) { console.error('no <x-dc> block in ' + src); process.exit(1); }
let content = bodyMatch[1];
const helmet = content.match(/<helmet>([\s\S]*?)<\/helmet>/);
let head = helmet ? helmet[1] : '';
content = content.replace(/<helmet>[\s\S]*?<\/helmet>/, '');

// swap each Google Fonts <link> for a stylesheet with data-URI faces
let faceCount = 0;
head = head.replace(/<link[^>]*href="(https:\/\/fonts\.googleapis\.com\/[^"]+)"[^>]*>/g, (_m, href) => {
  let css = curl(href.replace(/&amp;/g, '&'));
  css = css.replace(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+)\)/g, (_u, fontUrl) => {
    faceCount++;
    return `url(data:font/woff2;base64,${curl(fontUrl, true).toString('base64')})`;
  });
  return `<style>${css}</style>`;
});

const page = `<!doctype html><html><head><meta charset="utf-8">${head}</head><body>${content}</body></html>`;
const tmp = join(dirname(resolve(out)), '.preview.html');
writeFileSync(tmp, page);

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const ctx = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 2 });
const p = await ctx.newPage();
await p.goto('file://' + tmp, { waitUntil: 'load' });
try { await p.evaluate(() => document.fonts.ready); } catch {}
await p.waitForTimeout(400);
const loaded = await p.evaluate(() => [...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))]);
const h = await p.evaluate(() => document.documentElement.scrollHeight);
await p.screenshot({ path: resolve(out), fullPage: true });
await browser.close();
console.log(`${out} — ${width}x${h} css px @2x · ${faceCount} faces inlined · rendering: ${loaded.join(', ') || 'FALLBACKS ONLY'}`);
