'use strict';
// build-forms.js — beef and pork cutting order form HTML generators

function radio(name, id, val, label, checked) {
  return `<div class="flex items-center gap-2 mb-2"><input type="radio" name="${name}" id="${id}" value="${val}"${checked?' checked':''} class="custom-radio flex-shrink-0"/><label for="${id}" class="text-sm text-stone-800 cursor-pointer">${label}</label></div>`;
}
function sel(name, opts, def) {
  return `<select name="${name}" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm mt-1">${opts.map(o=>`<option${o===def?' selected':''}>${o}</option>`).join('')}</select>`;
}
function fsec(num, title, defsJson, tip, inner, open) {
  const oc = open ? ' open' : '';
  const da = defsJson ? ` data-definitions='${defsJson}'` : '';
  const ta = tip ? ` data-tip="${tip.replace(/"/g,'&quot;')}"` : '';
  const hb = defsJson ? `<span role="button" tabindex="0" class="help-btn ml-2 cursor-pointer" style="font-size:.75rem;font-weight:600;color:#b91c1c;text-decoration:underline;text-underline-offset:2px;"${da}${ta} data-title="${title}" onclick="event.stopPropagation()">Help me with this step</span>` : '';
  return `<div class="bg-white rounded-xl border border-stone-200 overflow-hidden mb-4"><button type="button" class="w-full px-5 py-4 flex items-center justify-between hover:bg-stone-50 transition-colors" onclick="this.classList.toggle('open');this.nextElementSibling.classList.toggle('open')"><span class="font-bold text-stone-800">${num}. ${title}${hb}</span><svg class="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></button><div class="form-sect-body px-5 pb-5${oc}">${inner}</div></div>`;
}

function beefForm() {
  const qty = `<div class="grid grid-cols-3 gap-3">
  <button type="button" class="qty-card" data-beef-qty="whole"><div class="font-bold">Whole</div><div class="text-xs text-stone-500">~700 lbs</div><div class="text-sm font-semibold text-red-700 mt-1">$5.50/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~420 lbs take-home</div><div class="text-xs text-cyan-700">14-18 cu ft freezer</div><div class="text-xs text-stone-500">Est. ~$3,850</div></div></button>
  <button type="button" class="qty-card selected" data-beef-qty="half"><div class="font-bold">Half</div><div class="text-xs text-stone-500">~350 lbs</div><div class="text-sm font-semibold text-red-700 mt-1">$5.50/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~180 lbs take-home</div><div class="text-xs text-cyan-700">8-10 cu ft freezer</div><div class="text-xs text-stone-500">Est. ~$1,650</div></div></button>
  <button type="button" class="qty-card" data-beef-qty="quarter"><div class="font-bold">Quarter</div><div class="text-xs text-stone-500">~175 lbs</div><div class="text-sm font-semibold text-red-700 mt-1">$5.75/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~105 lbs take-home</div><div class="text-xs text-cyan-700">4-6 cu ft freezer</div><div class="text-xs text-stone-500">Est. ~$863</div></div></button>
</div>`;

  const info = `<div class="grid md:grid-cols-3 gap-4">
  <div><label class="block text-sm font-bold text-stone-700 mb-1">Full Name *</label><input type="text" id="beef-fullName" required placeholder="John Smith" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div>
  <div><label class="block text-sm font-bold text-stone-700 mb-1">Email *</label><input type="email" id="beef-email" required placeholder="john@email.com" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div>
  <div><label class="block text-sm font-bold text-stone-700 mb-1">Phone *</label><input type="tel" id="beef-phone" required placeholder="(316) 555-1234" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div>
</div><div class="mt-4"><label class="block text-sm font-bold text-stone-700 mb-1">Pickup Location *</label><select id="beef-pickup" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"><option value="">Select a location...</option><option>El Dorado - 1000 S. Main St., El Dorado, KS 67042</option><option>Andover - 620 N. Andover Rd., Andover, KS 67002</option><option>Augusta - 293 7th St., Augusta, KS 67010</option></select></div>`;

  const t34 = ['3/4"','1"','1 1/4"','1 1/2"'];
  const t12 = ['1/2"','3/4"','1"'];
  const pp  = ['1','2','3','4'];

  const rib = radio('beef-rib','rib-ribeye','ribeye','Ribeye Steaks (Boneless)',true) +
    `<div id="rib-ribeye-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1"><div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-rib-thick',t34,'1"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-rib-pack',pp,'2')}</div></div>` +
    radio('beef-rib','rib-prime','primerib','Prime Rib Roast',false) +
    `<div id="rib-prime-sub" class="ml-6 mt-1" style="display:none"><label class="text-xs text-stone-600">Roast Size</label>${sel('beef-rib-roast',['2-3 lb','3-4 lb','4-5 lb'],'3-4 lb')}</div>` +
    radio('beef-rib','rib-grind','grind','Grind (add to ground beef)',false);

  const loin = radio('beef-loin','loin-tbone','tbone','T-Bone Steaks',true) +
    `<div id="loin-tbone-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1"><div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-loin-thick-tbone',t34,'1"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-loin-pack-tbone',pp,'2')}</div></div>` +
    radio('beef-loin','loin-kc','kcfilet','KC Strip and Filet (bone removed)',false) +
    `<div id="loin-steak-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1" style="display:none"><div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-loin-thick',t34,'1"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-loin-pack',pp,'2')}</div></div>` +
    radio('beef-loin','loin-grind','grind','Grind (add to ground beef)',false);

  const sirloin = radio('beef-sirloin','sirl-steaks','steaks','Sirloin Steaks',true) +
    `<div id="sirloin-steak-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1"><div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-sirl-thick',t34,'1"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-sirl-pack',pp,'2')}</div></div>` +
    radio('beef-sirloin','sirl-roast','roast','Sirloin Roast',false) +
    `<div id="sirloin-roast-sub" class="ml-6 mt-1" style="display:none"><label class="text-xs text-stone-600">Roast Size</label>${sel('beef-sirl-roast',['2-3 lb','3-4 lb','4-5 lb'],'3-4 lb')}</div>` +
    radio('beef-sirloin','sirl-stew','stew','Stew Meat',false) +
    radio('beef-sirloin','sirl-grind','grind','Grind (add to ground beef)',false);

  const sirlointip = radio('beef-sirlointip','st-steaks','steaks','Sirloin Tip Steaks',true) +
    `<div id="sirlointip-steak-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1"><div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-st-thick',t34,'1"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-st-pack',pp,'2')}</div></div>` +
    radio('beef-sirlointip','st-roast','roast','Sirloin Tip Roast',false) +
    `<div id="sirlointip-roast-sub" class="ml-6 mt-1" style="display:none"><label class="text-xs text-stone-600">Roast Size</label>${sel('beef-st-roast',['2-3 lb','3-4 lb','4-5 lb'],'3-4 lb')}</div>` +
    radio('beef-sirlointip','st-stew','stew','Stew Meat',false) +
    radio('beef-sirlointip','st-grind','grind','Grind (add to ground beef)',false);

  const round = `<p class="text-xs text-stone-500 mb-3 italic">Choose one option below:</p>` +
    radio('beef-round','rnd-steak','steak','Round Steak',true) +
    `<div id="round-steak-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1"><div><label class="text-xs text-stone-600">Thickness</label>${sel('beef-rnd-thick',t12,'3/4"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-rnd-pack',pp,'2')}</div></div>` +
    radio('beef-round','rnd-tender','tenderized','Tenderized Round Steak (3/4" thick)',false) +
    radio('beef-round','rnd-minute','minute','Minute Steak (3/4" thick)',false) +
    radio('beef-round','rnd-roast','roast','Round Roast',false) +
    `<div id="round-roast-sub" class="ml-6 mt-1" style="display:none"><label class="text-xs text-stone-600">Roast Size</label>${sel('beef-rnd-roast',['2-3 lb','3-4 lb','4-5 lb'],'3-4 lb')}</div>` +
    radio('beef-round','rnd-grind','grind','Grind (add to ground beef)',false) +
    `<div id="round-rump-wrap" style="display:none"><div class="border-t border-stone-200 mt-3 pt-3"><p class="text-xs text-stone-500 mb-2 italic">Also available (choose one or both — Whole &amp; Half orders only):</p>` +
    `<div class="flex items-center gap-2 mb-2"><input type="checkbox" id="rnd-rump" name="beef-round-rump" class="custom-radio flex-shrink-0"/><label for="rnd-rump" class="text-sm text-stone-800 cursor-pointer">Rump Roast</label></div>` +
    `</div></div>` +
    `<div id="round-pikes-wrap" style="display:none">` +
    `<div class="flex items-center gap-2 mb-2 ml-0"><input type="checkbox" id="rnd-pikes" name="beef-round-pikes" class="custom-radio flex-shrink-0"/><label for="rnd-pikes" class="text-sm text-stone-800 cursor-pointer">Pikes Peak Roast</label></div>` +
    `</div>`;

  const chuck = `<div class="space-y-4"><div><p class="font-medium text-stone-800 mb-2">Chuck Roast</p>${radio('beef-chuck','chk-roast','roast','Roast',true)}${radio('beef-chuck','chk-grind','grind','Grind',false)}<div id="chk-roast-size" class="ml-6 mt-2"><label class="text-xs text-stone-600">Roast Size (when keeping as roast)</label>${sel('beef-chk-roast-sz',['2-3 lb','3-4 lb','4-5 lb'],'3-4 lb')}</div></div><div><p class="font-medium text-stone-800 mb-2">Arm Roast</p>${radio('beef-arm','arm-roast','roast','Roast',true)}${radio('beef-arm','arm-grind','grind','Grind',false)}<div id="arm-roast-size" class="ml-6 mt-2"><label class="text-xs text-stone-600">Roast Size (when keeping as roast)</label>${sel('beef-arm-roast-sz',['2-3 lb','3-4 lb','4-5 lb'],'3-4 lb')}</div></div></div>`;

  const brisket = `<div id="brisket-whole-wrap">${radio('beef-brisket','bk-whole','whole','Keep Whole',true)}</div><div id="brisket-half-wrap">${radio('beef-brisket','bk-half','half','Cut in Half',false)}</div><div id="brisket-qtr-wrap" style="display:none">${radio('beef-brisket','bk-halfq','halfbrisket','Half Brisket',false)}</div>${radio('beef-brisket','bk-grind','grind','Grind (add to ground beef)',false)}`;

  const ribssoup = `<div class="grid md:grid-cols-2 gap-6"><div><p class="font-medium text-stone-800 mb-2">Beef Ribs</p>${radio('beef-ribs','ribs-save','save','Save',true)}${radio('beef-ribs','ribs-grind','grind','Grind',false)}</div><div><p class="font-medium text-stone-800 mb-2">Soup Bones</p>${radio('beef-soup','soup-save','save','Save (sliced ~1.25")',true)}${radio('beef-soup','soup-grind','grind','Grind',false)}</div></div>`;

  const grind = `<div class="grid md:grid-cols-2 gap-4"><div><label class="block text-sm font-bold text-stone-700 mb-1">Leanness</label>${sel('beef-leanness',['80% Lean (Standard)','85% Lean','90% Lean'],'80% Lean (Standard)')}</div><div><label class="block text-sm font-bold text-stone-700 mb-1">Package Size</label>${sel('beef-pkg',['1 lb packages','2 lb packages'],'1 lb packages')}</div></div>`;

  const patties = `<div class="flex items-center gap-2 mb-3"><input type="checkbox" id="want-patties" class="sub-toggle-check" data-shows="patties-sub"/><label for="want-patties" class="text-sm text-stone-800">Yes, I want patties (10 lb minimum)</label></div><div id="patties-sub" style="display:none;padding-left:1.5rem"><div class="grid md:grid-cols-3 gap-4"><div><label class="text-xs text-stone-600">Total Pounds</label>${sel('beef-patty-lbs',['10','20','30'],'10')}</div><div><label class="text-xs text-stone-600">Patty Size</label>${sel('beef-patty-sz',['1/4 lb','1/3 lb','1/2 lb'],'1/3 lb')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('beef-patty-pp',['4','6','8','10'],'4')}</div></div></div>`;

  const organs = `<div class="space-y-3"><div class="flex items-start gap-2"><input type="checkbox" id="organ-liver"/><div><label for="organ-liver" class="font-medium text-stone-800 text-sm">Save Liver</label><p class="text-xs text-stone-500">Rich in iron. Great pan-fried with onions.</p></div></div><div class="flex items-start gap-2"><input type="checkbox" id="organ-heart"/><div><label for="organ-heart" class="font-medium text-stone-800 text-sm">Save Heart</label><p class="text-xs text-stone-500">Lean muscle meat. Good for tacos or grilling.</p></div></div><div class="flex items-start gap-2"><input type="checkbox" id="organ-tongue"/><div><label for="organ-tongue" class="font-medium text-stone-800 text-sm">Save Tongue</label><p class="text-xs text-stone-500">Tender slow-cooked. Popular for tacos (lengua).</p></div></div><div class="flex items-start gap-2 border-t border-stone-100 pt-3 mt-1"><input type="checkbox" id="organ-none"/><div><label for="organ-none" class="font-medium text-stone-500 text-sm italic">No thank you — discard all organ meats</label></div></div></div>`;

  return fsec(2,'Select Quantity','','',qty,true) +
    fsec(3,'Your Information','','',info,true) +
    fsec(4,'Rib Section','[{"term":"Ribeye Steaks","description":"Rich, well-marbled steaks from the rib area. Great for pan-searing or grilling."},{"term":"Prime Rib Roast","description":"Large bone-in roast. Ideal for slow-roasting."},{"term":"Grind","description":"Rib meat added to your ground beef total."}]','Ribeye is a top steak cut.',rib,false) +
    fsec(5,'Loin Section','[{"term":"T-Bone Steaks","description":"Classic steak with T-shaped bone. Great for grilling."},{"term":"KC Strip and Filet","description":"Two premium boneless cuts from one section."},{"term":"Grind","description":"Loin meat added to ground beef."}]','T-Bone and KC Strip are top choices.',loin,false) +
    fsec(6,'Sirloin Section','[{"term":"Sirloin Steaks","description":"Lean, boneless steaks. Great for grilling or fajitas."},{"term":"Stew Meat","description":"Sirloin cut into bite-sized cubes. Perfect for beef stew, chili, or slow-cooker dishes."},{"term":"Grind","description":"Added to ground beef."}]','Lean and flavorful.',sirloin,false) +
    fsec('6b','Sirloin Tip Section','[{"term":"Sirloin Tip Steaks","description":"Lean, flavorful steaks cut from the sirloin tip. Great for grilling or marinating."},{"term":"Sirloin Tip Roast","description":"A lean, budget-friendly roast. Best slow-roasted or braised."},{"term":"Stew Meat","description":"Sirloin tip cut into bite-sized cubes. Perfect for stew, chili, or slow-cooker dishes."},{"term":"Grind","description":"Added to ground beef."}]','Lean tip cut adjacent to the sirloin.',sirlointip,false) +
    fsec(7,'Round Section','[{"term":"Round Steak","description":"Lean rear-leg steak. Best braised or sliced thin."},{"term":"Tenderized Round Steak","description":"Mechanically tenderized - great for chicken-fried steak."},{"term":"Minute Steak","description":"Thin-sliced, cooks in under a minute."},{"term":"Round Roast","description":"Large lean roast from the top round. Best slow-roasted or braised."},{"term":"Rump Roast","description":"A well-marbled roast from the hindquarters. Best slow-roasted in a Dutch oven or slow cooker — falls apart tender when braised. Common sizes: 3–6 lbs. Available for Whole and Half orders only."},{"term":"Pikes Peak Roast","description":"A flavorful, economical roast cut from the lower round (heel). Dense muscle that becomes very tender with long, slow moist-heat cooking — great for shredded beef or pot roast. Common sizes: 3–6 lbs. Available for Whole and Half orders only."},{"term":"Grind","description":"Added to ground beef. Very lean."}]','Lean rear-leg muscle.',round,false) +
    fsec(8,'Chuck Section','[{"term":"Chuck Roast","description":"Classic pot roast cut from the shoulder. Incredible when braised low and slow — rich, beefy flavor. Common sizes: 2–5 lbs."},{"term":"Arm Roast","description":"A slightly leaner round-bone roast from the shoulder. Great for pot roast and braised dishes. Slightly firmer texture than chuck. Common sizes: 2–5 lbs."}]','Great for pot roast.',chuck,false) +
    fsec(9,'Brisket','[{"term":"Keep Whole","description":"Full brisket intact - 12-16 lbs. Perfect for smoking. (Whole & Half orders)"},{"term":"Cut in Half","description":"Cut lengthwise, fat left on. (Whole & Half orders)"},{"term":"Half Brisket","description":"One half of the brisket packaged for you. Great for smaller households or smoking. (Quarter orders)"},{"term":"Grind","description":"Added to ground beef."}]','',brisket,false) +
    fsec(10,'Ribs and Soup Bones','[{"term":"Beef Ribs — Save","description":"The beef back ribs are packaged for you. Great for smoking or slow-cooking."},{"term":"Beef Ribs — Grind","description":"The rib meat is trimmed off and added to your ground beef."},{"term":"Soup Bones — Save","description":"Marrow-rich bones sliced to about 1.25\\" thick. Perfect for making rich bone broth, stock, or soups."},{"term":"Soup Bones — Grind","description":"The meat around the bones is trimmed off and added to your ground beef."}]','Ribs are great for BBQ. Soup bones make rich bone broth.',ribssoup,false) +
    fsec(11,'Ground Beef Settings','[{"term":"80% Lean (Standard)","description":"Standard ground beef with 20% fat. The most flavorful option and best yield. Great for burgers, meat sauce, and most recipes."},{"term":"85% Lean","description":"Slightly leaner with 15% fat. A good middle ground — less shrinkage than 80% but still flavorful."},{"term":"90% Lean","description":"Very lean ground beef. Less flavor and more shrinkage when cooked, but preferred for low-fat diets."},{"term":"1 lb packages","description":"Each package contains 1 pound of ground beef. Good for smaller households or single meals."},{"term":"2 lb packages","description":"Each package contains 2 pounds of ground beef. Great for larger families or batch cooking."}]','These settings apply to ALL items sent to grind.',grind,false) +
    fsec(12,'Hamburger Patties (Optional)','[{"term":"1/3 lb Patty","description":"Popular standard size. The classic burger."}]','Pre-made patties come from your ground beef.',patties,false) +
    fsec(13,'Organ Meats','','If not selected, these do NOT go into ground beef.',organs,false) +
    `<div class="bg-red-50 border border-red-200 rounded-xl p-6 mt-4"><div class="text-sm text-stone-600">Required Deposit</div><div class="text-3xl font-black text-red-700" id="beef-deposit-amount">$600</div><div class="text-xs text-stone-500">Applied to final balance at pickup</div><button id="beef-submit-btn" type="button" class="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-full text-lg flex items-center justify-center gap-2 transition-colors mt-4">Submit Beef Order</button></div>`;
}

function porkForm() {
  const qty = `<div class="grid grid-cols-2 gap-3"><button type="button" class="qty-card" data-pork-qty="whole"><div class="font-bold">Whole Hog</div><div class="text-xs text-stone-500">~200 lbs hanging</div><div class="text-sm font-semibold text-red-700 mt-1">$3.50/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~130 lbs take-home</div><div class="text-xs text-cyan-700">6-8 cu ft</div><div class="text-xs text-stone-500">Est. ~$700</div><div class="text-xs text-stone-400 italic">May choose 2 options per section</div></div></button><button type="button" class="qty-card selected" data-pork-qty="half"><div class="font-bold">Half Hog</div><div class="text-xs text-stone-500">~100 lbs hanging</div><div class="text-sm font-semibold text-red-700 mt-1">$3.75/lb</div><div class="border-t border-stone-200 mt-2 pt-2"><div class="text-xs text-blue-700">~65 lbs take-home</div><div class="text-xs text-cyan-700">3-4 cu ft</div><div class="text-xs text-stone-500">Est. ~$375</div><div class="text-xs text-stone-400 italic">1 option per section</div></div></button></div>`;

  const info = `<div class="grid md:grid-cols-3 gap-4"><div><label class="block text-sm font-bold text-stone-700 mb-1">Full Name *</label><input type="text" id="pork-fullName" required placeholder="John Smith" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div><div><label class="block text-sm font-bold text-stone-700 mb-1">Email *</label><input type="email" id="pork-email" required placeholder="john@email.com" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div><div><label class="block text-sm font-bold text-stone-700 mb-1">Phone *</label><input type="tel" id="pork-phone" required placeholder="(316) 555-1234" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"/></div></div><div class="mt-4"><label class="block text-sm font-bold text-stone-700 mb-1">Pickup Location *</label><select id="pork-pickup" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm"><option value="">Select a location...</option><option>El Dorado - 1000 S. Main St., El Dorado, KS 67042</option><option>Andover - 620 N. Andover Rd., Andover, KS 67002</option><option>Augusta - 293 7th St., Augusta, KS 67010</option></select></div>`;

  const t = ['1/2"','3/4"','1"'];
  const pp = ['1','2','3','4'];

  const loin = radio('pork-loin','ploin-chops','chops','Pork Chops',true) +
    `<div id="pork-loin-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1"><div><label class="text-xs text-stone-600">Thickness</label>${sel('pork-loin-thick',t,'3/4"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('pork-loin-pack',pp,'2')}</div></div>` +
    radio('pork-loin','ploin-grind','grind','Put Into Grind',false);

  const tShldr = ['1/2"','3/4"','1"','1 1/4"','1 1/2"'];
  const shoulder = radio('pork-shoulder','pshldr-steaks','steaks','Cut Into Steaks',false) +
    `<div id="pork-shoulder-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1" style="display:none"><div><label class="text-xs text-stone-600">Thickness</label>${sel('pork-shldr-thick',tShldr,'3/4"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('pork-shldr-pack',pp,'2')}</div></div>` +
    radio('pork-shoulder','pshldr-whole','whole','Leave Whole (for pulled pork)',true) +
    radio('pork-shoulder','pshldr-grind','grind','Put Into Grind',false);

  const ribs = radio('pork-ribs','pribs-whole','whole','Leave Whole',true) +
    radio('pork-ribs','pribs-half','half','Cut in Half',false) +
    radio('pork-ribs','pribs-grind','grind','Put Into Grind',false);

  const belly = radio('pork-belly','pbelly-bacon','bacon','Cure for Bacon',true) +
    radio('pork-belly','pbelly-fresh','fresh','Do Not Cure (Fresh Side)',false) +
    radio('pork-belly','pbelly-grind','grind','Put Into Grind',false);

  const ham = radio('pork-ham','pham-cure','cure','Cure (Traditional Ham)',true) +
    radio('pork-ham','pham-fresh','fresh','Do Not Cure (Fresh Pork Roast)',false) +
    radio('pork-ham','pham-cutlets','cutlets','Cutlets',false) +
    `<div id="pork-ham-cutlets-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1" style="display:none"><div><label class="text-xs text-stone-600">Total Pounds</label>${sel('pork-ham-cutlet-lbs',['2 lb','3 lb','4 lb'],'4 lb')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('pork-ham-cutlet-pp',pp,'2')}</div></div>` +
    radio('pork-ham','pham-grind','grind','Put Into Grind',false);

  const hamopt = radio('pork-hamopt','phamopt-whole','whole','Leave Whole (if possible)',true) +
    radio('pork-hamopt','phamopt-half','half','Cut in Half',false) +
    radio('pork-hamopt','phamopt-center','center','Center Cut (ham steaks + 2 small roasts)',false) +
    `<div id="pork-ham-center-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1" style="display:none"><div><label class="text-xs text-stone-600">Thickness</label>${sel('pork-ham-center-thick',t,'3/4"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('pork-ham-center-pack',pp,'2')}</div></div>` +
    radio('pork-hamopt','phamopt-steaks','steaks','All Ham Steaks',false) +
    `<div id="pork-ham-stk-sub" class="ml-6 grid grid-cols-2 gap-3 mt-1" style="display:none"><div><label class="text-xs text-stone-600">Thickness</label>${sel('pork-ham-thick',t,'3/4"')}</div><div><label class="text-xs text-stone-600">Per Pack</label>${sel('pork-ham-pack',pp,'2')}</div></div>`;

  const grind = `<p id="pork-grind-whole-note" class="text-xs text-stone-500 mb-3 italic" style="display:none">Whole Hog: you may choose both.</p>` +
    `<div class="flex items-center gap-2 mb-2"><input type="checkbox" id="pgrind-ground" name="pork-grind-ground" checked class="custom-radio flex-shrink-0"/><label for="pgrind-ground" class="text-sm text-stone-800 cursor-pointer">Ground Pork</label></div>` +
    `<div id="pork-ground-pkg-sub" class="ml-6 mt-1 mb-2"><label class="text-xs text-stone-600">Package Size</label>${sel('pork-ground-pkg',['1 lb packages','2 lb packages'],'1 lb packages')}</div>` +
    `<div class="flex items-center gap-2 mb-2"><input type="checkbox" id="pgrind-sausage" name="pork-grind-sausage" class="custom-radio flex-shrink-0"/><label for="pgrind-sausage" class="text-sm text-stone-800 cursor-pointer">Breakfast Sausage</label></div>` +
    `<div id="pork-sausage-sub" class="ml-6 mt-1 mb-2 grid grid-cols-2 gap-3" style="display:none"><div><label class="text-xs text-stone-600">Spice Level</label>${sel('pork-sausage-level',['Mild','Medium','Hot'],'Mild')}</div><div><label class="text-xs text-stone-600">Package Size</label>${sel('pork-sausage-pkg',['1 lb packages','2 lb packages'],'1 lb packages')}</div></div>`;

  return fsec(2,'Select Quantity','','',qty,true) +
    fsec(3,'Your Information','','',info,true) +
    fsec(4,'Pork Loin','[{"term":"Pork Chops","description":"Bone-in or boneless slices from the loin. Great for grilling or pan-frying."},{"term":"Put Into Grind","description":"Loin meat added to your ground pork."}]','',loin,false) +
    fsec(5,'Pork Shoulder','[{"term":"Cut Into Steaks","description":"Shoulder sliced into steaks. Great for grilling or braising."},{"term":"Leave Whole","description":"Classic choice for slow-smoking into pulled pork."},{"term":"Put Into Grind","description":"Shoulder meat added to ground pork."}]','Leave whole for pulled pork.',shoulder,false) +
    fsec(6,'Spare Ribs','[{"term":"Leave Whole","description":"Full rack of spare ribs. Classic choice for smoking or BBQ."},{"term":"Cut in Half","description":"Each rack cut into two half-racks."},{"term":"Put Into Grind","description":"Rib meat added to ground pork."}]','Best smoked low and slow.',ribs,false) +
    fsec(7,'Pork Belly','[{"term":"Cure for Bacon","description":"The belly is salt-cured and smoked to make traditional bacon."},{"term":"Do Not Cure (Fresh Side)","description":"Packaged fresh without curing. Great for braising."},{"term":"Put Into Grind","description":"Belly meat added to ground pork."}]','',belly,false) +
    fsec(8,'Ham','[{"term":"Cure (Traditional Ham)","description":"Salt-cured and smoked - just like a traditional holiday ham."},{"term":"Do Not Cure (Fresh Pork Roast)","description":"Kept fresh - a very large pork roast."},{"term":"Cutlets","description":"Ham sliced into thin cutlets. Great for pan-frying, breading, or sandwiches. Choose total pounds and pack size."},{"term":"Put Into Grind","description":"Ham meat added to ground pork."}]','',ham,false) +
    fsec(9,'Ham Cut Options','[{"term":"Leave Whole","description":"Ham kept in one large piece."},{"term":"Cut in Half","description":"Ham cut into two pieces."},{"term":"Center Cut","description":"Center sliced into ham steaks, leaving two smaller roasts on each end."},{"term":"All Ham Steaks","description":"Entire ham sliced into individual steaks."}]','',hamopt,false) +
    fsec(10,'Ground Pork Options','[{"term":"Ground Pork","description":"Plain unseasoned ground pork, 1 or 2 lb packages."},{"term":"Breakfast Sausage","description":"Ground pork seasoned with breakfast sausage blend. Choose your heat level."}]','',grind,false) +
    `<div class="bg-red-50 border border-red-200 rounded-xl p-6 mt-4"><div class="text-sm text-stone-600">Required Deposit</div><div class="text-3xl font-black text-red-700" id="pork-deposit-amount">$100</div><div class="text-xs text-stone-500">Applied to final balance at pickup</div><button id="pork-submit-btn" type="button" class="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-full text-lg flex items-center justify-center gap-2 transition-colors mt-4">Submit Pork Order</button></div>`;
}

module.exports = { beefForm, porkForm };
