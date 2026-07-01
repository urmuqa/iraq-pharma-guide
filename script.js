'use strict';
/* ================================================================
   Iraq Pharma Guide — Mobile-First JavaScript
   Features: sticky header, menu, scroll reveal, counters,
             feat dots, testi swipe+dots, scroll-to-top, sticky bar
   ================================================================ */

const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

/* 1. HEADER SCROLL */
(function(){
  const h = $('#header');
  if(!h) return;
  const fn = () => h.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', fn, {passive:true});
  fn();
})();

/* 2. MENU TOGGLE */
(function(){
  const btn = $('#menuBtn');
  const nav = $('#dropMenu');
  if(!btn || !nav) return;

  const close = () => {
    btn.classList.remove('open');
    nav.classList.remove('open');
    btn.setAttribute('aria-expanded','false');
    document.body.style.overflow = '';
  };
  const open = () => {
    btn.classList.add('open');
    nav.classList.add('open');
    btn.setAttribute('aria-expanded','true');
    document.body.style.overflow = 'hidden';
  };

  btn.addEventListener('click', () =>
    btn.classList.contains('open') ? close() : open()
  );

  $$('.drop-link').forEach(a => a.addEventListener('click', close));
  document.addEventListener('click', e => {
    if(!btn.contains(e.target) && !nav.contains(e.target)) close();
  });
  document.addEventListener('keydown', e => e.key==='Escape' && close());
})();

/* 3. SCROLL REVEAL */
(function(){
  const items = $$('.reveal');
  if(!items.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(e.isIntersecting){ e.target.classList.add('visible'); obs.unobserve(e.target); }
    });
  }, {threshold:0.1, rootMargin:'0px 0px -30px 0px'});
  items.forEach(el => obs.observe(el));
})();

/* 4. ANIMATED COUNTERS */
(function(){
  const els = $$('[data-count]');
  if(!els.length) return;
  const easeOut = t => 1 - Math.pow(1-t, 3);
  const run = el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1600; let start = null;
    const step = ts => {
      if(!start) start = ts;
      const p = Math.min((ts-start)/dur, 1);
      const v = easeOut(p)*target;
      el.textContent = (target%1===0 ? Math.round(v).toLocaleString('ar-IQ') : v.toFixed(1)) + suffix;
      if(p<1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ run(e.target); obs.unobserve(e.target); } });
  }, {threshold:0.5});
  els.forEach(el => obs.observe(el));
})();

/* 5. FEATURES TRACK DOTS */
(function(){
  const track = $('#featTrack');
  const dots = $$('.fdot');
  if(!track || !dots.length) return;
  const cards = $$('.feat-card', track);
  if(!cards.length) return;

  track.addEventListener('scroll', () => {
    const idx = Math.round(track.scrollLeft / (cards[0].offsetWidth + 14));
    dots.forEach((d,i) => d.classList.toggle('active', i===idx));
  }, {passive:true});
})();

/* 6. TESTIMONIALS SWIPE + DOTS */
(function(){
  const slider = $('#testiSlider');
  const dots = $$('.tdot');
  if(!slider || !dots.length) return;

  // Update active dot on scroll
  const updateDot = () => {
    const cards = $$('.testi-card', slider);
    if(!cards.length) return;
    const idx = Math.round(slider.scrollLeft / (cards[0].offsetWidth + 14));
    dots.forEach((d,i) => d.classList.toggle('active', i===idx));
  };
  slider.addEventListener('scroll', updateDot, {passive:true});

  // Click dot to scroll
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const i = parseInt(dot.dataset.i);
      const cards = $$('.testi-card', slider);
      if(!cards[i]) return;
      slider.scrollTo({left: cards[i].offsetLeft - 20, behavior:'smooth'});
    });
  });

  // Touch swipe support
  let startX = 0, scrollStart = 0;
  slider.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    scrollStart = slider.scrollLeft;
  }, {passive:true});
  slider.addEventListener('touchmove', e => {
    const dx = startX - e.touches[0].clientX;
    slider.scrollLeft = scrollStart + dx;
  }, {passive:true});
})();

/* 7. STICKY BAR — hide when download section is visible */
(function(){
  const bar = $('#stickyBar');
  const dl = $('#download');
  if(!bar || !dl) return;
  const obs = new IntersectionObserver(entries => {
    bar.classList.toggle('hide', entries[0].isIntersecting);
  }, {threshold:0.3});
  obs.observe(dl);
})();

/* 8. SCROLL TO TOP */
(function(){
  const btn = $('#scrollTop');
  if(!btn) return;
  window.addEventListener('scroll', () =>
    btn.classList.toggle('visible', window.scrollY > 500), {passive:true}
  );
  btn.addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));
})();

/* 9. YEAR */
(function(){
  const el = $('#yr');
  if(el) el.textContent = new Date().getFullYear();
})();

/* 10. SMOOTH SCROLL for anchor links */
(function(){
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = $(a.getAttribute('href'));
      if(!t) return;
      e.preventDefault();
      const hh = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--hh')) || 58;
      window.scrollTo({top: t.getBoundingClientRect().top + window.scrollY - hh, behavior:'smooth'});
    });
  });
})();

/* 11. LEGAL MODAL */
(function(){
  const modal = $('#legalModal');
  const content = $('#modalContent');
  const title = $('#modalTitle');
  const closeBtn = $('#closeModal');

  if(!modal || !content || !title || !closeBtn) return;

  const links = {
    'fp-privacy': { templateId: '#privacyContent', text: 'سياسة الخصوصية' },
    'fp-terms': { templateId: '#termsContent', text: 'شروط الاستخدام' },
    'fp-disclaimer': { templateId: '#disclaimerContent', text: 'إخلاء المسؤولية' }
  };

  Object.keys(links).forEach(id => {
    const el = $('#' + id);
    if(el) {
      el.addEventListener('click', e => {
        e.preventDefault();
        title.textContent = links[id].text;
        const template = $(links[id].templateId);
        if(template) {
          content.innerHTML = template.innerHTML;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => content.innerHTML = '', 300);
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if(e.target === modal) closeModal();
  });
})();

