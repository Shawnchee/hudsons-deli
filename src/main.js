// ── Hudson's Deli — entry / orchestrator ──────────────────────────────
// This file is the render + init contract. Section authors DO NOT edit this
// file. Each section is a self-contained ES module in src/sections/ that
// exports:
//     export const id = 'hero';
//     export function render() { return `<section id="hero" ...>…</section>`; }
//     export function init(ctx) { /* ctx = { gsap, ScrollTrigger, lenis, reduce } */ }
// render() returns an HTML string; init(ctx) wires GSAP animations after the
// markup is in the DOM, fonts are ready, and smooth scroll is live.
// Each section also imports its own CSS at the top of its module.

import './styles/tokens.css';
import './styles/base.css';
import './styles/components.css';

import { createScroll } from './lib/scroll.js';
import { initGlobal } from './sections/global.js';

// Order here == order on the page (design.md §4). Agents fill in these modules.
import * as nav from './sections/nav.js';
import * as hero from './sections/hero.js';
import * as marquee from './sections/marquee.js';
import * as story from './sections/story.js';
import * as menu from './sections/menu.js';
import * as poster from './sections/poster.js';
import * as video from './sections/video.js';
import * as gallery from './sections/gallery.js';
import * as visit from './sections/visit.js';
import * as footer from './sections/footer.js';

const sections = [nav, hero, marquee, story, menu, poster, video, gallery, visit, footer];

const app = document.getElementById('app');

// 1) Render all markup up-front (so ScrollTrigger measures a stable layout).
app.innerHTML = sections.map((s) => (s.render ? s.render() : '')).join('\n');

// 2) Wait for fonts so text-split measurements are correct, then boot.
async function boot() {
  try {
    if (document.fonts && document.fonts.ready) await document.fonts.ready;
  } catch (_) {}

  const ctx = createScroll();

  // Global bits: preloader, custom cursor, film grain, nav scroll state.
  initGlobal(ctx);

  // Init each section's animations.
  for (const s of sections) {
    try {
      if (s.init) s.init(ctx);
    } catch (err) {
      console.error(`[section:${s.id || '?'}] init failed`, err);
    }
  }

  // Final measure once everything is wired.
  requestAnimationFrame(() => ctx.ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
