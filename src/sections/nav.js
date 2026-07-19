// ── §4.1 + §5.1 — Sticky nav ──────────────────────────────────────────
// Transparent-over-parchment bar. Scrolled state class (.is-scrolled) is
// toggled by sections/global.js on [data-nav]; this module owns the rest:
// smooth-scroll links, magnetic CTA, hide-on-scroll (never while a pin is
// active), active-link gold underline, night-mode swap, and the mobile
// burger + full-screen parchment overlay.
import '../styles/sections/nav.css';
import { btn, magnetic, vespaSVG, scrollToId } from '../lib/ui.js';

export const id = 'nav';

const LINKS = [
  ['The Story', '#story'],
  ['Menu', '#menu'],
  ['The Film', '#video'],
  ['Gallery', '#gallery'],
  ['Visit', '#visit'],
];

// The real Hudson's "h" seal. Dark variant on light nav, light variant when
// the nav swaps to night mode (over the Visit/Footer sections).
function seal() {
  return `<span class="nav__seal" aria-hidden="true">
    <img class="nav__seal-img nav__seal-img--dark" src="images/logo-h-dark.png" alt="" width="40" height="40" />
    <img class="nav__seal-img nav__seal-img--light" src="images/logo-h-light.png" alt="" width="40" height="40" />
  </span>`;
}

export function render() {
  const links = LINKS.map(
    ([label, href]) => `<li><a class="nav__link" data-link href="${href}">${label}</a></li>`
  ).join('');
  const olinks = LINKS.map(
    ([label, href]) => `<li><a class="nav__olink" data-link href="${href}">${label}</a></li>`
  ).join('');

  return `
  <nav id="nav" class="nav" data-nav aria-label="Primary">
    <div class="nav__inner wrap">
      <a class="nav__brand" href="#hero" data-link aria-label="Hudson's Deli — home">
        ${seal()}
        <span class="nav__wordmark">Hudson's Deli</span>
      </a>
      <ul class="nav__links">
        ${links}
        <span class="nav__underline" aria-hidden="true"></span>
      </ul>
      <div class="nav__cta">${btn('Find Us', { href: '#visit', variant: 'primary', magnetic: true, arrow: true })}</div>
      <button class="nav__burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-overlay">
        <span></span><span></span>
      </button>
    </div>
    <div class="nav__overlay" id="nav-overlay" aria-hidden="true">
      <ul class="nav__overlay-links">${olinks}</ul>
      <div class="nav__overlay-foot">
        <p class="nav__overlay-hours">Tuesday&nbsp;–&nbsp;Sunday · 11am&nbsp;–&nbsp;6pm<br>Closed Monday</p>
        <a class="nav__overlay-phone" href="tel:+60162138344">016-213&nbsp;8344</a>
      </div>
      ${vespaSVG({ className: 'nav__overlay-vespa', width: 108 })}
    </div>
  </nav>`;
}

export function init(ctx) {
  const { gsap, ScrollTrigger, lenis, reduce } = ctx;
  const nav = document.getElementById('nav');
  if (!nav) return;

  const inner = nav.querySelector('.nav__inner');
  const links = Array.from(nav.querySelectorAll('.nav__links .nav__link'));
  const underline = nav.querySelector('.nav__underline');
  const linksWrap = nav.querySelector('.nav__links');
  const burger = nav.querySelector('.nav__burger');
  const overlay = nav.querySelector('.nav__overlay');
  const cta = nav.querySelector('.nav__cta .btn');

  // ── Smooth-scroll for every in-page anchor ──────────────────────────
  nav.querySelectorAll('a[data-link]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        closeMenu();
        scrollToId(lenis, href);
      }
    });
  });

  // ── Magnetic CTA ────────────────────────────────────────────────────
  if (cta) magnetic(cta, ctx);

  // ── Mobile overlay ──────────────────────────────────────────────────
  let open = false;
  function openMenu() {
    open = true;
    nav.classList.add('nav--open');
    overlay.setAttribute('aria-hidden', 'false');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Close menu');
    showNav();
  }
  function closeMenu() {
    if (!open) return;
    open = false;
    nav.classList.remove('nav--open');
    overlay.setAttribute('aria-hidden', 'true');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Open menu');
  }
  burger?.addEventListener('click', () => (open ? closeMenu() : openMenu()));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  // ── Page-load choreography (§5.0 step 1) ────────────────────────────
  if (!reduce) {
    const sealEl = nav.querySelector('.nav__seal');
    const intro = [...links, cta].filter(Boolean);
    const tl = gsap.timeline({ delay: 0.05 });
    if (sealEl) tl.from(sealEl, { scale: 0.6, autoAlpha: 0, duration: 0.5, ease: 'back.out(2)', transformOrigin: '50% 50%' }, 0);
    tl.from(nav.querySelector('.nav__wordmark'), { autoAlpha: 0, x: -8, duration: 0.4, ease: 'power3.out' }, 0.05);
    if (intro.length) tl.from(intro, { y: -12, autoAlpha: 0, duration: 0.4, ease: 'power3.out', stagger: 0.05 }, 0.1);
  }

  // ── Active-link gold underline (slides between links) ───────────────
  let activeId = null;
  function moveUnderline(link) {
    if (!link || !underline || !linksWrap) return;
    const lr = link.getBoundingClientRect();
    const wr = linksWrap.getBoundingClientRect();
    gsap.to(underline, {
      x: lr.left - wr.left,
      width: lr.width,
      autoAlpha: 1,
      duration: reduce ? 0 : 0.35,
      ease: 'power3.inOut',
      overwrite: true,
    });
  }
  function clearUnderline() {
    if (underline) gsap.to(underline, { autoAlpha: 0, duration: 0.3, overwrite: true });
  }
  function setActive(sectionId) {
    activeId = sectionId;
    let match = null;
    links.forEach((a) => {
      const on = a.getAttribute('href') === '#' + sectionId;
      a.classList.toggle('is-active', on);
      if (on) match = a;
    });
    if (match) moveUnderline(match);
    else clearUnderline();
  }

  const hero = document.getElementById('hero');
  if (hero) {
    ScrollTrigger.create({
      trigger: hero, start: 'top center', end: 'bottom center',
      onToggle: (self) => { if (self.isActive) setActive(null); },
    });
  }
  ['story', 'menu', 'video', 'gallery', 'visit'].forEach((sectionId) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    ScrollTrigger.create({
      trigger: el, start: 'top center', end: 'bottom center',
      onToggle: (self) => { if (self.isActive) setActive(sectionId); },
    });
  });
  // re-measure the underline when layout changes
  window.addEventListener('resize', () => {
    if (!activeId) return;
    const match = links.find((a) => a.getAttribute('href') === '#' + activeId);
    if (match) moveUnderline(match);
  });

  // ── Night-mode swap (§5.1) — keyed to Visit, held through Footer ─────
  const visit = document.getElementById('visit');
  if (visit) {
    ScrollTrigger.create({
      trigger: visit,
      start: 'top 64',
      endTrigger: document.getElementById('footer') || visit,
      end: 'bottom bottom',
      onToggle: (self) => nav.classList.toggle('nav--night', self.isActive),
    });
  }

  // ── Hide-on-scroll (§5.1). Never while any pin is active; ≥768px only ─
  if (!reduce) {
    let hidden = false;
    const canHide = () => window.matchMedia('(min-width: 768px)').matches;
    const showNavFn = () => { if (!hidden) return; hidden = false; gsap.to(inner, { yPercent: 0, duration: 0.4, ease: 'power3.out' }); };
    const hideNavFn = () => { if (hidden) return; hidden = true; gsap.to(inner, { yPercent: -110, duration: 0.4, ease: 'power3.out' }); };
    // expose show for openMenu()
    showNav = showNavFn;
    lenis.on('scroll', () => {
      if (open) { showNavFn(); return; }
      const pinActive = ScrollTrigger.getAll().some((t) => t.pin && t.isActive);
      if (pinActive || !canHide() || lenis.scroll < 400) { showNavFn(); return; }
      if (lenis.direction === 1) hideNavFn();
      else if (lenis.direction === -1) showNavFn();
    });
  }

  // fallback no-op so openMenu() can call it before the handler assigns
  function showNav() {}
}
