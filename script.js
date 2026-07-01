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
  const frame = $('#modalFrame');
  const title = $('#modalTitle');
  const closeBtn = $('#closeModal');

  if(!modal || !frame || !title || !closeBtn) return;

  const links = {
    'fp-privacy': { url: './privacy-policy.html', text: 'سياسة الخصوصية' },
    'fp-terms': { url: './terms.html', text: 'شروط الاستخدام' },
    'fp-disclaimer': { url: './disclaimer.html', text: 'إخلاء المسؤولية' }
  };

  // Inject style when iframe loads to make it look premium and match site theme
  frame.addEventListener('load', () => {
    try {
      const doc = frame.contentDocument || frame.contentWindow.document;
      if (!doc) return;

      // Prevent duplicate injection
      if (doc.getElementById('modal-custom-style')) return;

      const style = doc.createElement('style');
      style.id = 'modal-custom-style';
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap');

        body {
          font-family: 'Cairo', system-ui, -apple-system, sans-serif !important;
          background-color: #f8fafc !important;
          color: #334155 !important;
          padding: 24px !important;
          margin: 0 !important;
          direction: rtl !important;
          line-height: 1.8 !important;
        }

        /* Hide full page layouts */
        nav, header, footer {
          display: none !important;
        }

        /* Customize Hero section */
        .hero {
          background: linear-gradient(135deg, #115e54 0%, #1d8478 100%) !important;
          color: #ffffff !important;
          padding: 30px 20px !important;
          text-align: center !important;
          border-radius: 20px !important;
          margin-bottom: 24px !important;
          box-shadow: 0 10px 25px -5px rgba(29, 132, 120, 0.1) !important;
          border: none !important;
        }

        .hero-icon {
          font-size: 2.5rem !important;
          margin-bottom: 8px !important;
          display: block !important;
        }

        .hero h1 {
          margin: 0 !important;
          font-size: 1.5rem !important;
          font-weight: 800 !important;
          color: #ffffff !important;
        }

        .hero p {
          margin: 6px 0 0 !important;
          font-size: 0.9rem !important;
          opacity: 0.9 !important;
          color: rgba(255, 255, 255, 0.9) !important;
        }

        /* Container & Grid layout */
        .container {
          max-width: 100% !important;
          width: 100% !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .updated-badge {
          display: inline-block !important;
          padding: 6px 14px !important;
          border-radius: 99px !important;
          color: #ffffff !important;
          font-size: 0.8rem !important;
          font-weight: 600 !important;
          margin-bottom: 20px !important;
          background-color: #1d8478 !important;
        }

        /* Cards customization */
        .card {
          background: #ffffff !important;
          border-radius: 16px !important;
          padding: 24px !important;
          margin-bottom: 20px !important;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.02) !important;
          border: 1px solid rgba(226, 232, 240, 0.8) !important;
        }

        .card-title {
          font-size: 1.15rem !important;
          font-weight: 700 !important;
          color: #0f172a !important;
          margin-bottom: 12px !important;
          border-bottom: 2px solid rgba(29, 132, 120, 0.08) !important;
          padding-bottom: 8px !important;
        }

        ul {
          padding-right: 20px !important;
          margin: 12px 0 0 !important;
        }

        li {
          margin-bottom: 8px !important;
          color: #475569 !important;
        }

        strong {
          color: #0f172a !important;
        }

        a {
          color: #1d8478 !important;
          text-decoration: none !important;
          font-weight: 600 !important;
        }

        a:hover {
          text-decoration: underline !important;
        }

        .warning-card {
          border-right: 4px solid #f59e0b !important;
        }
      `;
      doc.head.appendChild(style);
    } catch (err) {
      console.warn("Could not customize iframe style due to origin restrictions:", err);
    }
  });

  Object.keys(links).forEach(id => {
    const el = $('#' + id);
    if(el) {
      el.addEventListener('click', e => {
        e.preventDefault();
        title.textContent = links[id].text;
        frame.src = links[id].url;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
      });
    }
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => frame.src = '', 300); // Clear iframe after animation
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if(e.target === modal) closeModal();
  });
})();
