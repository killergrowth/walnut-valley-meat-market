      </span><span class="font-bold" id="budget-avg-weight">--</span></div>
      <div class="border-t border-stone-200 pt-3 flex justify-between"><span class="font-medium text-stone-800">Estimated Total</span><span class="text-xl font-black text-red-700" id="budget-total">--</span></div>
    </div>
    <div class="grid grid-cols-2 gap-3">
      <div class="bg-blue-50 rounded-lg p-3"><p class="text-sm font-medium text-blue-700 mb-1">Take-Home Weight</p><p class="text-lg font-bold text-blue-900" id="budget-take-home">--</p><p class="text-xs text-blue-600" id="budget-take-pct">--</p></div>
      <div class="bg-cyan-50 rounded-lg p-3"><p class="text-sm font-medium text-cyan-700 mb-1">Freezer Space</p><p class="text-lg font-bold text-cyan-900" id="budget-freezer">--</p><p class="text-xs text-cyan-600">Recommended</p></div>
    </div>
    <div class="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800"><strong>Deposit Required:</strong> <span id="budget-deposit">--</span></div>
    <div class="text-sm text-stone-600 space-y-2"><p><strong>What's included?</strong> Livestock, dry aging, processing, and packaging.</p><p><strong>Processing time:</strong> 2-4 weeks.</p></div>
    <button data-close-budget class="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-full transition-colors">Got It</button>
  </div>
</div>
</div>`;

const HELP_MODAL = `<div class="modal-bg" id="help-modal">
<div class="modal-box">
  <div class="flex items-center justify-between mb-4">
    <div class="text-xl font-bold" id="help-modal-title">Help</div>
    <button id="help-modal-close" style="background:none;border:none;font-size:1.5rem;color:#78716c;cursor:pointer">&times;</button>
  </div>
  <div id="help-modal-body"></div>
</div>
</div>`;

const CONTACT = `<section id="contact" class="py-12 px-4 bg-stone-100">
<div class="max-w-2xl mx-auto">
  <div class="text-center mb-8">
    <h2 class="text-3xl md:text-4xl font-chunkfive text-stone-900 mb-2 uppercase">Contact Us</h2>
    <p class="text-stone-600">Have a question? We'd love to hear from you.</p>
  </div>
  <form class="contact-form bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div><label class="block text-sm font-bold text-stone-700 mb-1">Name</label><input type="text" name="name" required placeholder="Your name" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"/></div>
      <div><label class="block text-sm font-bold text-stone-700 mb-1">Email</label><input type="email" name="email" required placeholder="your@email.com" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"/></div>
    </div>
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Subject</label><input type="text" name="subject" required placeholder="What's this about?" class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"/></div>
    <div><label class="block text-sm font-bold text-stone-700 mb-1">Message</label><textarea name="message" required rows="5" placeholder="Your message..." class="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700 resize-none"></textarea></div>
    <button type="submit" class="btn-submit w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 transition-colors">
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
      Send Message
    </button>
  </form>
  <div class="form-success" style="display:none">
    <div class="bg-white rounded-2xl shadow-lg p-10 text-center">
      <svg class="w-14 h-14 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
      <h3 class="text-xl font-chunkfive text-stone-900 mb-2">Message Sent!</h3>
      <p class="text-stone-600">Thanks for reaching out. We'll get back to you soon.</p>
    </div>
  </div>
</div>
</section>`;

return { beefFormHTML, porkFormHTML, BUDGET_MODAL, HELP_MODAL, CONTACT };
};
