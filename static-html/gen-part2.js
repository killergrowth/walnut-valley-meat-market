'use strict';
// Continuation of generate.js — run via: node build.js
// This file contains the form HTML builders and page writers

module.exports = function(pageShell, fsec, radio, sel, stars, locCard, prodCard, LOCS, PRODS, REVS, SB, w) {

function beefFormHTML() {
  const qty = `<div class="grid grid-cols-3 gap-3">
    <button type="button" class="qty-card" data-beef-qty="whole"><div class="font-bold text-stone-900">Whole</div><div class="text-xs text-stone-500">~700 lbs</div><div class="text-sm font-semibold text-red-700 mt-1">$5.50/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~420 lbs take-home</div><div class="text-xs text-cyan-700">14-18 cu ft</div><div class="text-xs text-stone-500">Est. ~$3,850</div></div></button>
    <button type="button" class="qty-card selected" data-beef-qty="half"><div class="font-bold text-stone-900">Half</div><div class="text-xs text-stone-500">~350 lbs</div><div class="text-sm font-semibold text-red-700 mt-1">$5.50/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~180 lbs take-home</div><div class="text-xs text-cyan-700">8-10 cu ft</div><div class="text-xs text-stone-500">Est. ~$1,650</div></div></button>
    <button type="button" class="qty-card" data-beef-qty="quarter"><div class="font-bold text-stone-900">Quarter</div><div class="text-xs text-stone-500">~175 lbs</div><div class="text-sm font-semibold text-red-700 mt-1">$5.75/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~105 lbs take-home</div><div class="text-xs text-cyan-700">4-6 cu ft</div><div class="text-xs text-stone-500">Est. ~$863</div></div></button>
  </div>`;

  const info = `<div class="grid md:grid-cols-3 gap-4">
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Full Name *</label><input type="text" id="beef-fullName" required placeholder="John Smith" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div>
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Email *</label><input type="email" id="beef-email" required placeholder="john@email.com" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div>
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Phone *</label><input type="tel" id="beef-phone" required placeholder="(316) 555-1234" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div>
  </div>
  <div class="mt-4"><label class="block text-sm font-bold text-stone-700 mb-1">Pickup Location *</label>
    <select id="beef-pickup" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm">
      <option value="">Select a location...</option>
      <option>El Dorado - 1000 S. Main St., El Dorado, KS 67042</option>
      <option>Andover - 620 N. Andover Rd., Andover, KS 67002</option>
      <option>Augusta - 293 7th St., Augusta, KS 67010</option>
    </select>
  </div>`;

  const rib = `
    ${radio('beef-rib','rib-ribeye','ribeye','Ribeye Steaks (Boneless)',true)}
    <div id="rib-ribeye-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1">
      <div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-rib-thick',['3/4"','1"','1 1/4"','1 1/2"'],'1"')}</div>
      <div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-rib-pack',['1','2','3','4'],'2')}</div>
    </div>
    ${radio('beef-rib','rib-prime','primerib','Prime Rib Roast',false)}
    <div id="rib-prime-sub" class="ml-6 mt-1" style="display:none"><label class="text-xs text-stone-600">Roast Size</label>${sel('beef-rib-roast',['2-3 lb','3-4 lb','4-5 lb'],'3-4 lb')}</div>
    ${radio('beef-rib','rib-grind','grind','Grind (add to ground beef)',false)}`;

  const loin = `
    ${radio('beef-loin','loin-tbone','tbone','T-Bone Steaks',true)}
    ${radio('beef-loin','loin-kc','kcfilet','KC Strip and Filet (bone removed)',false)}
    <div id="loin-steak-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1">
      <div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-loin-thick',['3/4"','1"','1 1/4"','1 1/2"'],'1"')}</div>
      <div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-loin-pack',['1','2','3','4'],'2')}</div>
    </div>
    ${radio('beef-loin','loin-grind','grind','Grind (add to ground beef)',false)}`;

  const sirloin = `
    ${radio('beef-sirloin','sirl-steaks','steaks','Sirloin Steaks',true)}
    <div id="sirloin-steak-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1">
      <div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-sirl-thick',['3/4"','1"','1 1/4"','1 1/2"'],'1"')}</div>
      <div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-sirl-pack',['1','2','3','4'],'2')}</div>
    </div>
    ${radio('beef-sirloin','sirl-grind','grind','Grind (add to ground beef)',false)}`;

  const round = `
    ${radio('beef-round','rnd-steak','steak','Round Steak',true)}
    <div id="round-steak-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1">
      <div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-rnd-thick',['1/2"','3/4"','1"'],'3/4"')}</div>
      <div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-rnd-pack',['1','2','3','4'],'2')}</div>
    </div>
    ${radio('beef-round','rnd-tender','tenderized','Tenderized Round Steak (3/4" thick)',false)}
    ${radio('beef-round','rnd-minute','minute','Minute Steak (3/4" thick)',false)}
    ${radio('beef-round','rnd-roast','roast','Round Roast',false)}
    <div id="round-roast-sub" class="ml-6 mt-1" style="display:none"><label class="text-xs text-stone-600">Roast Size</label>${sel('beef-rnd-roast',['2-3 lb','3-4 lb','4-5 lb'],'3-4 lb')}</div>
    ${radio('beef-round','rnd-grind','grind','Grind (add to ground beef)',false)}`;

  const chuck = `<div class="space-y-4">
    <div><p class="font-medium text-stone-800 mb-2">Chuck Roast</p>${radio('beef-chuck','chk-roast','roast','Roast',true)}${radio('beef-chuck','chk-grind','grind','Grind',false)}</div>
    <div><p class="font-medium text-stone-800 mb-2">Arm Roast</p>${radio('beef-arm','arm-roast','roast','Roast',true)}${radio('beef-arm','arm-grind','grind','Grind',false)}</div>
  </div>`;

  const brisket = `
    <div id="brisket-whole-wrap">${radio('beef-brisket','bk-whole','whole','Keep Whole',true)}</div>
    <div id="brisket-half-wrap">${radio('beef-brisket','bk-half','half','Cut in Half',false)}</div>
    <div id="brisket-qtr-wrap" style="display:none">${radio('beef-brisket','bk-halfq','halfbrisket','Half Brisket',false)}</div>
    ${radio('beef-brisket','bk-grind','grind','Grind (add to ground beef)',false)}`;

  const ribssoup = `<div class="grid md:grid-cols-2 gap-6">
    <div><p class="font-medium text-stone-800 mb-2">Beef Ribs</p>${radio('beef-ribs','ribs-save','save','Save',true)}${radio('beef-ribs','ribs-grind','grind','Grind',false)}</div>
    <div><p class="font-medium text-stone-800 mb-2">Soup Bones</p>${radio('beef-soup','soup-save','save','Save (sliced ~1.25")',true)}${radio('beef-soup','soup-grind','grind','Grind',false)}</div>
  </div>`;

  const grind = `<div class="grid md:grid-cols-2 gap-4">
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Leanness</label>${sel('beef-leanness',['80% Lean (Standard)','85% Lean','90% Lean'],'85% Lean')}</div>
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Package Size</label>${sel('beef-pkg',['1 lb packages','2 lb packages'],'1 lb packages')}</div>
  </div>`;

  const patties = `<div class="flex items-center gap-2 mb-3"><input type="checkbox" id="want-patties" class="sub-toggle-check" data-shows="patties-sub"/><label for="want-patties" class="text-sm text-stone-800">Yes, I want patties (10 lb minimum)</label></div>
  <div id="patties-sub" style="display:none;padding-left:1.5rem"><div class="grid md:grid-cols-3 gap-4">
    <div><label class="text-xs text-stone-600">Total Pounds</label>${sel('beef-patty-lbs',['10','20','30'],'10')}</div>
    <div><label class="text-xs text-stone-600">Patty Size</label>${sel('beef-patty-sz',['1/4 lb','1/3 lb','1/2 lb'],'1/3 lb')}</div>
    <div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-patty-pp',['4','6','8','10'],'4')}</div>
  </div></div>`;

  const organs = `<div class="space-y-3">
    <div class="flex items-start gap-2"><input type="checkbox" id="organ-liver"/><div><label for="organ-liver" class="font-medium text-stone-800 text-sm">Save Liver</label><p class="text-xs text-stone-500">Rich in iron. Great pan-fried with onions.</p></div></div>
    <div class="flex items-start gap-2"><input type="checkbox" id="organ-heart"/><div><label for="organ-heart" class="font-medium text-stone-800 text-sm">Save Heart</label><p class="text-xs text-stone-500">Lean muscle meat. Good for tacos or grilling.</p></div></div>
    <div class="flex items-start gap-2"><input type="checkbox" id="organ-tongue"/><div><label for="organ-tongue" class="font-medium text-stone-800 text-sm">Save Tongue</label><p class="text-xs text-stone-500">Tender when slow-cooked. Popular for tacos (lengua).</p></div></div>
  </div>`;

  return fsec(2,'Select Quantity','','',qty,true) +
    fsec(3,'Your Information','','',info,true) +
    fsec(4,'Rib Section','[{"term":"Ribeye Steaks","description":"Rich, well-marbled steaks. Great for pan-searing or grilling."},{"term":"Prime Rib Roast","description":"Large bone-in roast. Ideal for slow-roasting."},{"term":"Grind","description":"Rib meat added to your ground beef total."}]','Ribeye is a top steak cut. Prime rib is great for holiday roasts.',rib,false) +
    fsec(5,'Loin Section','[{"term":"T-Bone Steaks","description":"Classic steak with T-shaped bone. Great for grilling."},{"term":"KC Strip and Filet","description":"Two premium boneless cuts from one section."},{"term":"Grind","description":"Loin meat added to ground beef."}]','T-Bone and KC Strip are top steak choices.',loin,false) +
    fsec(6,'Sirloin Section','[{"term":"Sirloin Steaks","description":"Lean, boneless steaks. Great for grilling or fajitas."},{"term":"Grind","description":"Sirloin meat added to ground beef - leaner blend."}]','Lean and flavorful.',sirloin,false) +
    fsec(7,'Round Section','[{"term":"Round Steak","description":"Lean rear-leg steak. Best braised or sliced thin."},{"term":"Tenderized Round Steak","description":"Mechanically tenderized - great for chicken-fried steak."},{"term":"Minute Steak","description":"Thin-sliced, cooks in under a minute."},{"term":"Round Roast","description":"Large lean roast. Best slow-roasted."},{"term":"Grind","description":"Added to ground beef. Very lean."}]','Lean rear-leg muscle.',round,false) +
    fsec(8,'Chuck Section','[{"term":"Chuck Roast","description":"Classic pot roast cut. Incredible when braised."},{"term":"Arm Roast","description":"Slightly leaner round-bone roast. Great for pot roast."}]','Great for pot roast and slow-cooking.',chuck,false) +
    fsec(9,'Brisket','[{"term":"Keep Whole","description":"Full brisket intact - 12-16 lbs. Perfect for smoking."},{"term":"Cut in Half","description":"Cut lengthwise, fat left on."},{"term":"Grind","description":"Added to ground beef. Rich and flavorful."}]','If cut in half, it is cut lengthwise with fat left on.',brisket,false) +
    fsec(10,'Ribs and Soup Bones','','',ribssoup,false) +
    fsec(11,'Ground Beef Settings','','These settings apply to ALL items sent to grind.',grind,false) +
    fsec(12,'Hamburger Patties (Optional)','[{"term":"1/3 lb Patty","description":"Popular standard size. The classic burger."},{"term":"1/2 lb Patty","description":"Large 8 oz patty for hearty appetite."}]','Pre-made patties come from your ground beef portion.',patties,false) +
    fsec(13,'Organ Meats','','If not selected, these do NOT go into ground beef.',organs,false) +
    `<div class="bg-red-50 border border-red-200 rounded-xl p-6 mt-4">
      <div class="text-sm text-stone-600">Required Deposit</div>
      <div class="text-3xl font-black text-red-700" id="beef-deposit-amount">$600</div>
      <div class="text-xs text-stone-500">Applied to final balance at pickup</div>
      <button id="beef-submit-btn" type="button" class="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-full text-lg flex items-center justify-center gap-2 transition-colors mt-4">Submit Beef Order</button>
    </div>`;
}

function porkFormHTML() {
  const qty = `<div class="grid grid-cols-2 gap-3">
    <button type="button" class="qty-card" data-pork-qty="whole"><div class="font-bold text-stone-900">Whole Hog</div><div class="text-xs text-stone-500">~200 lbs hanging</div><div class="text-sm font-semibold text-red-700 mt-1">$3.50/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~130 lbs take-home</div><div class="text-xs text-cyan-700">6-8 cu ft</div><div class="text-xs text-stone-500">Est. ~$700</div><div class="text-xs text-stone-400 italic">May choose 2 options per section</div></div></button>
    <button type="button" class="qty-card selected" data-pork-qty="half"><div class="font-bold text-stone-900">Half Hog</div><div class="text-xs text-stone-500">~100 lbs hanging</div><div class="text-sm font-semibold text-red-700 mt-1">$3.75/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~65 lbs take-home</div><div class="text-xs text-cyan-700">3-4 cu ft</div><div class="text-xs text-stone-500">Est. ~$375</div><div class="text-xs text-stone-400 italic">1 option per section</div></div></button>
  </div>`;

  const info = `<div class="grid md:grid-cols-3 gap-4">
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Full Name *</label><input type="text" id="pork-fullName" required placeholder="John Smith" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div>
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Email *</label><input type="email" id="pork-email" required placeholder="john@email.com" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div>
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Phone *</label><input type="tel" id="pork-phone" required placeholder="(316) 555-1234" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div>
  </div>
  <div class="mt-4"><label class="block text-sm font-bold text-stone-700 mb-1">Pickup Location *</label>
    <select id="pork-pickup" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm">
      <option value="">Select a location...</option>
      <option>El Dorado - 1000 S. Main St., El Dorado, KS 67042</option>
      <option>Andover - 620 N. Andover Rd., Andover, KS 67002</option>
      <option>Augusta - 293 7th St., Augusta, KS 67010</option>
    </select>
  </div>`;

  const loin = `
    ${radio('pork-loin','ploin-chops','chops','Pork Chops',true)}
    <div id="pork-loin-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1">
      <div><label class="text-xs text-stone-600">Thickness</label>${sel('pork-loin-thick',['1/2"','3/4"','1"'],'3/4"')}</div>
      <div><label class="text-xs text-stone-600">Per Pack</label>${sel('pork-loin-pack',['1','2','3','4'],'2')}</div>
    </div>
    ${radio('pork-loin','ploin-grind','grind','Put Into Grind',false)}`;

  const shoulder = `
    ${radio('pork-shoulder','pshldr-steaks','steaks','Cut Into Steaks',false)}
    <div id="pork-shoulder-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1" style="display:none">
      <div><label class="text-xs text-stone-600">Thickness</label>${sel('pork-shldr-thick',['1/2"','3/4"','1"'],'3/4"')}</div>
      <div><label class="text-xs text-stone-600">Per Package</label>${sel('pork-shldr-pack',['1','2','3','4'],'2')}</div>
    </div>
    ${radio('pork-shoulder','pshldr-whole','whole','Leave Whole (for pulled pork)',true)}
    ${radio('pork-shoulder','pshldr-grind','grind','Put Into Grind',false)}`;

  const ribs = `
    ${radio('pork-ribs','pribs-whole','whole','Leave Whole',true)}
    ${radio('pork-ribs','pribs-half','half','Cut in Half',false)}
    ${radio('pork-ribs','pribs-grind','grind','Put Into Grind',false)}`;

  const belly = `
    ${radio('pork-belly','pbelly-bacon','bacon','Cure for Bacon',true)}
    ${radio('pork-belly','pbelly-fresh','fresh','Do Not Cure (Fresh Side)',false)}
    ${radio('pork-belly','pbelly-grind','grind','Put Into Grind',false)}`;

  const ham = `
    ${radio('pork-ham','pham-cure','cure','Cure (Traditional Ham)',true)}
    ${radio('pork-ham','pham-fresh','fresh','Do Not Cure (Fresh Pork Roast)',false)}
    ${radio('pork-ham','pham-grind','grind','Put Into Grind',false)}`;

  const hamopt = `
    ${radio('pork-hamopt','phamopt-whole','whole','Leave Whole (if possible)',true)}
    ${radio('pork-hamopt','phamopt-half','half','Cut in Half',false)}
    ${radio('pork-hamopt','phamopt-center','center','Center Cut (ham steaks + 2 small roasts)',false)}
    ${radio('pork-hamopt','phamopt-steaks','steaks','All Ham Steaks',false)}
    <div id="pork-ham-stk-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1" style="display:none">
      <div><label class="text-xs text-stone-600">Thickness</label>${sel('pork-ham-thick',['1/2"','3/4"','1"'],'3/4"')}</div>
      <div><label class="text-xs text-stone-600">Per Pack</label>${sel('pork-ham-pack',['1','2','3','4'],'2')}</div>
    </div>`;

  const grind = `
    ${radio('pork-grind','pgrind-ground','ground','Ground Pork (1 lb or 2 lb packages)',true)}
    ${radio('pork-grind','pgrind-sausage','sausage','Breakfast Sausage',false)}
    <div id="pork-sausage-sub" class="ml-6 mt-1" style="display:none"><label class="text-xs text-stone-600">Spice Level</label>${sel('pork-sausage-level',['Mild','Spicy (Medium)','Hot'],'Mild')}</div>`;

  return fsec(2,'Select Quantity','','',qty,true) +
    fsec(3,'Your Information','','',info,true) +
    fsec(4,'Pork Loin','[{"term":"Pork Chops","description":"Bone-in or boneless slices from the loin. Great for grilling or pan-frying."},{"term":"Put Into Grind","description":"Loin meat added to your ground pork."}]','',loin,false) +
    fsec(5,'Pork Shoulder','[{"term":"Cut Into Steaks","description":"Shoulder sliced into steaks. Flavorful - great for grilling or braising."},{"term":"Leave Whole","description":"Classic choice for slow-smoking into pulled pork. Usually 6-10 lbs."},{"term":"Put Into Grind","description":"Shoulder meat added to ground pork. Good fat content for sausage."}]','Leave whole for pulled pork.',shoulder,false) +
    fsec(6,'Spare Ribs','[{"term":"Leave Whole","description":"Full rack of spare ribs. Classic choice for smoking or BBQ."},{"term":"Cut in Half","description":"Each rack cut into two half-racks. Easier to store."},{"term":"Put Into Grind","description":"Rib meat trimmed off and added to ground pork."}]','Best smoked low and slow.',ribs,false) +
    fsec(7,'Pork Belly','[{"term":"Cure for Bacon","description":"The belly is salt-cured and smoked to make traditional bacon."},{"term":"Do Not Cure (Fresh Side)","description":"Packaged fresh without curing. Great for braising or pork belly buns."},{"term":"Put Into Grind","description":"Belly meat added to ground pork. Adds significant fat content."}]','Cure it for delicious homemade bacon, or keep fresh for braising.',belly,false) +
    fsec(8,'Ham','[{"term":"Cure (Traditional Ham)","description":"Salt-cured and smoked - just like a traditional holiday ham."},{"term":"Do Not Cure (Fresh Pork Roast)","description":"Kept fresh and unprocessed - a very large pork roast."},{"term":"Put Into Grind","description":"Ham meat added to your ground pork total."}]','Cured ham is holiday-ready. Fresh ham is like a large pork roast.',ham,false) +
    fsec(9,'Ham Cut Options','[{"term":"Leave Whole","description":"The ham is kept in one large piece."},{"term":"Cut in Half","description":"Ham cut into two pieces. Easier to store."},{"term":"Center Cut","description":"Center sliced into ham steaks, leaving two smaller roasts on each end."},{"term":"All Ham Steaks","description":"Entire ham sliced into individual steaks."}]','',hamopt,false) +
    fsec(10,'Ground Pork Options','[{"term":"Ground Pork","description":"Plain unseasoned ground pork, 1 lb or 2 lb packages."},{"term":"Breakfast Sausage","description":"Ground pork seasoned with a traditional breakfast sausage blend. Choose your heat level."}]','',grind,false) +
    `<div class="bg-red-50 border border-red-200 rounded-xl p-6 mt-4">
      <div class="text-sm text-stone-600">Required Deposit</div>
      <div class="text-3xl font-black text-red-700" id="pork-deposit-amount">$100</div>
      <div class="text-xs text-stone-500">Applied to final balance at pickup</div>
      <button id="pork-submit-btn" type="button" class="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-full text-lg flex items-center justify-center gap-2 transition-colors mt-4">Submit Pork Order</button>
    </div>`;
}

// ── budget modal ───────────────────────────────────────────────────────────────
const BUDGET_MODAL = `<div class="modal-bg" id="budget-modal">
<div class="modal-box">
  <div class="flex items-center justify-between mb-6">
    <div class="text-xl font-bold">&#x1F4B0; Budget Helper</div>
    <button data-close-budget style="background:none;border:none;font-size:1.5rem;color:#78716c;cursor:pointer">&times;</button>
  </div>
  <div class="space-y-6">
    <div>
      <p class="text-sm font-medium text-stone-700 mb-2">Select Animal</p>
      <div class="grid grid-cols-2 gap-2">
        <button class="bsel-btn selected" data-budget-animal="beef"><div class="text-2xl mb-1">&#x1F404;</div><div class="font-bold text-sm">Beef</div></button>
        <button class="bsel-btn" data-budget-animal="pork"><div class="text-2xl mb-1">&#x1F437;</div><div class="font-bold text-sm">Pork</div></button>
      </div>
    </div>
    <div><p class="text-sm font-medium text-stone-700 mb-2">Select Size</p><div class="grid gap-2" id="budget-size-wrap"></div></div>
    <div class="bg-stone-50 rounded-xl p-4 space-y-3">
      <div class="flex justify-between"><span class="text-stone-600">Price per lb (hanging weight)</span><span class="font-bold" id="budget-price-per-lb">--</span></div>
      <div class="flex justify-between"><span class="text-stone-600">Avg hanging weight