/* build: 2026-04-16 17:28 */
/* =============================================
   Walnut Valley Meat Market �" main.js
   Handles: nav, mobile menu, reviews carousel,
   budget helper modal, cutting order forms,
   contact form, accordion form sections
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  // �"��"� Header: highlight active page �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const currentPage = document.body.dataset.page || 'home';
  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });

  // On home page: show anchor links in desktop nav
  if (currentPage === 'home') {
    const homeAnchors = [
      { label: 'Bundles', href: '#bundles' },
      { label: 'Fill Your Freezer', href: '#calculator' },
      { label: 'Locations', href: '#locations' },
      { label: 'Products', href: '#products' },
      { label: 'Our Story', href: '#about' },
    ];
    const desktopSlot = document.getElementById('home-anchors-desktop');
    if (desktopSlot) {
      homeAnchors.forEach(a => {
        const el = document.createElement('a');
        el.href = a.href;
        el.className = 'px-3 py-2 rounded-full text-base font-chunkfive text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors';
        el.textContent = a.label;
        desktopSlot.appendChild(el);
      });
    }
    const mobileAnchorsWrap = document.getElementById('mobile-anchors-wrap');
    if (mobileAnchorsWrap) mobileAnchorsWrap.style.display = 'block';
  }

  // �"��"� Mobile menu toggle �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const iconMenu   = document.getElementById('icon-menu');
  const iconClose  = document.getElementById('icon-close');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const open = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', open);
      if (iconMenu)  iconMenu.classList.toggle('hidden', !open);
      if (iconClose) iconClose.classList.toggle('hidden', open);
    });

    // Close menu on anchor link click (mobile)
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        if (iconMenu)  iconMenu.classList.remove('hidden');
        if (iconClose) iconClose.classList.add('hidden');
      });
    });
  }

  // �"��"� Accordion Form Sections �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  document.querySelectorAll('.form-section-header').forEach(header => {
    header.addEventListener('click', (e) => {
      // Don't toggle if help button was clicked
      if (e.target.closest('.help-btn')) return;
      const body = header.nextElementSibling;
      if (!body) return;
      const isOpen = body.classList.contains('open');
      body.classList.toggle('open', !isOpen);
      header.classList.toggle('open', !isOpen);
    });
  });

  // �"��"� Reviews Carousel �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const reviewSlides = document.querySelectorAll('.review-slide');
  const dots = document.querySelectorAll('.review-dot');
  let currentReview = 0;
  let autoplayTimer = null;

  function showReview(index) {
    reviewSlides.forEach((s, i) => {
      s.style.display = i === index ? 'block' : 'none';
    });
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === index);
    });
    currentReview = index;
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => {
      showReview((currentReview + 1) % reviewSlides.length);
    }, 5000);
  }

  function stopAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
  }

  if (reviewSlides.length > 0) {
    showReview(0);
    startAutoplay();

    const prevBtn = document.getElementById('review-prev');
    const nextBtn = document.getElementById('review-next');

    if (prevBtn) prevBtn.addEventListener('click', () => {
      stopAutoplay();
      showReview((currentReview - 1 + reviewSlides.length) % reviewSlides.length);
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
      stopAutoplay();
      showReview((currentReview + 1) % reviewSlides.length);
    });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        stopAutoplay();
        showReview(i);
      });
    });
  }

  // �"��"� Budget Helper Modal �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const budgetModal   = document.getElementById('budget-modal');
  const openBtns      = document.querySelectorAll('[data-open-budget]');
  const closeBtns     = document.querySelectorAll('[data-close-budget]');

  function openBudgetModal() {
    if (budgetModal) {
      budgetModal.classList.add('open');
      document.body.style.overflow = 'hidden';
      updateBudgetCalc();
    }
  }

  function closeBudgetModal() {
    if (budgetModal) {
      budgetModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  openBtns.forEach(btn => btn.addEventListener('click', openBudgetModal));
  closeBtns.forEach(btn => btn.addEventListener('click', closeBudgetModal));

  if (budgetModal) {
    budgetModal.addEventListener('click', (e) => {
      if (e.target === budgetModal) closeBudgetModal();
    });
  }

  // Listen for custom event (from notice box button)
  window.addEventListener('openBudgetHelper', openBudgetModal);

  // Budget Calculator Logic
  const animalData = {
    beef: {
      name: 'Beef',
      sizes: ['whole', 'half', 'quarter'],
      sizeLabels: { whole: 'Whole', half: 'Half', quarter: 'Quarter' },
      pricing: {
        whole:   { pricePerLb: 5.50, avgWeight: 700,  deposit: 1200, freezerSpace: '14-18 cu ft' },
        half:    { pricePerLb: 5.50, avgWeight: 350,  deposit: 600,  freezerSpace: '8-10 cu ft'  },
        quarter: { pricePerLb: 5.75, avgWeight: 175,  deposit: 300,  freezerSpace: '4-6 cu ft'   },
      },
      takeHomePercent: 0.6,
    },
    pork: {
      name: 'Pork',
      sizes: ['whole', 'half'],
      sizeLabels: { whole: 'Whole Hog', half: 'Half Hog' },
      pricing: {
        whole: { pricePerLb: 4.00, avgWeight: 200, deposit: 400, freezerSpace: '6-8 cu ft' },
        half:  { pricePerLb: 4.25, avgWeight: 100, deposit: 200, freezerSpace: '3-4 cu ft' },
      },
      takeHomePercent: 0.65,
    },
  };

  let budgetAnimal = 'beef';
  let budgetSize   = 'half';

  function updateBudgetCalc() {
    const animal  = animalData[budgetAnimal];
    const validSz = animal.sizes.includes(budgetSize) ? budgetSize : animal.sizes[0];
    const p       = animal.pricing[validSz];
    const total   = p.pricePerLb * p.avgWeight;
    const takeHome= Math.round(p.avgWeight * animal.takeHomePercent);

    const el = (id) => document.getElementById(id);
    if (el('budget-price-per-lb')) el('budget-price-per-lb').textContent = '$' + p.pricePerLb.toFixed(2);
    if (el('budget-avg-weight'))   el('budget-avg-weight').textContent   = '~' + p.avgWeight + ' lbs';
    if (el('budget-total'))        el('budget-total').textContent        = '$' + total.toLocaleString();
    if (el('budget-take-home'))    el('budget-take-home').textContent    = '~' + takeHome + ' lbs';
    if (el('budget-take-pct'))     el('budget-take-pct').textContent     = '~' + Math.round(animal.takeHomePercent * 100) + '% of hanging weight';
    if (el('budget-freezer'))      el('budget-freezer').textContent      = p.freezerSpace;
    if (el('budget-deposit'))      el('budget-deposit').textContent      = '$' + p.deposit.toLocaleString();

    // Update animal selector buttons
    document.querySelectorAll('[data-budget-animal]').forEach(btn => {
      btn.classList.toggle('selected', btn.dataset.budgetAnimal === budgetAnimal);
    });

    // Rebuild size buttons
    const sizeWrap = document.getElementById('budget-size-wrap');
    if (sizeWrap) {
      sizeWrap.innerHTML = '';
      // Set columns based on number of sizes so buttons display side-by-side
      sizeWrap.className = 'grid gap-2 grid-cols-' + animal.sizes.length;
      animal.sizes.forEach(sz => {
        const btn = document.createElement('button');
        btn.className = 'budget-selector-btn' + (sz === validSz ? ' selected' : '');
        btn.innerHTML = `<div style="font-weight:700">${animal.sizeLabels[sz]}</div>
                         <div style="font-size:0.75rem;color:var(--stone-500)">~${animal.pricing[sz].avgWeight} lbs</div>`;
        btn.dataset.budgetSize = sz;
        btn.addEventListener('click', () => { budgetSize = sz; updateBudgetCalc(); });
        sizeWrap.appendChild(btn);
      });
    }
  }

  document.querySelectorAll('[data-budget-animal]').forEach(btn => {
    btn.addEventListener('click', () => {
      budgetAnimal = btn.dataset.budgetAnimal;
      const animal = animalData[budgetAnimal];
      if (!animal.sizes.includes(budgetSize)) budgetSize = animal.sizes[0];
      updateBudgetCalc();
    });
  });

  // �"��"� Animal Selector (Cutting Order) �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const animalBtns    = document.querySelectorAll('[data-animal]');
  const beefForm      = document.getElementById('beef-form');
  const porkForm      = document.getElementById('pork-form');

  animalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selected = btn.dataset.animal;
      animalBtns.forEach(b => b.classList.toggle('selected', b.dataset.animal === selected));

      // Show check marks
      document.querySelectorAll('.animal-check').forEach(c => c.style.display = 'none');
      const check = btn.querySelector('.animal-check');
      if (check) check.style.display = 'flex';

      if (beefForm) beefForm.style.display = selected === 'beef' ? 'block' : 'none';
      if (porkForm) porkForm.style.display = selected === 'pork' ? 'block' : 'none';
    });
  });

  // �"��"� Beef Form: Quantity Selector �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const beefQtyBtns = document.querySelectorAll('[data-beef-qty]');
  const depositDisplay = document.getElementById('beef-deposit-amount');
  let beefQty = 'half';

  const beefDeposits = { whole: 1200, half: 600, quarter: 300 };

  function updateBeefDeposit() {
    if (depositDisplay) depositDisplay.textContent = '$' + beefDeposits[beefQty].toLocaleString();
  }

  beefQtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      beefQty = btn.dataset.beefQty;
      beefQtyBtns.forEach(b => b.classList.toggle('selected', b.dataset.beefQty === beefQty));

      // Quarter: swap brisket options
      const brisketWhole = document.getElementById('brisket-whole-wrap');
      const brisketHalf  = document.getElementById('brisket-half-wrap');
      const brisketQtr   = document.getElementById('brisket-qtr-wrap');
      if (brisketWhole) brisketWhole.style.display = beefQty === 'quarter' ? 'none' : '';
      if (brisketHalf)  brisketHalf.style.display  = beefQty === 'quarter' ? 'none' : '';
      if (brisketQtr)   brisketQtr.style.display   = beefQty === 'quarter' ? '' : 'none';

      // Whole/Half only: Rump Roast and Pikes Peak Roast options in Round section
      updateRoundWholeHalfOptions();

      updateBeefDeposit();
    });
  });

  function updateRoundWholeHalfOptions() {
    const isWholeOrHalf = (beefQty === 'whole' || beefQty === 'half');
    const rumpWrap  = document.getElementById('round-rump-wrap');
    const pikesWrap = document.getElementById('round-pikes-wrap');
    if (rumpWrap)  rumpWrap.style.display  = isWholeOrHalf ? '' : 'none';
    if (pikesWrap) pikesWrap.style.display = isWholeOrHalf ? '' : 'none';
    // If quarter selected, uncheck rump/pikes checkboxes
    if (!isWholeOrHalf) {
      const rumpCb  = document.getElementById('rnd-rump');
      const pikesCb = document.getElementById('rnd-pikes');
      if (rumpCb)  rumpCb.checked  = false;
      if (pikesCb) pikesCb.checked = false;
    }
  }

  // Initialize Rump/Pikes visibility on load (default is half = show them)
  updateRoundWholeHalfOptions();

  updateBeefDeposit();

  // --- Show/hide roast size sub-options based on radio selection ---
  function bindRoastSizeToggle(radioName, showForValue, sizeElId) {
    const sizeEl = document.getElementById(sizeElId);
    if (!sizeEl) return;
    function update() {
      const checked = document.querySelector(`input[name="${radioName}"]:checked`);
      sizeEl.style.display = (checked && checked.value === showForValue) ? '' : 'none';
    }
    document.querySelectorAll(`input[name="${radioName}"]`).forEach(r => r.addEventListener('change', update));
    update(); // initialize
  }

  // Ham Cut Options: Center Cut and All Ham Steaks sub-panels
  bindRadioSubOptionsMulti('pork-hamopt', ['center'], 'pork-ham-center-sub', 'grid');
  bindRadioSubOptionsMulti('pork-hamopt', ['steaks'],  'pork-ham-stk-sub',    'grid');

  // Section 9 visibility: only show Ham Cut Options when Cure or Do Not Cure is selected
  // Hide it when Cutlets or Put Into Grind is selected
  (function() {
    function updateHamOptVisibility() {
      const checked = document.querySelector('input[name="pork-ham"]:checked');
      const section = document.getElementById('pork-hamopt-section');
      if (!section) return;
      const showOpt = checked && (checked.value === 'cure' || checked.value === 'fresh');
      section.style.display = showOpt ? '' : 'none';
    }
    document.querySelectorAll('input[name="pork-ham"]').forEach(r => r.addEventListener('change', updateHamOptVisibility));
    updateHamOptVisibility();
  })();

  // Chuck Roast size - show when "roast" selected, hide when "grind"
  bindRoastSizeToggle('beef-chuck', 'roast', 'chk-roast-size');
  // Arm Roast size - show when "roast" selected, hide when "grind"
  bindRoastSizeToggle('beef-arm', 'roast', 'arm-roast-size');
  // Round Steak: show Thickness + Per Pack only when Round Steak is selected
  bindRadioSubOptionsMulti('beef-round', ['steak'], 'round-steak-sub', 'grid');
  // Round Roast size - show when "roast" selected
  bindRoastSizeToggle('beef-round', 'roast', 'round-roast-sub');
  // Tenderized Round Steak: show Per Pack when selected
  bindRadioSubOptionsMulti('beef-round', ['tenderized'], 'round-tender-sub', 'block');
  // Minute Steak: show Per Pack when selected
  bindRadioSubOptionsMulti('beef-round', ['minute'], 'round-minute-sub', 'block');
  // Ribeye: show Thickness + Per Pack only when Ribeye is selected
  bindRadioSubOptionsMulti('beef-rib', ['ribeye'], 'rib-ribeye-sub', 'grid');
  // Prime Rib Roast size - show when "primerib" selected in Rib section
  bindRoastSizeToggle('beef-rib', 'primerib', 'rib-prime-sub');
  // Sirloin Steaks: show Thickness + Per Pack only when Steaks is selected
  bindRadioSubOptionsMulti('beef-sirloin', ['steaks'], 'sirloin-steak-sub', 'grid');
  // Sirloin Roast size – show when "roast" selected in Sirloin section
  bindRoastSizeToggle('beef-sirloin', 'roast', 'sirloin-roast-sub');
  // Pork Shoulder: show Thickness + Per Pack when "Cut Into Steaks" is selected
  bindRadioSubOptionsMulti('pork-shoulder', ['steaks'], 'pork-shoulder-sub', 'grid');
  // Ham Cutlets: show pounds + per pack when "Cutlets" is selected
  bindRadioSubOptionsMulti('pork-ham', ['cutlets'], 'pork-ham-cutlets-sub', 'grid');
  // Sirloin Tip Steaks: show Thickness + Per Pack only when Steaks is selected
  bindRadioSubOptionsMulti('beef-sirlointip', ['steaks'], 'sirlointip-steak-sub', 'grid');
  // Sirloin Tip Roast size – show when "roast" selected in Sirloin Tip section
  bindRoastSizeToggle('beef-sirlointip', 'roast', 'sirlointip-roast-sub');

  // �"��"� Pork Form: Quantity Selector �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const porkQtyBtns = document.querySelectorAll('[data-pork-qty]');
  const porkDepositDisplay = document.getElementById('pork-deposit-amount');
  let porkQty = 'half';

  const porkDeposits = { whole: 200, half: 100 };

  porkQtyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      porkQty = btn.dataset.porkQty;
      porkQtyBtns.forEach(b => b.classList.toggle('selected', b.dataset.porkQty === porkQty));
      if (porkDepositDisplay) porkDepositDisplay.textContent = '$' + porkDeposits[porkQty].toLocaleString();
    });
  });

  // Pork Ground: checkboxes — Whole Hog can pick both, Half Hog single-select
  // (must be after porkQty is declared above)
  (function() {
    const pkgSub    = document.getElementById('pork-ground-pkg-sub');
    const sausageSub = document.getElementById('pork-sausage-sub');
    const groundCb  = document.getElementById('pgrind-ground');
    const sausageCb = document.getElementById('pgrind-sausage');
    const wholeNote = document.getElementById('pork-grind-whole-note');

    function updateSubPanels() {
      if (pkgSub)     pkgSub.style.display    = (groundCb  && groundCb.checked)  ? ''     : 'none';
      if (sausageSub) sausageSub.style.display = (sausageCb && sausageCb.checked) ? 'grid' : 'none';
    }

    function onGroundChange() {
      // Half Hog: uncheck the other if this one is being checked
      if (porkQty !== 'whole' && groundCb.checked && sausageCb) sausageCb.checked = false;
      updateSubPanels();
    }
    function onSausageChange() {
      if (porkQty !== 'whole' && sausageCb.checked && groundCb) groundCb.checked = false;
      updateSubPanels();
    }

    if (groundCb)  groundCb.addEventListener('change',  onGroundChange);
    if (sausageCb) sausageCb.addEventListener('change', onSausageChange);

    function updateGrindNote() {
      if (wholeNote) wholeNote.style.display = porkQty === 'whole' ? '' : 'none';
      // If switching from whole to half with both checked, uncheck sausage
      if (porkQty !== 'whole' && groundCb && sausageCb && groundCb.checked && sausageCb.checked) {
        sausageCb.checked = false;
        updateSubPanels();
      }
    }

    porkQtyBtns.forEach(btn => btn.addEventListener('click', updateGrindNote));

    updateGrindNote();
    updateSubPanels();
  })();

  // �"��"� Show/hide sub-options inside form sections �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  // Beef: show steak sub-options when rib/loin/sirloin/round/etc. choices change
  function bindRadioSubOptions(radioName, valueToShowFor, subOptionsId) {
    document.querySelectorAll(`input[name="${radioName}"]`).forEach(radio => {
      radio.addEventListener('change', () => {
        const sub = document.getElementById(subOptionsId);
        if (sub) sub.style.display = radio.value === valueToShowFor ? 'grid' : 'none';
      });
    });
  }

  // Bind sub-options that show for multiple radio values (e.g. T-Bone and KC Strip both show Thickness/Per Pack)
  function bindRadioSubOptionsMulti(radioName, showForValues, subOptionsId, displayStyle) {
    const sub = document.getElementById(subOptionsId);
    if (!sub) return;
    function update() {
      const checked = document.querySelector(`input[name="${radioName}"]:checked`);
      sub.style.display = (checked && showForValues.includes(checked.value)) ? (displayStyle || 'grid') : 'none';
    }
    document.querySelectorAll(`input[name="${radioName}"]`).forEach(r => r.addEventListener('change', update));
    update(); // initialize on load
  }

  // Loin: show Thickness + Per Pack for T-Bone (its own sub-panel)
  bindRadioSubOptionsMulti('beef-loin', ['tbone'], 'loin-tbone-sub', 'grid');
  // Loin: show Thickness + Per Pack for KC Strip (its own sub-panel)
  bindRadioSubOptionsMulti('beef-loin', ['kcfilet'], 'loin-steak-sub', 'grid');

  // Pre-show sub-options for default selected radios
  document.querySelectorAll('.sub-toggle-radio').forEach(radio => {
    radio.addEventListener('change', () => {
      const target = document.getElementById(radio.dataset.shows);
      const group  = radio.dataset.group;
      // Hide all in group
      document.querySelectorAll(`[data-group="${group}"]`).forEach(r => {
        const t = document.getElementById(r.dataset.shows);
        if (t) t.style.display = 'none';
      });
      if (target && radio.checked) target.style.display = 'grid';
    });
    // Initialize
    if (radio.checked) {
      const target = document.getElementById(radio.dataset.shows);
      if (target) target.style.display = 'grid';
    }
  });

  // Checkbox sub-option toggles (patties, organ meats)
  document.querySelectorAll('.sub-toggle-check').forEach(cb => {
    cb.addEventListener('change', () => {
      const target = document.getElementById(cb.dataset.shows);
      if (target) target.style.display = cb.checked ? 'block' : 'none';
    });
  });

  // -- Order Form Worker URL ------------------------------------------------------------------------------------------
  const ORDER_WORKER_URL = 'https://walnut-valley-order.notifications-27c.workers.dev';

  // �"��"� Contact Form (Home page / Fill Your Freezer) �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  document.querySelectorAll('.contact-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn  = form.querySelector('.btn-submit');
      const orig = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.innerHTML = '<span class="spinner"></span> Sending...'; }

      const data = {
        name:    form.querySelector('[name="name"]')?.value    || '',
        email:   form.querySelector('[name="email"]')?.value   || '',
        subject: form.querySelector('[name="subject"]')?.value || '',
        message: form.querySelector('[name="message"]')?.value || '',
      };

      try {
        // Submit via Worker (same as order form)
        const resp = await fetch(ORDER_WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!resp.ok) throw new Error('Worker error');

        // Show success state
        const success = form.nextElementSibling;
        if (success && success.classList.contains('form-success')) {
          form.style.display = 'none';
          success.style.display = 'block';
        } else {
          form.innerHTML = `<div class="success-box">
            <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <h3 class="font-chunkfive text-xl text-stone-900 mb-2">Message Sent!</h3>
            <p class="text-stone-600">Thanks for reaching out. We'll get back to you soon.</p>
          </div>`;
        }
      } catch (err) {
        if (btn) { btn.disabled = false; btn.innerHTML = orig; }
        alert('Failed to send. Please call us at (316) 321-3595 or try again.');
      }
    });
  });

  // -- Order Form Worker URL defined above contact form handler --------------

  // �"��"� Collect all radio/select/checkbox selections from a form container �"��"��"��"��"�
  // Returns true if el is inside a hidden (display:none) ancestor within boundary
  function isHidden(el, boundary) {
    let node = el.parentElement;
    while (node && node !== boundary) {
      if (node.style && node.style.display === 'none') return true;
      node = node.parentElement;
    }
    return false;
  }

  // Human-readable labels for raw field names
  const FIELD_LABELS = {
    'rib': 'Cut', 'rib thick': 'Thickness', 'rib pack': 'Per Pack', 'rib roast': 'Roast Size',
    'loin': 'Cut', 'loin thick tbone': 'Thickness', 'loin pack tbone': 'Per Pack',
    'loin thick': 'Thickness', 'loin pack': 'Per Pack',
    'sirloin': 'Cut', 'sirl thick': 'Thickness', 'sirl pack': 'Per Pack', 'sirl roast': 'Roast Size',
    'sirlointip': 'Cut', 'st thick': 'Thickness', 'st pack': 'Per Pack', 'st roast': 'Roast Size',
    'round': 'Cut', 'rnd thick': 'Thickness', 'rnd pack': 'Per Pack', 'rnd roast': 'Roast Size',
    'rnd minute pack': 'Per Pack', 'rnd tender pack': 'Per Pack',
    'rnd rump': 'Rump Roast', 'rnd pikes': 'Pikes Peak Roast',
    'chuck': 'Chuck Roast', 'arm': 'Arm Roast',
    'chk roast sz': 'Chuck Roast Size', 'arm roast sz': 'Arm Roast Size',
    'brisket': 'Cut',
    'ribs': 'Beef Ribs', 'soup': 'Soup Bones',
    'leanness': 'Leanness', 'pkg': 'Package Size',
    'patty lbs': 'Total Pounds', 'patty sz': 'Patty Size', 'patty pp': 'Per Pack', 'patties': 'Make Patties',
    'liver': 'Liver', 'heart': 'Heart', 'tongue': 'Tongue', 'none': 'No Organ Meats',
    'loin chops': 'Cut', 'loin thick': 'Thickness', 'loin pack': 'Per Pack',
    'shoulder': 'Cut', 'shldr thick': 'Thickness', 'shldr pack': 'Per Pack',
    'ribs': 'Spare Ribs', 'belly': 'Pork Belly',
    'ham': 'Ham', 'hamopt': 'Ham Cut',
    'ham center thick': 'Thickness', 'ham center pack': 'Per Pack',
    'ham thick': 'Thickness', 'ham pack': 'Per Pack',
    'ham cutlet pp': 'Per Pack',
    'grind ground': 'Ground Pork', 'ground pkg': 'Package Size',
    'grind sausage': 'Breakfast Sausage', 'sausage level': 'Spice Level', 'sausage pkg': 'Package Size',
    'also sausage level': 'Sausage Spice Level', 'also sausage pkg': 'Sausage Package Size',
    'also ground pkg': 'Ground Pork Package Size',
    'shldr thick': 'Thickness', 'shldr pack': 'Per Pack',
  };

  // Human-readable values for raw option values
  const VALUE_LABELS = {
    'ribeye': 'Ribeye Steaks', 'primerib': 'Prime Rib Roast',
    'tbone': 'T-Bone Steaks', 'kcfilet': 'KC Strip & Filet',
    'steaks': 'Steaks', 'roast': 'Roast', 'stew': 'Stew Meat', 'grind': 'Grind',
    'steak': 'Round Steak', 'tenderized': 'Tenderized Round Steak', 'minute': 'Minute Steak',
    'rump': 'Rump Roast', 'pikes': 'Pikes Peak Roast',
    'whole': 'Keep Whole', 'half': 'Cut in Half', 'halfbrisket': 'Half Brisket',
    'save': 'Save', 'cure': 'Cure (Traditional Ham)', 'fresh': 'Fresh (No Cure)',
    'cutlets': 'Cutlets', 'chops': 'Pork Chops', 'bacon': 'Cure for Bacon',
    'center': 'Center Cut', 'halfq': 'Half Brisket',
    'ground': 'Ground Pork', 'sausage': 'Breakfast Sausage',
  };

  function friendlyKey(raw) {
    const k = raw.trim().toLowerCase();
    return FIELD_LABELS[k] || k.replace(/\b\w/g, c => c.toUpperCase());
  }
  function friendlyVal(val) {
    if (val === true) return 'Yes';
    const v = String(val).trim().toLowerCase();
    return VALUE_LABELS[v] || val;
  }

  // Sections to skip entirely (contact info already shown in header)
  const SKIP_SECTIONS = ['your information', 'select quantity', 'information'];

  function collectSelections(container) {
    const sections = [];
    container.querySelectorAll('[class*="form-sect-body"], .form-sect-body').forEach(body => {
      const btn = body.previousElementSibling;
      const sectionTitle = btn ? btn.querySelector('span')?.childNodes[0]?.textContent?.trim() || btn.textContent?.trim() : 'Selection';
      const cleanTitle = sectionTitle.replace(/^\d+[a-z]?\.\s*/i, '').trim();

      // Skip contact/quantity sections
      if (SKIP_SECTIONS.some(s => cleanTitle.toLowerCase().includes(s))) return;

      const fields = {};

      // Radios -- only visible radio groups
      const radioNames = new Set([...body.querySelectorAll('input[type="radio"]')]
        .filter(r => !isHidden(r, body))
        .map(r => r.name));
      radioNames.forEach(name => {
        const checked = body.querySelector(`input[type="radio"][name="${name}"]:checked`);
        if (checked && !isHidden(checked, body)) {
          const rawKey = name.replace(/^(beef|pork)-?/,'').replace(/-/g,' ');
          fields[friendlyKey(rawKey)] = friendlyVal(checked.value);
        }
      });

      // Selects -- only visible ones
      body.querySelectorAll('select').forEach(sel => {
        if (sel.value && !isHidden(sel, body)) {
          const rawKey = sel.name.replace(/^(beef|pork)-?/,'').replace(/-/g,' ');
          fields[friendlyKey(rawKey)] = sel.value;
        }
      });

      // Text inputs -- only visible ones
      body.querySelectorAll('input[type="text"],input[type="email"],input[type="tel"]').forEach(inp => {
        if (inp.value.trim() && !isHidden(inp, body)) {
          const rawKey = inp.id.replace(/^(beef|pork)-/,'').replace(/-/g,' ');
          fields[friendlyKey(rawKey)] = inp.value.trim();
        }
      });

      // Checkboxes -- only checked and visible
      body.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
        if (!isHidden(cb, body)) {
          const rawKey = cb.id.replace(/^(beef|pork|organ|want|pgrind)-?/,'').replace(/-/g,' ');
          const label = cb.closest('.flex')?.querySelector('label')?.textContent?.trim() || friendlyKey(rawKey);
          fields[label] = true;
        }
      });

      if (Object.keys(fields).length) sections.push({ section: cleanTitle, fields });
    });
    return sections;
  }

  // �"��"� Generate PDF via jsPDF (client-side) �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  async function generateOrderPdf(animal, contact, quantity, selections) {
    // Lazily load jsPDF from CDN
    if (!window.jspdf) {
      await new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
        s.onload = resolve; s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'pt', format: 'letter' });

    // Header
    doc.setFillColor(127, 29, 29);
    doc.rect(0, 0, 612, 70, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20); doc.setFont('helvetica', 'bold');
    doc.text('WALNUT VALLEY MEAT MARKET', 306, 30, { align: 'center' });
    doc.setFontSize(13); doc.setFont('helvetica', 'normal');
    doc.text(`${animal.toUpperCase()} CUTTING ORDER - ${quantity.toUpperCase()}`, 306, 52, { align: 'center' });

    let y = 90;
    doc.setTextColor(28, 25, 23); doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Information', 40, y); y += 16;
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${contact.name || '�"'}`, 40, y); y += 14;
    doc.text(`Email: ${contact.email || '�"'}`, 40, y); y += 14;
    doc.text(`Phone: ${contact.phone || '�"'}`, 40, y); y += 14;
    doc.text(`Pickup: ${contact.pickup || '�"'}`, 40, y); y += 20;

    (selections || []).forEach(s => {
      if (y > 720) { doc.addPage(); y = 40; }
      doc.setFillColor(220, 38, 38);
      doc.rect(30, y - 12, 552, 18, 'F');
      doc.setTextColor(255,255,255); doc.setFont('helvetica','bold'); doc.setFontSize(10);
      doc.text(s.section.toUpperCase(), 40, y); y += 6;
      doc.setTextColor(28,25,23); doc.setFont('helvetica','normal'); doc.setFontSize(10);
      Object.entries(s.fields || {}).forEach(([k, v]) => {
        if (y > 720) { doc.addPage(); y = 40; }
        y += 12;
        doc.text(`${k}: ${v === true ? 'Yes' : v}`, 50, y);
      });
      y += 14;
    });

    // Footer
    doc.setFontSize(9); doc.setTextColor(120,113,108);
    doc.text(`Generated ${new Date().toLocaleString()} · walnut-valley-meat-market.pages.dev`, 306, 760, { align: 'center' });

    return doc.output('datauristring').replace('data:application/pdf;filename=generated.pdf;base64,','').replace('data:application/pdf;base64,','');
  }

  // �"��"� Show thank-you overlay �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  function showThankYou(redirectUrl) {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:999;display:flex;align-items:center;justify-content:center;padding:1rem;';
    overlay.innerHTML = `<div style="background:#fff;border-radius:1rem;max-width:420px;width:100%;padding:2rem;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,0.3);">
      <div style="font-size:3rem;margin-bottom:1rem;">&#x1F389;</div>
      <h2 style="font-size:1.5rem;font-weight:900;color:#1c1917;margin:0 0 0.75rem;">Order Received!</h2>
      <p style="font-size:0.95rem;color:#57534e;margin:0 0 1.5rem;line-height:1.6;">Thanks! We've got your cutting order. You'll be redirected to pay your deposit now to lock in your spot.</p>
      ${redirectUrl ? `<a href="${redirectUrl}" style="display:inline-block;background:#dc2626;color:#fff;font-weight:700;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:1rem;">Pay Deposit Now &#x2192;</a>` : '<p style="color:#dc2626;font-weight:700;">We\'ll be in touch shortly to arrange your deposit.</p>'}
    </div>`;
    document.body.appendChild(overlay);
    if (redirectUrl) setTimeout(() => { window.location.href = redirectUrl; }, 3500);
  }

  // �"��"� Beef Cutting Order Submit �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const beefSubmitBtn = document.getElementById('beef-submit-btn');
  if (beefSubmitBtn) {
    beefSubmitBtn.addEventListener('click', async () => {
      const form = document.getElementById('beef-form');
      if (!form) return;

      let hasError = false;
      ['#beef-fullName','#beef-email','#beef-phone'].forEach(sel => {
        const el = form.querySelector(sel);
        if (el && !el.value.trim()) { el.classList.add('error'); hasError = true; }
        else if (el) el.classList.remove('error');
      });
      const pickup = form.querySelector('#beef-pickup');
      if (pickup && !pickup.value) { pickup.classList.add('error'); hasError = true; }
      else if (pickup) pickup.classList.remove('error');

      if (hasError) {
        const firstErr = form.querySelector('.error');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      beefSubmitBtn.disabled = true;
      beefSubmitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

      const contact = {
        name:   form.querySelector('#beef-fullName')?.value?.trim(),
        email:  form.querySelector('#beef-email')?.value?.trim(),
        phone:  form.querySelector('#beef-phone')?.value?.trim(),
        pickup: form.querySelector('#beef-pickup')?.value,
      };
      const quantity   = beefQty || 'half';
      const selections = collectSelections(form);
      const depositMap = { whole: '$1,200', half: '$600', quarter: '$300' };
      const deposit    = depositMap[quantity] || '';

      let pdfBase64 = null;
      try { pdfBase64 = await generateOrderPdf('beef', contact, quantity, selections); } catch(e) { console.warn('PDF gen failed:', e); }

      const payload = { animal: 'beef', quantity, contact, selections, deposit, pdfBase64 };

      try {
        const res = await fetch(ORDER_WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        showThankYou(data.redirectUrl || null);
      } catch(e) {
        console.error('Order submission error:', e);
        // Still show thank-you and redirect even if worker call fails
        const fallbackUrls = { whole: 'http://pay.smrtpayments.com/wvp/beef-whole', half: 'http://pay.smrtpayments.com/wvp/beef-half', quarter: 'http://pay.smrtpayments.com/wvp/beef-quarter' };
        showThankYou(fallbackUrls[quantity]);
      }
    });
  }

  // �"��"� Pork Cutting Order Submit �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const porkSubmitBtn = document.getElementById('pork-submit-btn');
  if (porkSubmitBtn) {
    porkSubmitBtn.addEventListener('click', async () => {
      const form = document.getElementById('pork-form');
      if (!form) return;

      let hasError = false;
      ['#pork-fullName','#pork-email','#pork-phone'].forEach(sel => {
        const el = form.querySelector(sel);
        if (el && !el.value.trim()) { el.classList.add('error'); hasError = true; }
        else if (el) el.classList.remove('error');
      });
      const pickup = form.querySelector('#pork-pickup');
      if (pickup && !pickup.value) { pickup.classList.add('error'); hasError = true; }
      else if (pickup) pickup.classList.remove('error');

      if (hasError) {
        const firstErr = form.querySelector('.error');
        if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      porkSubmitBtn.disabled = true;
      porkSubmitBtn.innerHTML = '<span class="spinner"></span> Submitting...';

      const contact = {
        name:   form.querySelector('#pork-fullName')?.value?.trim(),
        email:  form.querySelector('#pork-email')?.value?.trim(),
        phone:  form.querySelector('#pork-phone')?.value?.trim(),
        pickup: form.querySelector('#pork-pickup')?.value,
      };
      const quantity   = porkQty || 'half';
      const selections = collectSelections(form);
      const depositMap = { whole: '$400', half: '$100' };
      const deposit    = depositMap[quantity] || '';

      let pdfBase64 = null;
      try { pdfBase64 = await generateOrderPdf('pork', contact, quantity, selections); } catch(e) { console.warn('PDF gen failed:', e); }

      const payload = { animal: 'pork', quantity, contact, selections, deposit, pdfBase64 };

      try {
        const res = await fetch(ORDER_WORKER_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        showThankYou(data.redirectUrl || null);
      } catch(e) {
        console.error('Order submission error:', e);
        const fallbackUrls = { whole: 'http://pay.smrtpayments.com/wvp/hog-whole', half: 'http://pay.smrtpayments.com/wvp/hog-half' };
        showThankYou(fallbackUrls[quantity]);
      }
    });
  }

  // -- Help Modal (popup on "Help me with this step" click) ------------------
  const helpModal      = document.getElementById('help-modal');
  const helpModalTitle = document.getElementById('help-modal-title');
  const helpModalBody  = document.getElementById('help-modal-body');
  const helpModalClose = document.getElementById('help-modal-close');

  function openHelpModal(title, defs, tip) {
    if (!helpModal) return;
    if (helpModalTitle) helpModalTitle.textContent = title;
    if (helpModalBody) {
      helpModalBody.innerHTML =
        defs.map(d => `
          <div style="border:1px solid #e7e5e4;border-radius:.625rem;padding:1rem 1.25rem;margin-bottom:.75rem;background:#fff;">
            <div style="font-weight:700;font-size:.95rem;color:#1c1917;margin-bottom:.25rem;">${d.term}</div>
            <div style="font-size:.875rem;color:#57534e;line-height:1.5;">${d.description}</div>
          </div>
        `).join('') +
        (tip ? `
          <div style="background:#eff6ff;border-radius:.5rem;padding:.75rem 1rem;display:flex;align-items:flex-start;gap:.5rem;margin-top:.25rem;">
            <svg style="width:1rem;height:1rem;flex-shrink:0;margin-top:.1rem;color:#2563eb;fill:none;stroke:currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20A10 10 0 0012 2z"/></svg>
            <span style="font-size:.875rem;color:#1d4ed8;line-height:1.5;">${tip}</span>
          </div>
        ` : '');
    }
    helpModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeHelpModal() {
    if (helpModal) helpModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (helpModalClose) helpModalClose.addEventListener('click', closeHelpModal);
  if (helpModal) helpModal.addEventListener('click', (e) => { if (e.target === helpModal) closeHelpModal(); });

  document.querySelectorAll('.help-btn[data-definitions]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      try {
        const defs  = JSON.parse(btn.dataset.definitions);
        const tip   = btn.dataset.tip || '';
        const title = btn.dataset.title || 'Help';
        openHelpModal(title, defs, tip);
      } catch(err) { console.error(err); }
    });
  });

  // �"��"� Smooth scroll for logo "back to top" �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  const logoLink = document.getElementById('logo-link');
  if (logoLink && currentPage === 'home') {
    logoLink.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // �"��"� Scroll Animations (IntersectionObserver) �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
  // Match the framer-motion patterns from the React source:
  //   - Section headings: fade up (y: 20 �' 0)
  //   - Location cards: fade up with stagger delay
  //   - Product gallery cards: fade up with stagger delay
  //   - About left column: slide in from left (x: -30 �' 0)
  //   - About right column: slide in from right (x: 30 �' 0)
  //   - Reviews heading: fade up
  //   - Bundle cards: fade up with stagger

  function initScrollAnimations() {
    // Use a single observer for performance
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('anim-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    // �"��"� Section heading containers (fade-up) �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
    // Highlights, bundles, locations, products, reviews headings
    const headingSelectors = [
      '#locations .text-center',
      '#products .text-center',
      '#about h2',
      '.py-12.bg-gradient-to-b .text-center', // reviews heading
    ];
    headingSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.dataset.animInit) {
          el.classList.add('anim-fade-up');
          el.dataset.animInit = '1';
          observer.observe(el);
        }
      });
    });

    // �"��"� Highlights section icons �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
    document.querySelectorAll('.py-12.bg-white .grid.grid-cols-2 > div').forEach((el, i) => {
      if (!el.dataset.animInit) {
        el.classList.add('anim-fade-up');
        el.style.transitionDelay = (i * 80) + 'ms';
        el.dataset.animInit = '1';
        observer.observe(el);
      }
    });

    // �"��"� Location cards (stagger) �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
    document.querySelectorAll('#locations .grid > div').forEach((el, i) => {
      if (!el.dataset.animInit) {
        el.classList.add('anim-fade-up');
        el.style.transitionDelay = (i * 150) + 'ms';
        el.dataset.animInit = '1';
        observer.observe(el);
      }
    });

    // �"��"� Product gallery cards (stagger) �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
    document.querySelectorAll('#products .grid > div').forEach((el, i) => {
      if (!el.dataset.animInit) {
        el.classList.add('anim-fade-up');
        el.style.transitionDelay = (i * 80) + 'ms';
        el.dataset.animInit = '1';
        observer.observe(el);
      }
    });

    // �"��"� Bundle cards �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
    document.querySelectorAll('#bundles .grid > div').forEach((el, i) => {
      if (!el.dataset.animInit) {
        el.classList.add('anim-fade-up');
        el.style.transitionDelay = (i * 100) + 'ms';
        el.dataset.animInit = '1';
        observer.observe(el);
      }
    });

    // �"��"� About: left column slides in from left �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
    const aboutGrid = document.querySelector('#about .grid');
    if (aboutGrid) {
      const cols = aboutGrid.children;
      if (cols[0] && !cols[0].dataset.animInit) {
        cols[0].classList.add('anim-slide-left');
        cols[0].dataset.animInit = '1';
        observer.observe(cols[0]);
      }
      if (cols[1] && !cols[1].dataset.animInit) {
        cols[1].classList.add('anim-slide-right');
        cols[1].dataset.animInit = '1';
        observer.observe(cols[1]);
      }
    }

    // �"��"� Map section �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
    document.querySelectorAll('.bg-amber-50 .grid > div').forEach((el, i) => {
      if (!el.dataset.animInit) {
        el.classList.add('anim-fade-up');
        el.style.transitionDelay = (i * 150) + 'ms';
        el.dataset.animInit = '1';
        observer.observe(el);
      }
    });

    // �"��"� Reviews card �"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"��"�
    const reviewCard = document.querySelector('.bg-white.rounded-3xl.shadow-xl');
    if (reviewCard && !reviewCard.dataset.animInit) {
      reviewCard.classList.add('anim-fade-up');
      reviewCard.dataset.animInit = '1';
      observer.observe(reviewCard);
    }
  }

  // Run animations on home + fill-your-freezer pages
  if (currentPage === 'home' || currentPage === 'freezer') {
    // Small delay to let Tailwind finish painting
    requestAnimationFrame(() => setTimeout(initScrollAnimations, 50));
  }

});
