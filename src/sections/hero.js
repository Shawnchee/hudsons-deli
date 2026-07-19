// ── §4.2 + §5.0 + §5.2 — Hero "the counter" ───────────────────────────
// Full page-load choreography (eyebrow rule, 3-line H1 reveal with REUBEN
// over-ink crossfade, image clip-reveal + counter-scale, script write-on,
// starburst pop, rotating badge, scroll cue) then scrubbed scroll parallax,
// subtle desktop mouse parallax, and badge spin driven by Lenis velocity.
import '../styles/sections/hero.css';
import { revealLines, magnetic, rotatingBadge, starburst, btn } from '../lib/ui.js';

export const id = 'hero';

export function render() {
  return `
  <section id="hero" class="hero">
    <div class="hero__inner">
      <div class="hero__type">
        <p class="hero__eyebrow">
          <span class="hero__rule" aria-hidden="true"></span>
          <span class="hero__eyebrow-text">The Neighbourhood Deli · Tanjung Bungah, Penang</span>
        </p>
        <h1 class="hero__h1">Home of<br>The Best <span class="hero__reuben">Reuben</span><br>in Malaysia</h1>
        <span class="hero__script" aria-hidden="true">Good Food, Good Mood</span>
        <p class="hero__sub">Austrian-run. Hand-sliced. Pressed to order since 2019.</p>
        <div class="hero__cta">
          ${btn('See the Menu', { href: '#menu', variant: 'primary', magnetic: true })}
          ${btn('Find Us', { href: '#visit', variant: 'secondary', arrow: true })}
        </div>
        ${starburst({ size: 46, className: 'hero__burst hero__burst--tr' })}
        ${starburst({ size: 34, className: 'hero__burst hero__burst--bl' })}
      </div>
      <div class="hero__panel">
        <div class="hero__frame">
          <div class="hero__imgscale">
            <img class="hero__img photo" src="images/hero-charcuterie.jpg"
              alt="Hudson's Deli grazing boxes piled with cured meats, cheeses, pickles and fruit"
              fetchpriority="high" decoding="async" />
          </div>
        </div>
        ${rotatingBadge("HUDSON'S DELI ★ EST. 2019 ★ TANJUNG BUNGAH ★", { size: 120, className: 'hero__badge' })}
      </div>
    </div>
    <div class="hero__scroll" aria-hidden="true">
      <span>Scroll</span>
      <span class="hero__scroll-rule"></span>
    </div>
  </section>`;
}

export function init(ctx) {
  const { gsap, reduce, lenis } = ctx;
  const hero = document.getElementById('hero');
  if (!hero) return;
  const q = (s) => hero.querySelector(s);
  const qa = (s) => Array.from(hero.querySelectorAll(s));

  const primary = q('.hero__cta .btn');
  if (primary) magnetic(primary, ctx);

  // 3-line masked headline reveal (revealLines is reduce-aware internally)
  revealLines(q('.hero__h1'), ctx, { immediate: true, delay: reduce ? 0 : 0.2, stagger: 0.09, duration: 0.9 });

  if (reduce) return;

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const rule = q('.hero__rule');
    const eyebrowText = q('.hero__eyebrow-text');
    const frame = q('.hero__frame');
    const imgScale = q('.hero__imgscale');
    const img = q('.hero__img');
    const script = q('.hero__script');
    const bursts = qa('.hero__burst');
    const badge = q('.hero__badge');
    const scrollCue = q('.hero__scroll');
    const reuben = q('.hero__reuben');
    const sub = q('.hero__sub');
    const ctaEls = qa('.hero__cta > *');

    // ── Page-load choreography (~1.15s) ──
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    if (rule) tl.from(rule, { scaleX: 0, duration: 0.6 }, 0.1);
    if (eyebrowText) tl.from(eyebrowText, { autoAlpha: 0, duration: 0.5 }, 0.15);
    if (frame) tl.fromTo(frame, { clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)', duration: 1.0, ease: 'power4.inOut' }, 0.55);
    if (imgScale) tl.fromTo(imgScale, { scale: 1.3 }, { scale: 1, duration: 1.0, ease: 'power4.inOut' }, 0.55);
    if (script) tl.fromTo(script, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.7, ease: 'power2.inOut' }, 0.7);
    // REUBEN "over-inks": starts char-colored, crossfades to brick.
    if (reuben) tl.fromTo(reuben, { color: '#211c18' }, { color: '#b5321e', duration: 0.5, ease: 'power2.out' }, 0.75);
    if (sub) tl.from(sub, { y: 16, autoAlpha: 0, duration: 0.6 }, 0.7);
    if (ctaEls.length) tl.from(ctaEls, { y: 16, autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 0.8);
    if (bursts.length) tl.from(bursts, { scale: 0, rotate: -30, autoAlpha: 0, duration: 0.6, ease: 'back.out(3)', stagger: 0.08, transformOrigin: '50% 50%' }, 0.85);
    if (badge) tl.from(badge, { autoAlpha: 0, scale: 0.8, duration: 0.6, ease: 'back.out(2)', transformOrigin: '50% 50%' }, 0.9);
    if (scrollCue) tl.from(scrollCue, { autoAlpha: 0, y: 10, duration: 0.5 }, 1.0);

    // ── Scrubbed scroll parallax ──
    const sTL = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    sTL.to(q('.hero__h1'), { yPercent: -18, ease: 'none' }, 0);
    if (frame) sTL.to(frame, { yPercent: -8, ease: 'none' }, 0);
    if (img) sTL.to(img, { scale: 1.08, ease: 'none' }, 0);
    if (bursts.length) sTL.to(bursts, { yPercent: -30, ease: 'none' }, 0);
    if (badge) sTL.to(badge, { rotate: 90, ease: 'none' }, 0);
    sTL.to(hero, { opacity: 0.4, ease: 'none' }, 0.7);

    // ── Desktop mouse parallax + badge velocity spin ──
    const cleanups = [];
    const spin = badge && badge.querySelector('.badge-rot__spin');
    if (spin && spin.getAnimations) {
      let ts = 1;
      const spinTick = () => {
        const target = gsap.utils.clamp(1, 3, 1 + Math.abs(lenis.velocity || 0) / 60);
        ts += (target - ts) * 0.1;
        const a = spin.getAnimations()[0];
        if (a) a.playbackRate = ts;
      };
      gsap.ticker.add(spinTick);
      cleanups.push(() => gsap.ticker.remove(spinTick));
    }

    if (window.matchMedia('(pointer: fine)').matches) {
      let mx = 0, my = 0, cx = 0, cy = 0;
      const onMove = (e) => {
        const r = hero.getBoundingClientRect();
        mx = (e.clientX - r.left) / r.width - 0.5;
        my = (e.clientY - r.top) / r.height - 0.5;
      };
      const tick = () => {
        cx += (mx - cx) * 0.08;
        cy += (my - cy) * 0.08;
        bursts.forEach((b) => gsap.set(b, { x: cx * -10, y: cy * -10 }));
        if (badge) gsap.set(badge, { x: cx * 10, y: cy * 10 });
        if (frame) gsap.set(frame, { x: cx * -4, y: cy * -4 });
      };
      hero.addEventListener('mousemove', onMove);
      gsap.ticker.add(tick);
      cleanups.push(() => { hero.removeEventListener('mousemove', onMove); gsap.ticker.remove(tick); });
    }

    return () => cleanups.forEach((fn) => fn());
  });
}
