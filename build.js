// build.js — thin wrapper so KG Site Builder can trigger the real build
// The actual build logic lives in run-build.cjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
require('./run-build.cjs');
