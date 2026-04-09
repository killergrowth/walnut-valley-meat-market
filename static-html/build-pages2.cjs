'use strict';
// build-pages2.cjs — page HTML body generators
// Requires CONTACT_SUFFIX, footer(), pageHead(), header(), locCard(), prodCard(), revSlide(), BUDGET_MODAL, HELP_MODAL from build-pages.cjs

const CONTACT_SUFFIX = ` bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>Send Message</button></form><div class="form-success" style="display:none"><div class="bg-white rounded-2xl shadow-lg p-10 text-center"><svg class="w-14 h-14 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg><h3 class="text-xl font-chunkfive text-stone-900 mb-2">Message Sent!</h3><p class="text-stone-600">Thanks for reaching out. We'll get back to you soon.</p></div></div></div></section>`;

module.exports = { CONTACT_SUFFIX };
