// build.js — Walnut Valley static site builder entry point
// This file uses ES module syntax (required by package.json "type":"module")
// It delegates to the CJS runner via a child process
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = dirname(__filename);

execSync('node ' + join(__dirname, 'run-build.cjs'), { stdio: 'inherit' });
