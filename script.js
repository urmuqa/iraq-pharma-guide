/* ================================================================
   Iraq Pharma Guide — JavaScript
   Handles: sticky header, mobile nav, scroll reveal, counter anim,
            scroll-to-top, smooth nav, active link highlight
   ================================================================ */

'use strict';

/* ── DOM Helpers ── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ══════════════════════════════════
   1. STICKY HEADER — adds .scrolled class on scroll
══════════════════════════════════ */
(function initStickyHeader() {
  const header = $('#header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load
})();

/* ══════════════════════════════════
   2. MOBILE NAV — hamburger toggle
══════════════════════════════════ */
(function initMobileNav() {
  const hamburger = $('#hamburger');
  const mobileNav = $('#mobileNav');
  if (!hamburger || !mobileNav) return;

  const toggle = (force) => {
    const open = force !== undefined ? force : !hamburger.classList.contains('open');
    hamburger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  hamburger.addEventListener('click', () => toggle());

  // Close on nav link click
  $$('a', mobileNav).forEach(a => {
    a.addEventListener('click', () => toggle(false));
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
      toggle(false);
    }
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle(false);
  });
})();

/* ══════════════════════════════════
   3. SCROLL REVEAL — Intersection Observer
══════════════════════════════════ */
(function initScrollReveal() {
  const items = $$('.reveal');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  items.forEach(item => observer.observe(item));
})();

/* ══════════════════════════════════
   4. ANIMATED COUNTERS — triggers when .trust section enters view
══════════════════════════════════ */
(function initCounters() {
  const counters = $$('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target   = parseFloat(el.dataset.count);
    const suffix   = el.dataset.suffix || '';
    const prefix   = el.dataset.prefix || '';
    const duration = 1800; // ms
    let startTime  = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed  = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const value    = easeOut(progress) * target;

      const display = target % 1 === 0
        ? Math.round(value).toLocaleString('ar-IQ')
        : value.toFixed(1);

      el.textContent = prefix + display + suffix;

      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
})();

/* ══════════════════════════════════
   5. SCROLL TO TOP BUTTON
══════════════════════════════════ */
(function initScrollTop() {
  const btn = $('#scrollTop');
  if (!btn) return;

  const toggle = () => btn.classList.toggle('visible', window.scrollY > 400);
  window.addEventListener('scroll', toggle, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ══════════════════════════════════
   6. ACTIVE NAV LINK HIGHLIGHT on scroll
══════════════════════════════════ */
(function initActiveNav() {
  const sections = $$('section[id]');
  const navLinks = $$('#header .nav-links a[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('active'));
          const activeLink = navLinks.find(a => a.getAttribute('href') === `#${entry.target.id}`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(sec => observer.observe(sec));
})();

/* ══════════════════════════════════
   7. SMOOTH SCROLL for anchor links
══════════════════════════════════ */
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = $(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--header-h')) || 70;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* ══════════════════════════════════
   8. YEAR — inject current year into footer copyright
══════════════════════════════════ */
(function injectYear() {
  const el = $('#currentYear');
  if (el) el.textContent = new Date().getFullYear();
})();
