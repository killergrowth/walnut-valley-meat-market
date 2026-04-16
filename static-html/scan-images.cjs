const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const DIR = __dirname;

// Collect all URLs from dist HTML files and React source
const urls = new Set();

function scanText(content) {
  const re = /https?:\/\/[a-zA-Z0-9._\-\/\%\+\?\&\=\#]+\.(png|jpg|jpeg|gif|webp|svg)/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    const u = m[0];
    if (u.includes('supabase.co') || u.includes('cloudfront.net')) {
      urls.add(u);
    }
  }
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    if (st.isDirectory()) scanDir(p);
    else if (/\.(jsx?|tsx?|css|html)$/.test(f)) {
      try { scanText(fs.readFileSync(p, 'utf8')); } catch(e) {}
    }
  }
}

scanDir(path.join(DIR, '..', 'src'));
scanDir(path.join(DIR, '..', 'public'));
scanDir(path.join(DIR, 'dist'));

const urlList = [...urls];
console.log('Found', urlList.length, 'unique remote image URLs');
urlList.forEach(u => console.log(' ', u));

// Download each image
function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { resolve(); return; }
    const file = fs.createWriteStream(dest);
    const mod = url.startsWith('https') ? https : http;
    mod.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        fs.unlink(dest, () => {});
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => {
      file.close();
      try { fs.unlink(dest, () => {}); } catch(e) {}
      reject(err);
    });
  });
}

function urlToFilename(url) {
  // Use the last segment of the URL as the filename
  const u = url.split('?')[0];
  return path.basename(u);
}

async function main() {
  const imgDir = path.join(DIR, 'images');
  fs.mkdirSync(imgDir, { recursive: true });

  const pairs = urlList.map(url => ({ url, filename: urlToFilename(url) }));

  // Dedupe by filename (keep first)
  const seen = new Set();
  const deduped = pairs.filter(p => {
    if (seen.has(p.filename)) return false;
    seen.add(p.filename);
    return true;
  });

  console.log('\nDownloading', deduped.length, 'images...');
  let ok = 0, fail = 0;
  for (const { url, filename } of deduped) {
    const dest = path.join(imgDir, filename);
    try {
      await download(url, dest);
      const size = fs.statSync(dest).size;
      console.log('  OK', filename, '(' + Math.round(size/1024) + 'KB)');
      ok++;
    } catch(e) {
      console.log('  FAIL', filename, e.message);
      fail++;
    }
  }

  console.log('\nDone:', ok, 'downloaded,', fail, 'failed');

  // Emit mapping for HTML rewriting
  const mapping = deduped.map(p => ({ url: p.url, local: 'images/' + p.filename }));
  fs.writeFileSync(path.join(DIR, 'image-map.json'), JSON.stringify(mapping, null, 2), 'utf8');
  console.log('Wrote image-map.json with', mapping.length, 'entries');
}

main().catch(e => { console.error(e); process.exit(1); });
