const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const map = JSON.parse(fs.readFileSync(path.join(DIR, 'image-map.json'), 'utf8'));

// Also add friendly name aliases (for local src references in build-pages.cjs)
const nameAliases = {
  '5676f74ca_Walnut-Valley-logo1-1-1024x472.png': 'logo-desktop.png',
  'ef6ef9168_WalnutValleyMobileLogo.png':          'logo-mobile.png',
  'a3d33079d_logo-white.png':                      'logo-white.png',
  '61474fc54_desktop-background.jpg':              'desktop-background.jpg',
  'bdc69e356_mobile-background.jpg':               'mobile-background.jpg',
  '34c8322fa_desktop-copy.png':                    'desktop-copy.png',
  '04584cc4e_mobile-copy.png':                     'mobile-copy.png',
  '89f3c5e06_farmers-market-scaled.png':           'farmers-market.png',
  '00a753504_farmersmarket.png':                   'farmersmarket.png',
  '02f233cfa_Blank-Map4.png':                      'kansas-map.png',
  '886ea1293_Compass.png':                         'compass.png',
  'f70e8ea38_GroundBeef.png':                      'ground-beef-bg.png',
  'd79a304ee_ChatGPTImageFeb18202602_00_09PM.png': 'product-signature.png',
  '9e7aa24f6_ChatGPTImageFeb24202601_28_15PM.png': 'product-bacon.png',
  '2b6f28ab2_ChatGPTImageJan6202603_29_51PM.png':  'product-brats.png',
  '5f7c14694_ChatGPTImageFeb24202601_34_38PM.png': 'product-steaks.png',
  '2efbc9c08_ChatGPTImageJan6202603_35_03PM.png':  'product-ground.png',
  '37fdf5edb_ChatGPTImageJan6202603_36_36PM.png':  'product-specialty.png',
  '1854459bb_ChatGPTImageJan6202603_34_29PM.png':  'product-chicken.png',
  '958cea35a_ChatGPTImageJan6202603_32_45PM.png':  'product-pork.png',
  '60491d58e_ChatGPTImageJan6202603_35_45PM.png':  'product-sausage.png',
  'ca2fbeb56_ChatGPTImageJan6202603_29_06PM.png':  'product-cuts.png',
  'fe327cfe7_ChatGPTImageJan6202603_38_11PM.png':  'product-snack.png',
};

const imgDir = path.join(DIR, 'images');
const distImgDir = path.join(DIR, 'dist', 'images');
fs.mkdirSync(distImgDir, { recursive: true });

// Copy with friendly names
let copied = 0;
for (const [hashName, friendlyName] of Object.entries(nameAliases)) {
  const src  = path.join(imgDir, hashName);
  const dest = path.join(imgDir, friendlyName);
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    copied++;
  }
}
console.log('Created', copied, 'friendly-name aliases in images/');

// Copy all images to dist/images
let distCopied = 0;
for (const f of fs.readdirSync(imgDir)) {
  const src  = path.join(imgDir, f);
  const dest = path.join(distImgDir, f);
  fs.copyFileSync(src, dest);
  distCopied++;
}
console.log('Copied', distCopied, 'images to dist/images/');

// Rewrite HTML files in dist/ - replace remote URLs with local paths
const distDir = path.join(DIR, 'dist');
let totalReplaced = 0;

for (const f of fs.readdirSync(distDir)) {
  if (!f.endsWith('.html')) continue;
  const p = path.join(distDir, f);
  let html = fs.readFileSync(p, 'utf8');
  let count = 0;

  // Replace each remote URL with local path
  for (const { url, local } of map) {
    if (html.includes(url)) {
      html = html.split(url).join(local);
      count++;
    }
  }

  // Also replace any raw hash filenames with friendly names
  for (const [hashName, friendlyName] of Object.entries(nameAliases)) {
    const localHash = 'images/' + hashName;
    const localFriendly = 'images/' + friendlyName;
    if (html.includes(localHash)) {
      html = html.split(localHash).join(localFriendly);
    }
  }

  fs.writeFileSync(p, html, 'utf8');
  console.log(' ', f, '- replaced', count, 'URLs');
  totalReplaced += count;
}

console.log('\nTotal replacements:', totalReplaced);
console.log('Done. dist/images/ has', fs.readdirSync(distImgDir).length, 'files');
