#!/usr/bin/env node
// DOSA rule (ARCHITECTURE.md §4) for Flutter apps: no raw colours in app code.
// Fails on Color(0x...), Color.fromARGB/fromRGBO and Material `Colors.*` (except transparent).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const apps = ['apps/staff-mobile/lib', 'apps/customer-mobile/lib'];
const re = /\bColor\(0x|\bColor\.from(?:ARGB|RGBO)\(|\bColors\.(?!transparent\b)\w+/g;
let problems = 0;
const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (name.endsWith('.dart')) {
      readFileSync(p, 'utf8').split('\n').forEach((line, i) => {
        for (const m of line.replace(/\/\/.*$/, '').matchAll(re)) {
          problems++;
          console.error(`✗ ${relative(process.cwd(), p)}:${i + 1}: raw colour "${m[0]}" — use DosaTheme.of(context)`);
        }
      });
    }
  }
};
apps.forEach(walk);
if (problems) { console.error(`${problems} raw colour(s) found.`); process.exit(1); }
console.log(`No raw colours in ${apps.join(', ')}.`);
