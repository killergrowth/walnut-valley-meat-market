'use strict';
const fs   = require('fs');
const path = require('path');
const D    = __dirname;

function w(filename, content) {
  const p = path.join(D, filename);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, content, 'utf8');
  console.log('wrote', filename);
}

const YR = new Date().getFullYear();
const SB = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/';

// ─── templates ────────────────────────────────────────────────────────────────

function pageShell(page, title, desc, body) {
  const isHome = page === 'home';
  const hc   = isHome ? 'bg-red-700 text-white' : 'text-stone-700 hover:bg-stone-100';
  const mhc  = isHome ? 'bg-red-700 text-white' : 'text-stone-700 hover:bg-stone-100';

  const deskAnchors = isHome ? `
      <a href="#bundles"    class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Bundles</a>
      <a href="#calculator" class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Fill Your Freezer</a>
      <a href="#locations"  class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Locations</a>
      <a href="#products"   class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Products</a>
      <a href="#about"      class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Our Story</a>` : '';

  const mobAnchors = isHome ? `
      <div class="border-t border-stone-100 mt-2 pt-2">
        <p class="text-xs font-bold text-stone-400 px-4 pb-1 uppercase tracking-wide">Jump To</p>
        <a href="#bundles"    class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Bundles</a>
        <a href="#calculator" class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Fill Your Freezer</a>
        <a href="#locations"  class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Locations</a>
        <a href="#products"   class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Products</a>
        <a href="#about"      class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Our Story</a>
      </div>` : '';

  const logo    = `images/logo-desktop.png`;
  const logoFB  = SB + `5676f74ca_Walnut-Valley-logo1-1-1024x472.png`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title>
<meta name="description" content="${desc}"/>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{fontFamily:{chunkfive:['"ChunkFive"','serif']}}}}</script>
<style>
@font-face{font-family:'ChunkFive';src:url('https://cdn.jsdelivr.net/npm/@fontsource/chunk-five@4.5.0/files/chunk-five-latin-800-normal.woff2') format('woff2');font-weight:800;font-display:swap}
.font-chunkfive{font-family:'ChunkFive',serif;font-weight:800}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}
.chevron-bounce{animation:bounce 1.5s infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.spinner{width:1.25rem;height:1.25rem;border:3px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle}
.form-sect-body{display:none}.form-sect-body.open{display:block}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;pointer-events:none;transition:opacity .2s}
.modal-bg.open{opacity:1;pointer-events:all}
.modal-box{background:#fff;border-radius:1rem;max-width:32rem;width:100%;max-height:90vh;overflow-y:auto;padding:1.5rem;transform:scale(.95);transition:transform .2s}
.modal-bg.open .modal-box{transform:scale(1)}
.animal-btn-card{position:relative;padding:1.5rem;border-radius:.75rem;border:2px solid #e7e5e4;background:#fff;cursor:pointer;text-align:left;transition:all .15s;width:100%}
.animal-btn-card.selected{border-color:#b91c1c;background:#fef2f2}
.qty-card{padding:.75rem;border-radius:.75rem;border:2px solid #e7e5e4;background:#fff;cursor:pointer;text-align:center;transition:all .15s;width:100%}
.qty-card.selected{border-color:#b91c1c;background:#fef2f2}
.review-slide{display:none}
.rev-dot{width:.5rem;height:.5rem;border-radius:9999px;background:#d6d3d1;border:none;cursor:pointer;transition:all .15s}
.rev-dot.active{background:#b91c1c;width:1.5rem}
.bsel-btn{padding:.75rem;border-radius:.5rem;border:2px solid #e7e5e4;background:#fff;cursor:pointer;text-align:center;width:100%}
.bsel-btn.selected{border-color:#b91c1c;background:#fef2f2}
</style>
<link rel="stylesheet" href="css/styles.css"/>
</head>
<body data-page="${page}" class="min-h-screen bg-stone-50 flex flex-col">

<header class="bg-white shadow-sm sticky top-0 z-50">
  <div class="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
    <a href="index.html" id="logo-link">
      <img src="${logo}" alt="Walnut Valley Meat Market" class="h-12 md:h-16" onerror="this.src='${logoFB}'"/>
    </a>
    <nav class="hidden lg:flex items-center gap-1">
      <a href="index.html" class="px-4 py-2 rounded-full text-base font-bold font-chunkfive transition-colors ${hc}">Home</a>
      ${deskAnchors}
      <a href="index.html#contact" class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Contact Us</a>
    </nav>
    <button class="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100" id="menu-toggle">
      <svg id="icon-menu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      <svg id="icon-close" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
  <div class="lg:hidden bg-white border-t border-stone-100 px-4 pb-4 hidden" id="mobile-menu">
    <a href="index.html" class="block px-4 py-3 rounded-xl text-sm font-bold font-chunkfive mt-1 ${mhc}">Home</a>
    ${mobAnchors}
    <div class="border-t border-stone-100 mt-2 pt-2">
      <a href="index.html#contact" class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Contact Us</a>
    </div>
  </div>
</header>

<main class="flex-1">
${body}
</main>

<footer class="bg-stone-800 text-stone-400 py-12 px-4">
  <div class="max-w-5xl mx-auto">
    <div class="grid md:grid-cols-3 gap-8 mb-8">
      <div>
        <a href="index.html"><img src="${logo}" alt="Walnut Valley Meat Market" class="h-10 opacity-80 mb-4" onerror="this.src='${logoFB}'"/></a>
        <p class="text-sm">Quality meat since 2004. Family-owned and USDA inspected.</p>
      </div>
      <div>
        <h4 class="font-chunkfive text-white mb-3">Navigation</h4>
        <ul class="space-y-2 text-sm">
          <li><a href="index.html" class="hover:text-white">Home</a></li>
          <li><a href="fill-your-freezer.html" class="hover:text-white">Cutting Order</a></li>
          <li><a href="index.html#locations" class="hover:text-white">Locations</a></li>
          <li><a href="index.html#products" class="hover:text-white">Products</a></li>
          <li><a href="index.html#about" class="hover:text-white">Our Story</a></li>
          <li><a href="index.html#calculator" class="hover:text-white">Cost Calculator</a></li>
          <li><a href="index.html#contact" class="hover:text-white">Contact Us</a></li>
        </ul>
      </div>
      <div>
        <h4 class="font-chunkfive text-white mb-3">Contact</h4>
        <p class="text-sm mb-2">El Dorado: <a href="tel:+13163213595" class="hover:text-white">(316) 321-3595</a></p>
        <p class="text-sm mb-2">Augusta: <a href="tel:+13162953395" class="hover:text-white">(316) 295-3395</a></p>
        <p class="text-sm mb-4">Andover: <a href="tel:+13163587903" class="hover:text-white">(316) 358-7903</a></p>
        <h4 class="font-chunkfive text-white mb-3">Follow Us</h4>
        <div class="space-y-2 text-sm">
          <a href="https://www.instagram.com/walnutvalleypacking" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white">&#x1F4F8; @walnutvalleypacking</a>
          <a href="https://www.facebook.com/walnutvalley/videos/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white">&#x1F4CC; El Dorado Facebook</a>
          <a href="https://www.facebook.com/walnutvalleymeatmarket/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white">&#x1F4CC; Augusta Facebook</a>
          <a href="https://www.facebook.com/walnutvalleymeatmarketandover/mentions/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white">&#x1F4CC; Andover Facebook</a>
        </div>
      </div>
    </div>
    <div class="border-t border-stone-700 pt-6 text-center text-xs">
      <p>&copy; ${YR} Walnut Valley Packing LLC. All Rights Reserved.</p>
    </div>
  </div>
</footer>

<script src="js/main.js"></script>
</body>
</html>`;
}

// ── data ───────────────────────────────────────────────────────────────────────

const LOCS = [
  { name:'El Dorado', addr:'1000 S. Main St.', city:'El Dorado, KS',  phone:'(316) 321-3595', tel:'+13163213595', hours:['Mon–Fri: 8:00 am – 6:00 pm','Sat: 8:00 am – 1:00 pm','Sun: Closed'],   map:'https://www.google.com/maps/place/1000+S+Main+St,+El+Dorado,+KS+67042', badge:'Main Location' },
  { name:'Augusta',   addr:'293 7th St.',       city:'Augusta, KS',    phone:'(316) 295-3395', tel:'+13162953395', hours:['Tue–Sat: 10:00 am – 6:00 pm','Sun–Mon: Closed'],                       map:'https://www.google.com/maps/place/293+7th+St,+Augusta,+KS+67010',         badge:null },
  { name:'Andover',   addr:'620 N. Andover Rd.',city:'Andover, KS',    phone:'(316) 358-7903', tel:'+13163587903', hours:['Tue–Sat: 10:00 am – 6:00 pm','Sun–Mon: Closed'],                       map:'https://www.google.com/maps/place/620+N+Andover+Rd,+Andover+KS+67002',     badge:'Prime Cuts Available' },
];

const PRODS = [
  { cat:'Signature Items',    items:['Famous Grizzly Burger Patties','Jalapeno Grizzly Burger Patties','Grizzly Burger Brats','Jalapeno Grizzly Burger Brats'],                      img:'images/product-signature.png', fb:SB+'d79a304ee_ChatGPTImageFeb18202602_00_09PM.png' },
  { cat:'Bacon Selection',    items:['Blue Ribbon Bacon','Jalapeno Bacon','Black Pepper Bacon','Simply Bacon (water, salt & celery juice only)'],                                   img:'images/product-bacon.png',     fb:SB+'9e7aa24f6_ChatGPTImageFeb24202601_28_15PM.png' },
  { cat:'Bratwurst',          items:['Original Brats','Cheese Brats','Boudin Brats','Philly Swiss Brats'],                                                                         img:'images/product-brats.png',     fb:SB+'2b6f28ab2_ChatGPTImageJan6202603_29_51PM.png'  },
  { cat:'USDA Choice Steaks', items:['Ribeye (Prime in Andover)','Filet Mignon (Prime in Andover)','KC Strip','Sirloin'],                                                          img:'images/product-steaks.png',    fb:SB+'5f7c14694_ChatGPTImageFeb24202601_34_38PM.png', contain:true },
  { cat:'Ground Beef',        items:['85% Lean Ground Beef','90% Lean Ground Sirloin'],                                                                                            img:'images/product-ground.png',    fb:SB+'2efbc9c08_ChatGPTImageJan6202603_35_03PM.png'  },
  { cat:'Specialty Items',    items:['Summer Sausage (Original, Cheese, Jalapeno/Cheese, Ghost Pepper)','Snack Sticks (Original, Cheese, Jalapeno/Cheese)'],                      img:'images/product-specialty.png', fb:SB+'37fdf5edb_ChatGPTImageJan6202603_36_36PM.png'  },
];

const REVS = [
  { n:'Marcia Callaway',   loc:'El Dorado, KS', t:'Everything I have purchased at Walnut Valley Meat Market has been great! I especially like their ground beef. All the employees are super nice and knowledgeable about their products!', s:5 },
  { n:'Sonja Patterson',   loc:'El Dorado, KS', t:"Since I started purchasing from Walnut Valley I am a fan of their hamburger. Don't plan to buy anywhere else. Fast, friendly and helpful.", s:5 },
  { n:'Glenn Terrones',    loc:'El Dorado, KS', t:'Awesome Staff and Fantastic Quality! The staff was truly awesome and friendly, making the whole experience a pleasure. The quality of the meat is great.', s:5 },
  { n:'Cindy Cowell',      loc:'El Dorado, KS', t:'Literally, the best meats come from Walnut Valley. We originally bought half a beef and half a hog in fall 2020. The meat was delicious.', s:5 },
  { n:'Theresa Werth',     loc:'El Dorado, KS', t:"I absolutely love your meats!! The 85/15 hamburger... you don't even need to drain it when cooking with it. That tells me just how healthy it is.", s:5 },
  { n:'Tricia Schlesener', loc:'El Dorado, KS', t:'Best place in town to buy meat. Quality and price cannot be beat and the service is always great!! I recommend on a regular basis!!', s:5 },
  { n:'Charlene Baker',    loc:'El Dorado, KS', t:'Super nice customer service. The summer sausage with cheese in it was amazing. Everyone loved it at Thanksgiving.', s:5 },
  { n:'Nolan Andrews',     loc:'El Dorado, KS', t:'These guys are fantastic! The meat is of the utmost quality and they are so knowledgeable and friendly! Much better than a big store!', s:5 },
];

// ── mini HTML helpers ──────────────────────────────────────────────────────────

function stars(n) {
  return Array(n).fill('<svg class="w-5 h-5 inline-block" style="fill:#fbbf24" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>').join('');
}

function locCard(loc) {
  const badge = loc.badge ? `<span class="absolute top-3 right-3 bg-amber-400 text-stone-900 text-xs font-bold px-2 py-1 rounded-full">${loc.badge}</span>` : '';
  const hrs   = loc.hours.map(h => `<p>${h}</p>`).join('');
  return `<div class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
  <div class="bg-red-700 text-white p-4 relative"><h3 class="text-xl font-bold">${loc.name}</h3>${badge}</div>
  <div class="p-5 space-y-4 flex flex-col flex-1">
    <div class="flex items-start gap-3"><svg class="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg><div><p class="font-medium text-stone-800">${loc.addr}</p><p class="text-stone-600">${loc.city}</p></div></div>
    <div class="flex items-center gap-3"><svg class="w-5 h-5 text-red-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg><a href="tel:${loc.tel}" class="font-medium text-red-700 hover:text-red-800">${loc.phone}</a></div>
    <div class="flex items-start gap-3"><svg class="w-5 h-5 text-red-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><div class="text-sm text-stone-600">${hrs}</div></div>
    <div class="flex gap-2 pt-2 mt-auto">
      <a href="tel:${loc.tel}" class="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-4 rounded-full text-center text-sm transition-colors">Call</a>
      <a href="${loc.map}" target="_blank" rel="noopener noreferrer" class="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-4 rounded-full text-center text-sm flex items-center justify-center gap-1 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
        Directions
      </a>
    </div>
  </div>
</div>`;
}

function prodCard(p) {
  const ic = p.contain ? 'object-contain scale-150' : 'object-cover';
  return `<div class="bg-stone-50 rounded-xl overflow-hidden group hover:shadow-lg transition-shadow">
  <div class="h-60 overflow-hidden bg-white"><img src="${p.img}" alt="${p.cat}" class="w-full h-full ${ic} transition-transform duration-300 group-hover:scale-105" onerror="this.src='${p.fb}'"/></div>
  <div class="p-5"><h3 class="font-bold text-red-700 mb-3">${p.cat}</h3><ul class="space-y-2">${p.items.map(i => `<li class="text-stone-700 text-sm pl-4 border-l-2 border-red-200">${i}</li>`).join('')}</ul></div>
</div>`;
}

// ── cutting order helpers ──────────────────────────────────────────────────────

function fsec(num, title, defsJson, tip, inner, open) {
  const oc  = open ? ' open' : '';
  const da  = defsJson ? ` data-definitions='${defsJson}'` : '';
  const ta  = tip     ? ` data-tip="${tip.replace(/"/g,'&quot;')}"` : '';
  const hb  = defsJson ? `<button type="button" class="help-btn ml-2 text-xs font-semibold text-red-700 underline"${da}${ta} data-title="${title}">Help</button>` : '';
  return `<div class="bg-white rounded-xl border border-stone-200 overflow-hidden mb-4">
  <button type="button" class="w-full px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors form-sect-hdr${oc}" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')">
    <span class="font-bold text-stone-800">${num}. ${title}${hb}</span>
    <svg class="w-5 h-5 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
  </button>
  <div class="form-sect-body px-5 pb-5${oc}">${inner}</div>
</div>`;
}

function radio(name, id, val, label, checked) {
  return `<div class="flex items-center gap-2 mb-2"><input type="radio" name="${name}" id="${id}" value="${val}"${checked ? ' checked' : ''} class="flex-shrink-0"/><label for="${id}" class="text-sm text-stone-800 cursor-pointer">${label}</label></div>`;
}

function sel(name, opts, def) {
  return `<select name="${name}" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1">${opts.map(o => `<option${o===def?' selected':''}>${o}</option>`).join('')}</select>`;
}

function beefFormHTML() {
  const qty = `<div class="grid grid-cols-3 gap-3">
    ${[{id:'whole',lbl:'Whole',hw:700,p:'$5.50/lb',th:420,fr:'14-18 cu ft',est:'3,850'},
       {id:'half', lbl:'Half', hw:350,p:'$5.50/lb',th:180,fr:'8-10 cu ft', est:'1,650'},
       {id:'quarter',lbl:'Quarter',hw:175,p:'$5.75/lb',th:105,fr:'4-6 cu ft',est:'863'}].map(q =>
    `<button type="button" class="qty-card${q.id==='half'?' selected':''}" data-beef-qty="${q.id}">
      <div class="font-bold text-stone-900">${q.lbl}</div>
      <div class="text-xs text-stone-500">~${q.hw} lbs</div>
      <div class="text-sm font-semibold text-red-700 mt-1">${q.p}</div>
      <div class="border-t border-stone-200 mt-2 pt-2">
        <div class="text-xs text-blue-700">~${q.th} lbs take-home</div>
        <div class="text-xs text-cyan-700">&#x2745; ${q.fr}</div>
        <div class="text-xs text-stone-500">Est. ~$${q.est}</div>
      </div>
    </button>`).join('')}
  </div>`;

  const info = `<div class="grid md:grid-cols-3 gap-4">
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Full Name *</label><input type="text" id="beef-fullName" required placeholder="John Smith" class="w-full border border-stone-300 rounded-lg px-3 py-2