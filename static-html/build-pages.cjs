'use strict';
/**
 * build-pages.cjs — generates all HTML pages
 * Returns array of { file, html } objects
 */
const fs = require('fs');
const path = require('path');

const SB  = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/';
const SB2 = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_69540c6b1428c435af43c871/';
const YR  = new Date().getFullYear();

// ── Shared components ──────────────────────────────────────────────────────────
function pageHead(title, desc) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title}</title><meta name="description" content="${desc}"/>
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={theme:{extend:{fontFamily:{chunkfive:['"ChunkFive"','serif']}}}}</script>
<style>
@font-face{font-family:'ChunkFive';src:url('https://cdn.jsdelivr.net/npm/@fontsource/chunk-five@4.5.0/files/chunk-five-latin-800-normal.woff2') format('woff2');font-weight:800;font-display:swap}
.font-chunkfive{font-family:'ChunkFive',serif;font-weight:800}
@keyframes bounce{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}.chevron-bounce{animation:bounce 1.5s infinite}
@keyframes spin{to{transform:rotate(360deg)}}.spinner{width:1.25rem;height:1.25rem;border:3px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:inline-block;vertical-align:middle}
.form-sect-body{display:none}.form-sect-body.open{display:block}
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:1rem;opacity:0;pointer-events:none;transition:opacity .2s}
.modal-bg.open{opacity:1;pointer-events:all}
.modal-box{background:#fff;border-radius:1rem;max-width:32rem;width:100%;max-height:90vh;overflow-y:auto;padding:1.5rem;transform:scale(.95);transition:transform .2s}
.modal-bg.open .modal-box{transform:scale(1)}
.animal-btn-card{position:relative;padding:1.5rem;border-radius:.75rem;border:2px solid #e7e5e4;background:#fff;cursor:pointer;text-align:left;transition:all .15s;width:100%}
.animal-btn-card.selected{border-color:#b91c1c;background:#fef2f2}
.qty-card{padding:.75rem;border-radius:.75rem;border:2px solid #e7e5e4;background:#fff;cursor:pointer;text-align:center;transition:all .15s;width:100%}
.qty-card.selected{border-color:#b91c1c;background:#fef2f2}
.review-slide{display:none}.rev-dot{width:.5rem;height:.5rem;border-radius:9999px;background:#d6d3d1;border:none;cursor:pointer;transition:all .15s}
.rev-dot.active{background:#b91c1c;width:1.5rem}
.bsel-btn{padding:.75rem;border-radius:.5rem;border:2px solid #e7e5e4;background:#fff;cursor:pointer;text-align:center;width:100%}
.bsel-btn.selected{border-color:#b91c1c;background:#fef2f2}
</style>
<link rel="stylesheet" href="css/styles.css"/>
</head>`;
}

function header(page) {
  const h = page === 'home';
  const hc = h ? 'bg-red-700 text-white' : 'text-stone-700 hover:bg-stone-100';
  const mhc = h ? 'bg-red-700 text-white' : 'text-stone-700 hover:bg-stone-100';
  const da = h ? `<a href="#bundles" class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Bundles</a><a href="#calculator" class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Fill Your Freezer</a><a href="#locations" class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Locations</a><a href="#products" class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Products</a><a href="#about" class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Our Story</a>` : '';
  const ma = h ? `<div class="border-t border-stone-100 mt-2 pt-2"><p class="text-xs font-bold text-stone-400 px-4 pb-1 uppercase tracking-wide">Jump To</p><a href="#bundles" class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Bundles</a><a href="#calculator" class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Fill Your Freezer</a><a href="#locations" class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Locations</a><a href="#products" class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Products</a><a href="#about" class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Our Story</a></div>` : '';
  const logo = `images/logo-desktop.png`;
  const logofb = SB2 + 'ad7fab017_meat-market.png';
  return `<header class="bg-white shadow-sm sticky top-0 z-50"><div class="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between"><a href="index.html" id="logo-link"><img src="${logo}" alt="Walnut Valley Meat Market" class="h-12 md:h-16" onerror="this.src='${logofb}'"/></a><nav class="hidden lg:flex items-center gap-1"><a href="index.html" class="px-4 py-2 rounded-full text-base font-bold font-chunkfive transition-colors ${hc}">Home</a>${da}<a href="index.html#contact" class="px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100">Contact Us</a></nav><button class="lg:hidden p-2 rounded-lg text-stone-700 hover:bg-stone-100" id="menu-toggle"><svg id="icon-menu" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg><svg id="icon-close" class="w-6 h-6 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button></div><div class="lg:hidden bg-white border-t border-stone-100 px-4 pb-4 hidden" id="mobile-menu"><a href="index.html" class="block px-4 py-3 rounded-xl text-sm font-bold font-chunkfive mt-1 ${mhc}">Home</a>${ma}<div class="border-t border-stone-100 mt-2 pt-2"><a href="index.html#contact" class="block px-4 py-2.5 rounded-xl text-sm font-chunkfive text-stone-600 hover:bg-stone-100 mt-1">Contact Us</a></div></div></header>`;
}

function footer() {
  const logo   = 'images/logo-desktop.png';
  const logofb = SB2 + 'ad7fab017_meat-market.png';
  return `<footer class="bg-stone-800 text-stone-400 py-12 px-4"><div class="max-w-5xl mx-auto"><div class="grid md:grid-cols-3 gap-8 mb-8"><div><a href="index.html"><img src="${logo}" alt="Walnut Valley Meat Market" class="h-10 opacity-80 mb-4" onerror="this.src='${logofb}'"/></a><p class="text-sm">Quality meat since 2004. Family-owned and USDA inspected.</p></div><div><h4 class="font-chunkfive text-white mb-3">Navigation</h4><ul class="space-y-2 text-sm"><li><a href="index.html" class="hover:text-white">Home</a></li><li><a href="fill-your-freezer.html" class="hover:text-white">Cutting Order</a></li><li><a href="index.html#locations" class="hover:text-white">Locations</a></li><li><a href="index.html#products" class="hover:text-white">Products</a></li><li><a href="index.html#about" class="hover:text-white">Our Story</a></li><li><a href="index.html#calculator" class="hover:text-white">Cost Calculator</a></li><li><a href="index.html#contact" class="hover:text-white">Contact Us</a></li></ul></div><div><h4 class="font-chunkfive text-white mb-3">Contact</h4><p class="text-sm mb-2">El Dorado: <a href="tel:+13163213595" class="hover:text-white">(316) 321-3595</a></p><p class="text-sm mb-2">Augusta: <a href="tel:+13162953395" class="hover:text-white">(316) 295-3395</a></p><p class="text-sm mb-4">Andover: <a href="tel:+13163587903" class="hover:text-white">(316) 358-7903</a></p><h4 class="font-chunkfive text-white mb-3">Follow Us</h4><div class="space-y-2 text-sm"><a href="https://www.instagram.com/walnutvalleypacking" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white">&#x1F4F8; @walnutvalleypacking</a><a href="https://www.facebook.com/walnutvalley/videos/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white">&#x1F4CC; El Dorado Facebook</a><a href="https://www.facebook.com/walnutvalleymeatmarket/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white">&#x1F4CC; Augusta Facebook</a><a href="https://www.facebook.com/walnutvalleymeatmarketandover/mentions/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 hover:text-white">&#x1F4CC; Andover Facebook</a></div></div></div><div class="border-t border-stone-700 pt-6 text-center text-xs"><p>&copy; ${YR} Walnut Valley Packing LLC. All Rights Reserved.</p></div></div></footer><script src="js/main.js"></script></body></html>`;
}

// ── Shared data ────────────────────────────────────────────────────────────────
const LOCS = [
  { n:'El Dorado', a:'1000 S. Main St.', c:'El Dorado, KS', p:'(316) 321-3595', t:'+13163213595', h:['Mon-Fri: 8:00 am - 6:00 pm','Sat: 8:00 am - 1:00 pm','Sun: Closed'], m:'https://www.google.com/maps/place/1000+S+Main+St,+El+Dorado,+KS+67042', b:'Main Location' },
  { n:'Augusta',   a:'293 7th St.',       c:'Augusta, KS',   p:'(316) 295-3395', t:'+13162953395', h:['Tue-Sat: 10:00 am - 6:00 pm','Sun-Mon: Closed'], m:'https://www.google.com/maps/place/293+7th+St,+Augusta,+KS+67010', b:null },
  { n:'Andover',   a:'620 N. Andover Rd.',c:'Andover, KS',   p:'(316) 358-7903', t:'+13163587903', h:['Tue-Sat: 10:00 am - 6:00 pm','Sun-Mon: Closed'], m:'https://www.google.com/maps/place/620+N+Andover+Rd,+Andover+KS+67002', b:'Prime Cuts Available' },
];

const PRODS = [
  { cat:'Signature Items',    items:['Famous Grizzly Burger Patties','Jalapeno Grizzly Burger Patties','Grizzly Burger Brats','Jalapeno Grizzly Burger Brats'],                 img:'images/product-signature.png', fb:SB+'d79a304ee_ChatGPTImageFeb18202602_00_09PM.png' },
  { cat:'Bacon Selection',    items:['Blue Ribbon Bacon','Jalapeno Bacon','Black Pepper Bacon','Simply Bacon (water, salt & celery juice only)'],                             img:'images/product-bacon.png',     fb:SB+'9e7aa24f6_ChatGPTImageFeb24202601_28_15PM.png' },
  { cat:'Bratwurst',          items:['Original Brats','Cheese Brats','Boudin Brats','Philly Swiss Brats'],                                                                   img:'images/product-brats.png',     fb:SB+'2b6f28ab2_ChatGPTImageJan6202603_29_51PM.png'  },
  { cat:'USDA Choice Steaks', items:['Ribeye (Prime in Andover)','Filet Mignon (Prime in Andover)','KC Strip','Sirloin'],                                                    img:'images/product-steaks.png',    fb:SB+'5f7c14694_ChatGPTImageFeb24202601_34_38PM.png', contain:true },
  { cat:'Ground Beef',        items:['85% Lean Ground Beef','90% Lean Ground Sirloin'],                                                                                      img:'images/product-ground.png',    fb:SB+'2efbc9c08_ChatGPTImageJan6202603_35_03PM.png'  },
  { cat:'Specialty Items',    items:['Summer Sausage (Original, Cheese, Jalapeno/Cheese, Ghost Pepper)','Snack Sticks (Original, Cheese, Jalapeno/Cheese)'],                img:'images/product-specialty.png', fb:SB+'37fdf5edb_ChatGPTImageJan6202603_36_36PM.png'  },
];

const REVS = [
  { n:'Marcia Callaway',   t:'Everything I have purchased at Walnut Valley Meat Market has been great! I especially like their ground beef. All employees are super nice and knowledgeable!', s:5 },
  { n:'Sonja Patterson',   t:"Since I started purchasing from Walnut Valley I am a fan of their hamburger. Don't plan to buy anywhere else. Fast, friendly and helpful.", s:5 },
  { n:'Glenn Terrones',    t:'Awesome Staff and Fantastic Quality! The staff was truly awesome and friendly, making the whole experience a pleasure. The quality of the meat is great.', s:5 },
  { n:'Cindy Cowell',      t:'Literally, the best meats come from Walnut Valley. We originally bought half a beef and half a hog in fall 2020. The meat was delicious.', s:5 },
  { n:'Theresa Werth',     t:"I absolutely love your meats!! The 85/15 hamburger... you don't even need to drain it when cooking with it. That tells me just how healthy it is.", s:5 },
  { n:'Tricia Schlesener', t:'Best place in town to buy meat. Quality and price cannot be beat and the service is always great!! I recommend on a regular basis!!', s:5 },
  { n:'Charlene Baker',    t:'Super nice customer service. The summer sausage with cheese in it was amazing. Everyone loved it at Thanksgiving.', s:5 },
  { n:'Nolan Andrews',     t:'These guys are fantastic! The meat is of the utmost quality and they are so knowledgeable and friendly! Much better than a big store!', s:5 },
];

// ── mini HTML helpers ──────────────────────────────────────────────────────────
function sv(d) { return `<svg class="w-5 h-5 text-red-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${d}"/></svg>`; }
const ICON_PIN  = 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z';
const ICON_PH   = 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z';
const ICON_CLK  = 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
const ICON_NAV  = 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7';
const ICON_STAR = 'M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z';

function starsHtml(n) { return Array(n).fill(`<svg class="w-5 h-5 inline-block" style="fill:#fbbf24" viewBox="0 0 24 24"><path d="${ICON_STAR}"/></svg>`).join(''); }

function locCard(l) {
  const badge = l.b ? `<span class="absolute top-3 right-3 bg-amber-400 text-stone-900 text-xs font-bold px-2 py-1 rounded-full">${l.b}</span>` : '';
  return `<div class="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
  <div class="bg-red-700 text-white p-4 relative"><h3 class="text-xl font-bold">${l.n}</h3>${badge}</div>
  <div class="p-5 space-y-4 flex flex-col flex-1">
    <div class="flex items-start gap-3">${sv(ICON_PIN)}<div><p class="font-medium text-stone-800">${l.a}</p><p class="text-stone-600">${l.c}</p></div></div>
    <div class="flex items-center gap-3">${sv(ICON_PH)}<a href="tel:${l.t}" class="font-medium text-red-700 hover:text-red-800">${l.p}</a></div>
    <div class="flex items-start gap-3">${sv(ICON_CLK)}<div class="text-sm text-stone-600">${l.h.map(h=>`<p>${h}</p>`).join('')}</div></div>
    <div class="flex gap-2 pt-2 mt-auto">
      <a href="tel:${l.t}" class="flex-1 bg-stone-900 hover:bg-stone-800 text-white font-bold py-2.5 px-4 rounded-full text-center text-sm transition-colors">Call</a>
      <a href="${l.m}" target="_blank" rel="noopener noreferrer" class="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 px-4 rounded-full text-center text-sm flex items-center justify-center gap-1 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${ICON_NAV}"/></svg>Directions</a>
    </div>
  </div>
</div>`;
}

function prodCard(p) {
  const ic = p.contain ? 'object-contain p-4' : 'object-cover';
  return `<div class="bg-stone-50 rounded-xl overflow-hidden group hover:shadow-lg transition-shadow"><div class="h-56 overflow-hidden bg-white"><img src="${p.img}" alt="${p.cat}" class="w-full h-full ${ic} transition-transform duration-300 group-hover:scale-105" onerror="this.src='${p.fb}'"/></div><div class="p-5"><h3 class="font-bold text-red-700 mb-3">${p.cat}</h3><ul class="space-y-2">${p.items.map(i=>`<li class="text-stone-700 text-sm pl-4 border-l-2 border-red-200">${i}</li>`).join('')}</ul></div></div>`;
}

function revSlide(r) { return `<div class="review-slide"><div class="flex gap-1 mb-6">${starsHtml(r.s)}</div><p class="text-xl md:text-2xl text-stone-700 leading-relaxed mb-8 italic">"${r.t}"</p><div class="flex items-center gap-4"><div class="w-12 h-12 bg-red-700 rounded-full flex items-center justify-center text-white font-bold text-lg">${r.n.charAt(0)}</div><div><p class="font-bold text-stone-900">${r.n}</p><p class="text-stone-500">El Dorado, KS</p></div></div></div>`; }

const BUDGET_MODAL = `<div class="modal-bg" id="budget-modal"><div class="modal-box"><div class="flex items-center justify-between mb-6"><div class="text-xl font-bold">&#x1F4B0; Budget Helper</div><button data-close-budget style="background:none;border:none;font-size:1.5rem;color:#78716c;cursor:pointer">&times;</button></div><div class="space-y-6"><div><p class="text-sm font-medium text-stone-700 mb-2">Select Animal</p><div class="grid grid-cols-2 gap-2"><button class="bsel-btn selected" data-budget-animal="beef"><div class="text-2xl mb-1">&#x1F404;</div><div class="font-bold text-sm">Beef</div></button><button class="bsel-btn" data-budget-animal="pork"><div class="text-2xl mb-1">&#x1F437;</div><div class="font-bold text-sm">Pork</div></button></div></div><div><p class="text-sm font-medium text-stone-700 mb-2">Select Size</p><div class="grid gap-2" id="budget-size-wrap"></div></div><div class="bg-stone-50 rounded-xl p-4 space-y-3"><div class="flex justify-between"><span class="text-stone-600">Price per lb (hanging weight)</span><span class="font-bold" id="budget-price-per-lb">--</span></div><div class="flex justify-between"><span class="text-stone-600">Avg hanging weight</span><span class="font-bold" id="budget-avg-weight">--</span></div><div class="border-t border-stone-200 pt-3 flex justify-between"><span class="font-medium text-stone-800">Estimated Total</span><span class="text-xl font-black text-red-700" id="budget-total">--</span></div></div><div class="grid grid-cols-2 gap-3"><div class="bg-blue-50 rounded-lg p-3"><p class="text-sm font-medium text-blue-700 mb-1">Take-Home Weight</p><p class="text-lg font-bold text-blue-900" id="budget-take-home">--</p><p class="text-xs text-blue-600" id="budget-take-pct">--</p></div><div class="bg-cyan-50 rounded-lg p-3"><p class="text-sm font-medium text-cyan-700 mb-1">Freezer Space</p><p class="text-lg font-bold text-cyan-900" id="budget-freezer">--</p><p class="text-xs text-cyan-600">Recommended</p></div></div><div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800"><strong>Deposit Required:</strong> <span id="budget-deposit">--</span></div><div class="text-sm text-stone-600 space-y-2"><p><strong>What's included?</strong> Livestock, dry aging, processing, and packaging.</p><p><strong>Processing time:</strong> 2-4 weeks.</p></div><button data-close-budget class="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-full transition-colors">Got It</button></div></div></div>`;

const HELP_MODAL = `<div class="modal-bg" id="help-modal"><div class="modal-box"><div class="flex items-center justify-between mb-4"><div class="text-xl font-bold" id="help-modal-title">Help</div><button id="help-modal-close" style="background:none;border:none;font-size:1.5rem;color:#78716c;cursor:pointer">&times;</button></div><div id="help-modal-body"></div></div></div>`;

const CONTACT = `<section id="contact" class="py-12 px-4 bg-stone-100"><div class="max-w-2xl mx-auto"><div class="text-center mb-8"><h2 class="text-3xl md:text-4xl font-chunkfive text-stone-900 mb-2 uppercase">Contact Us</h2><p class="text-stone-600">Have a question? We'd love to hear from you.</p></div><form class="contact-form bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-4"><div class="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label class="block text-sm font-bold text-stone-700 mb-1">Name</label><input type="text" name="name" required placeholder="Your name" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"/></div><div><label class="block text-sm font-bold text-stone-700 mb-1">Email</label><input type="email" name="email" required placeholder="your@email.com" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"/></div></div><div><label class="block text-sm font-bold text-stone-700 mb-1">Subject</label><input type="text" name="subject" required placeholder="What's this about?" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"/></div><div><label class="block text-sm font-bold text-stone-700 mb-1">Message</label><textarea name="message" required rows="5" placeholder="Your message..." class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700 resize-none"></textarea></div><button type="submit" class="btn-submit w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>Send Message</button></form><div class="form-success" style="display:none"><div class="bg-white rounded-2xl shadow-lg p-10 text-center"><svg class="w-14 h-14 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><h3 class="text-xl font-chunkfive text-stone-900 mb-2">Message Sent!</h3><p class="text-stone-600">Thanks for reaching out. We will get back to you soon.</p></div></div></div></section>`;

function starsHtml(n){return'<svg class="w-5 h-5 inline-block" style="fill:#fbbf24" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>'.repeat(n);}

function heroSection(SBp){return '<section class="relative overflow-hidden hero-wrap"><div class="hero-desktop relative"><img src="images/desktop-background.jpg" alt="" class="w-full object-cover" onerror="this.src=\''+SBp+'61474fc54_desktop-background.jpg\'"/><img src="images/desktop-copy.png" alt="Welcome to Meat Country" style="position:absolute;inset-x:0;bottom:0;width:100%;height:90%;object-fit:contain;object-position:bottom;padding:0 10%" onerror="this.src=\''+SBp+'34c8322fa_desktop-copy.png\'"/></div><div class="hero-mobile relative"><img src="images/mobile-background.jpg" alt="" class="w-full object-cover" onerror="this.src=\''+SBp+'bdc69e356_mobile-background.jpg\'"/><img src="images/mobile-copy.png" alt="Welcome to Meat Country" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain" onerror="this.src=\''+SBp+'04584cc4e_mobile-copy.png\'"/></div><div class="absolute bottom-4 left-0 right-0 flex justify-center"><a href="#locations" class="text-white/80 hover:text-white transition-colors"><svg class="w-6 h-6 chevron-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></a></div></section>';}

function highlightsSection(){return '<section class="py-12 px-4 bg-white"><div class="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center"><div><div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><svg class="w-7 h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg></div><h3 class="font-bold text-stone-900">USDA Inspected</h3><p class="text-sm text-stone-600">Federal quality standards</p></div><div><div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><svg class="w-7 h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div><h3 class="font-bold text-stone-900">Family-Owned</h3><p class="text-sm text-stone-600">Since 2004</p></div><div><div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><svg class="w-7 h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg></div><h3 class="font-bold text-stone-900">Best Price</h3><p class="text-sm text-stone-600">Quality at the best value</p></div><div><div class="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"><svg class="w-7 h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div><h3 class="font-bold text-stone-900">3 Locations</h3><p class="text-sm text-stone-600">Across Kansas</p></div></div></section>';}

function bundlesSection(){
  function bc(t,p,items){return '<div class="bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 shadow-lg"><div class="bg-red-700 px-5 py-3 relative"><h3 class="font-chunkfive text-white text-xl uppercase">'+t+'</h3><span class="absolute top-2.5 right-3 bg-amber-400 text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full">'+p+'</span></div><div class="px-5 py-4"><ul class="space-y-2 text-stone-300 text-sm">'+items.map(i=>'<li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-amber-400"></span>'+i+'</li>').join('')+'</ul></div></div>';}
  function pc(t,rows){return '<div class="bg-stone-900 rounded-2xl overflow-hidden border border-stone-700 shadow-lg"><div class="bg-red-700 px-5 py-3"><h3 class="font-chunkfive text-white text-xl uppercase">'+t+'</h3></div><div class="px-5 py-4 space-y-2">'+rows.map(r=>'<div class="flex justify-between items-center py-2 border-b border-stone-700"><span class="text-stone-300 font-medium">'+r[0]+'</span><span class="font-bold text-amber-400">'+r[1]+'</span></div>').join('')+'<p class="text-xs text-stone-500 italic pt-1">*Hanging weight. All prices include livestock, dry aging, processing and packaging.</p><p class="text-xs font-bold text-amber-400 uppercase">Deposit required at time of ordering</p></div></div>';}
  return '<section id="bundles" class="py-12 px-4 bg-white"><div class="max-w-5xl mx-auto"><div class="text-center mb-10"><h2 class="text-3xl md:text-4xl font-chunkfive text-stone-900 uppercase mb-2">Bundles</h2><p class="text-stone-500">Ready-to-buy packages &mdash; great value, no guesswork</p></div><div class="grid md:grid-cols-3 gap-6 mb-6">'+bc('Beef Bundle','$219',['2 lbs Stew Meat','2 lbs Thin Sliced Ribeye (Philly Meat)','3 lbs Sirloin Steak','2 Chuck Roasts','6 Minute Steaks (Cube Steak)','3 lbs KC Strip Steak'])+bc('Mix Bundle','$119',['2 lbs Blue Ribbon Bacon','5 lbs Breaded Chicken Strips','3 lbs Breakfast Sausage','3 lbs Boneless Chicken Breast','3 lbs Boneless Pork Chops','1 Chuck Roast'])+bc('Breakfast Bundle','$37',['2 lbs Blue Ribbon Bacon','2 lbs Breakfast Sausage','2 Packs Hashbrowns'])+'</div><div class="grid md:grid-cols-2 gap-6">'+pc('Beef Sides',[['Whole / Half Beef','$5.50/lb'],['Quarter Beef','$5.75/lb'],['Eighth Beef','$599 flat']])+pc('Hog Sides',[['Whole Hog','$3.50/lb'],['Half Hog','$3.75/lb']])+'</div></div></section>';
}

function freezerSection(beefForm,porkForm){
  const animalSel='<div class="mb-8"><h2 class="text-slate-50 mb-4 text-3xl md:text-4xl font-chunkfive uppercase text-center">SELECT ANIMAL TYPE</h2><div class="grid grid-cols-2 gap-4 max-w-lg mx-auto"><button class="animal-btn-card" data-animal="beef" type="button"><div class="animal-check" style="position:absolute;top:.5rem;right:.5rem;width:1.25rem;height:1.25rem;background:#b91c1c;border-radius:9999px;display:none;align-items:center;justify-content:center"><svg style="width:.75rem;height:.75rem;stroke:#fff;fill:none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><div class="text-5xl mb-3">&#x1F404;</div><div class="font-chunkfive text-stone-900 text-3xl">Beef</div><div class="text-sm text-stone-500">Whole, Half, or Quarter</div></button><button class="animal-btn-card" data-animal="pork" type="button"><div class="animal-check" style="position:absolute;top:.5rem;right:.5rem;width:1.25rem;height:1.25rem;background:#b91c1c;border-radius:9999px;display:none;align-items:center;justify-content:center"><svg style="width:.75rem;height:.75rem;stroke:#fff;fill:none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><div class="text-5xl mb-3">&#x1F437;</div><div class="font-chunkfive text-stone-900 text-3xl">Pork</div><div class="text-sm text-stone-500">Whole or Half Hog</div></button></div></div>';
  return '<div id="calculator"><section class="bg-stone-900 py-10 px-4 text-center"><h1 class="font-chunkfive text-white uppercase mb-2 tracking-wide"><span class="text-3xl md:text-5xl">Fill Your Freezer</span><br/><span class="text-2xl md:text-4xl">Custom Beef &amp; Pork Orders<br/>in El Dorado, Augusta &amp; Andover, KS</span></h1></section><section class="bg-red-700 pb-10"><div class="max-w-4xl mx-auto px-4 pt-8">'+animalSel+'<div id="beef-form" style="display:none">'+beefForm()+'</div><div id="pork-form" style="display:none">'+porkForm()+'</div></div></section></div>';
}

function locationsSection(){
  return '<section id="locations" class="py-12 px-4 bg-gradient-to-b from-stone-100 to-white"><div class="max-w-6xl mx-auto"><div class="text-center mb-10"><h2 class="text-4xl md:text-5xl font-black text-stone-900 mb-4">Three Kansas Locations</h2><p class="text-xl text-stone-600">Visit us at any of our family-owned stores across Kansas</p></div><div class="grid md:grid-cols-3 gap-8">'+LOCS.map(locCard).join('')+'</div></div></section>';
}

function productsSection(){
  return '<section id="products" class="py-12 px-4 bg-white"><div class="max-w-6xl mx-auto"><div class="text-center mb-10"><h2 class="text-4xl md:text-5xl font-black text-stone-900 mb-4">Premium Cuts &amp; Favorites</h2><p class="text-xl text-stone-600">From USDA Choice steaks to our famous Grizzly Burgers</p></div><div class="grid grid-cols-2 md:grid-cols-3 gap-6">'+PRODS.map(prodCard).join('')+'</div></div></section>';
}

function aboutSection(SBp){
  return `<section id="about" style="background:#201e1d;padding:80px 20px;"><div style="max-width:1100px;margin:0 auto;"><h2 class="about-story-heading">OUR STORY</h2><div class="about-story-cols"><div class="about-story-img-col"><img src="images/89f3c5e06_farmers-market-scaled.png" alt="Walnut Valley at the Farmers Market" class="about-story-img" onerror="this.src='${SBp}89f3c5e06_farmers-market-scaled.png'"/></div><div class="about-story-text-col"><p class="about-story-p"><strong class="about-kw">Walnut Valley Meat Market</strong> is a family business based in El Dorado, KS, with retail locations in Augusta and Andover. Owned and operated by the Carselowey family &mdash; Bruce, Matt, and Megan &mdash; our story started in <strong class="about-kw">1986</strong> at the Wichita Farm &amp; Arts Market.</p><p class="about-story-p">In <strong class="about-kw">2004</strong>, we opened our first retail location in El Dorado, KS. Today, we are a <strong class="about-kw">USDA-inspected</strong> facility specializing in delicious, unique retail meats and custom processing. Our stores offer freshly cut beef and pork, award-winning bacon, snack sticks, and our <span class="about-gold">Famous Grizzly Burger</span> &mdash; beef, pork, bacon, and cheese in one unforgettable patty.</p><p class="about-story-p"><span class="about-gold">&mdash; The Carselowey Family</span></p></div></div></div></section>`;
}

function reviewsSection(){
  const slides = REVS.map(revSlide).join('');
  const dots = REVS.map((_,i)=>'<button class="rev-dot'+(i===0?' active':'')+'" data-dot="'+i+'"></button>').join('');
  return '<section class="py-12 px-4 bg-gradient-to-b from-white to-amber-50"><div class="max-w-4xl mx-auto"><div class="text-center mb-12"><h2 class="text-4xl md:text-5xl font-black text-stone-900 mb-4">What Our Customers Say</h2><div class="flex items-center justify-center gap-1">'+starsHtml(5)+'<span class="ml-2 text-stone-600 font-medium">5-Star Reviews</span></div></div><div class="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative overflow-hidden min-h-80">'+slides+'</div><div class="flex items-center justify-center gap-4 mt-8"><button id="review-prev" class="p-3 rounded-full bg-white shadow-lg hover:bg-stone-50" style="border:none;cursor:pointer"><svg class="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button><div class="flex gap-2">'+dots+'</div><button id="review-next" class="p-3 rounded-full bg-white shadow-lg hover:bg-stone-50" style="border:none;cursor:pointer"><svg class="w-5 h-5 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button></div></div></section>';
}

function buildLTO(){
  const SBp='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/';
  return pageHead('$4.50/lb Ground Beef Limited Time Offer | Walnut Valley Meat Market','85% Lean ground beef for just $4.50/lb at Walnut Valley Meat Market. Three Kansas locations.') +
    '<body data-page="lto" class="min-h-screen bg-stone-900 flex flex-col">'+header('lto')+'<main class="flex-1"><section class="relative min-h-screen overflow-hidden"><div class="absolute inset-0" style="background:#1c1917"></div><div class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16"><div class="mb-12"><img src="images/logo-white.png" alt="Walnut Valley Meat Market" class="h-32 md:h-40 w-auto mx-auto" onerror="this.src=\''+SBp+'a3d33079d_logo-white.png\'"/></div><div class="max-w-2xl w-full"><div class="bg-white rounded-3xl shadow-2xl overflow-hidden"><div class="bg-red-700 text-white px-8 py-10 text-center"><h1 class="font-black text-4xl md:text-5xl mb-4">LIMITED TIME OFFER</h1><p class="text-amber-200 font-bold text-xl">85% Lean Ground Beef</p></div><div class="px-8 py-10 text-center"><div class="text-8xl md:text-9xl font-black text-red-700">$4.50</div><div class="text-stone-600 text-2xl font-bold -mt-2">per lb</div><p class="text-stone-500 mt-2">In-store only &bull; El Dorado, Augusta &amp; Andover, KS</p><a href="index.html#locations" class="inline-block mt-8 bg-red-700 hover:bg-red-800 text-white font-bold py-4 px-10 rounded-full text-lg transition-colors">Find a Location Near You</a></div></div></div></div></section></main>'+footer();
}

module.exports = function(ctx){
  const {beefForm,porkForm} = ctx;
  const SBp='https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695d59a4cb42c848437cda1e/';
  function buildPage(page){
    const isHome=page==='home';
    const title=isHome?'Walnut Valley Meat Market | El Dorado, Augusta & Andover, KS':'Custom Beef & Pork Cutting Orders | Walnut Valley';
    const desc=isHome?'Family-owned USDA-inspected meat market. Grizzly Burger, beef & pork bundles.':'Order custom-cut beef and pork from Walnut Valley Meat Market.';
    let h=pageHead(title,desc)+'<body data-page="'+page+'" class="min-h-screen bg-stone-50 flex flex-col">'+header(page)+'<main class="flex-1">';
    if(isHome){h+=heroSection(SBp)+highlightsSection()+bundlesSection();}
    h+=freezerSection(beefForm,porkForm);
    if(isHome){h+=locationsSection()+productsSection()+aboutSection(SBp)+CONTACT;}
    h+=BUDGET_MODAL+HELP_MODAL+'</main>'+footer();
    return h;
  }
  return [
    {file:'index.html',           html:buildPage('home')},
    {file:'fill-your-freezer.html',html:buildPage('freezer')},
    {file:'lto.html',             html:buildLTO()},
  ];
};