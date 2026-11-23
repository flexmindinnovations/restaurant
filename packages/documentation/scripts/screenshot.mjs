#!/usr/bin/env node
// Renders the specimen headlessly per theme and fails on console errors or broken assets.
//   node scripts/screenshot.mjs [outDir]
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const OUT = process.argv[2] || join(ROOT, '..', '.artifacts');
const PAGES = (process.env.PAGES || 'index.html').split(',');
const THEMES = (process.env.THEMES || 'admin-light,admin-monitor,staff-light,staff-kitchen,customer-warm').split(',');
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.webp': 'image/webp', '.woff2': 'font/woff2' };

const server = createServer(async (req, res) => {
  try {
    const p = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    const body = await readFile(p.endsWith('/') ? join(p, 'index.html') : p);
    res.writeHead(200, { 'content-type': TYPES[extname(p)] || 'application/octet-stream' }).end(body);
  } catch { res.writeHead(404).end('not found'); }
}).listen(0);
const port = server.address().port;
await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const problems = [];
for (const pageName of PAGES) {
  for (const theme of THEMES) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
    page.on('console', (m) => m.type() === 'error' && problems.push(`${pageName}/${theme}: console ${m.text()}`));
    page.on('response', (r) => r.status() >= 400 && problems.push(`${pageName}/${theme}: ${r.status()} ${r.url()}`));
    await page.goto(`http://localhost:${port}/${pageName}?theme=${theme}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const fonts = await page.evaluate(() => ['Inter', 'Plus Jakarta Sans'].map((f) => document.fonts.check(`16px "${f}"`)));
    if (fonts.includes(false)) problems.push(`${pageName}/${theme}: fonts not loaded ${fonts}`);
    await page.waitForTimeout(Number(process.env.WAIT || 300));
    const file = join(OUT, `${pageName.replace('.html', '')}-${theme}.png`);
    await page.screenshot({ path: file, fullPage: process.env.FULL !== '0' });
    console.log(`✓ ${file}`);
    await page.close();
  }
}
await browser.close();
server.close();
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
