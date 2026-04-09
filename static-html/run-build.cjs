'use strict';
/**
 * run-build.cjs — Master build script
 * Assembles all page HTML from fragment files and form generators
 * Run: node run-build.cjs
 */
const fs   = require('fs');
const path = require('path');

const DIR  = __dirname;
const DIST = path.join(DIR, 'dist');

function mkdir(p) { fs.mkdirSync(p, {recursive:true}); }
function cp(src, dest) {
  if (!fs.existsSync(src)) return;
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    mkdir(dest);
    fs.readdirSync(src).forEach(f => cp(path.join(src,f), path.join(dest,f)));
  } else { mkdir(path.dirname(dest)); fs.copyFileSync(src, dest); }
}
function wf(rel, html) {
  const out = path.join(DIST, rel);
  mkdir(path.dirname(out));
  fs.writeFileSync(out, html, 'utf8');
  console.log('  wrote dist/' + rel, '(' + (html.length/1024).toFixed(0) + 'KB)');
}
function frag(name) {
  const p = path.join(DIR, 'fragments', name);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

// Load form generators
const { beefForm, porkForm } = require('./build-forms.cjs');

// Load page builders
const pages = require('./build-pages.cjs');

// ── Copy static assets ──────────────────────────────────────────────────────
console.log('\nBuilding Walnut Valley Meat Market...\n');
mkdir(DIST);
['css','js','images'].forEach(d => {
  cp(path.join(DIR,d), path.join(DIST,d));
  console.log('  copied', d + '/');
});

// ── Generate pages ───────────────────────────────────────────────────────────
const ctx = { beefForm, porkForm, frag };
const pageList = pages(ctx);

pageList.forEach(p => wf(p.file, p.html));

console.log('\nBuild complete!');
console.log('Pages:', pageList.map(p=>p.file).join(', '));

// Also run image rewrite
try {
  require('./rewrite-images.cjs');
} catch(e) { console.log('Image rewrite skipped:', e.message); }
