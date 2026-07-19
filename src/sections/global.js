// Global chrome shared across the page: preloader, custom cursor, film-grain
// overlay, and nav scroll-state. Baseline implementation — the core author
// (Opus) may enrich the preloader reveal + cursor behaviour per design.md.
import '../styles/sections/global.css';

export function initGlobal(ctx) {
  const { gsap, reduce } = ctx;

  // ── Film grain + vignette overlay ──────────────────────────────────
  const grain = document.createElement('div');
  grain.className = 'fx-grain';
  document.body.appendChild(grain);

  // Custom cursor removed — the site uses the native system cursor.

  // ── Nav scroll-state (adds .is-scrolled once past hero-ish) ─────────
  const nav = document.querySelector('[data-nav]');
  if (nav) {
    ctx.ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: (self) => nav.classList.toggle('is-scrolled', self.scroll() > 80),
      onToggle: (self) => nav.classList.toggle('is-scrolled', self.isActive),
    });
  }

  // ── Preloader reveal ───────────────────────────────────────────────
  const pre = document.querySelector('.preloader');
  if (pre && !reduce) {
    gsap.to(pre, {
      autoAlpha: 0,
      duration: 0.6,
      delay: 0.25,
      ease: 'power2.out',
      onComplete: () => pre.remove(),
    });
  } else if (pre) {
    pre.remove();
  }
}
