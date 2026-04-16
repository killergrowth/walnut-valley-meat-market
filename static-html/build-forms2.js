'use strict';
// Continuation of build-forms.js - pork form tail + exports
// loaded by main.js via require

module.exports = function(radio, sel, fsec) {

function porkFormTail(loin, shoulder, ribs, belly, ham, hamopt, grind) {
  return fsec(7,'Pork Belly','[{"term":"Cure for Bacon","description":"The belly is salt-cured and smoked to make traditional bacon."},{"term":"Do Not Cure (Fresh Side)","description":"Packaged fresh without curing. Great for braising."},{"term":"Put Into Grind","description":"Belly meat added to ground pork."}]','Cure it for delicious homemade bacon.',belly,false) +
    fsec(8,'Ham','[{"term":"Cure (Traditional Ham)","description":"Salt-cured and smoked - just like a traditional holiday ham."},{"term":"Do Not Cure (Fresh Pork Roast)","description":"Kept fresh and unprocessed - a very large pork roast."},{"term":"Put Into Grind","description":"Ham meat added to your ground pork total."}]','Cured ham is holiday-ready.',ham,false) +
    fsec(9,'Ham Cut Options','[{"term":"Leave Whole","description":"The ham is kept in one large piece."},{"term":"Cut in Half","description":"Ham cut into two pieces. Easier to store."},{"term":"Center Cut","description":"Center sliced into ham steaks, leaving two smaller roasts on each end."},{"term":"All Ham Steaks","description":"Entire ham sliced into individual steaks."}]','',hamopt,false) +
    fsec(10,'Ground Pork Options','[{"term":"Ground Pork","description":"Plain unseasoned ground pork, 1 or 2 lb packages."},{"term":"Breakfast Sausage","description":"Ground pork seasoned with a traditional breakfast sausage blend. Choose your heat level."}]','',grind,false) +
    `<div class="bg-red-50 border border-red-200 rounded-xl p-6 mt-4"><div class="text-sm text-stone-600">Required Deposit</div><div class="text-3xl font-black text-red-700" id="pork-deposit-amount">$100</div><div class="text-xs text-stone-500">Applied to final balance at pickup</div><button id="pork-submit-btn" type="button" class="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-4 rounded-full text-lg flex items-center justify-center gap-2 transition-colors mt-4">Submit Pork Order</button></div>`;
}

return { porkFormTail };
};
