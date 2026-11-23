#!/usr/bin/env node
// DOSA rule (ARCHITECTURE.md §4): application code uses tokens, never raw colours.
// Fails on hex colours and rgb()/hsl() literals in app source. Material bridge maps var() only.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('../src', import.meta.url).pathname;
const patterns = [
  { re: /#[0-9a-f]{3,8}\b(?![-\w])/gi, what: 'hex colour' },
  { re: /\b(?:rgb|rgba|hsl|hsla|oklch)\(/gi, what: 'colour function' },
];
const exts = /\.(scss|css|html|ts)$/;
let problems = 0;

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (exts.test(name)) check(p);
  }
}

function check(file) {
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    // Ignore comments and Angular template ids such as #input.
    const code = line.replace(/\/\/.*$|\/\*.*?\*\//g, '');
    for (const { re, what } of patterns) {
      for (const m of code.matchAll(re)) {
        if (what === 'hex colour' && file.endsWith('.html')) continue; // template reference variables
        problems++;
        console.error(`✗ ${relative(process.cwd(), file)}:${i + 1}: raw ${what} "${m[0]}" — use a --dosa-* token`);
      }
    }
  });
}

walk(root);
if (problems) {
  console.error(`${problems} raw value(s) found.`);
  process.exit(1);
}
console.log('No raw colours in apps/admin-web/src.');
