// ── §4.5 + §5.5 — Signature menu "Soup & Sandwiches" ──────────────────
// Desktop (≥1024, no reduced-motion): pinned horizontal scrub of six tall
// cards via ScrollTrigger pin + containerAnimation per-card triggers, plus
// pointer drag/fling (Draggable + InertiaPlugin) and a slicer-dial progress
// gauge. Below 1024px the pin is dropped for a native scroll-snap carousel
// with IntersectionObserver-fired stamps. Reduced-motion = static carousel.
import '../styles/sections/menu.css';
import { magnetic, btn } from '../lib/ui.js';
import { SplitText } from 'gsap/SplitText';
import Draggable from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

export const id = 'menu';

const CARDS = [
  {
    n: '01', star: true, name: 'The Reuben', tag: 'The Hero',
    desc: 'The one they cross the island for. House-cured pastrami piled high, sauerkraut, melted cheese and our homemade spicy sauce, pressed until it gives in. Home of the best Reuben in Malaysia — we put it on the poster.',
    img: { src: 'images/menu-reuben.jpg', pos: 'center 55%', alt: 'The Reuben — house-cured pastrami, sauerkraut and swiss on toasted rye, with a side salad' },
  },
  {
    n: '02', name: 'Smoked Beef Panini',
    desc: 'Smoked beef and melting cheese, striped on the grill until the crust crackles.',
    img: { src: 'images/food-panini-grill.jpg', pos: 'center 62%', alt: 'Smoked beef panini pressing on the grill' },
  },
  {
    n: '03', name: 'Goulash Soup',
    desc: 'The Austrian in the room. Slow-simmered beef, paprika and potatoes — Vienna, by way of the tropics.',
    img: { src: 'images/menu-goulash.jpg', pos: 'center 55%', alt: 'Beef goulash soup with crusty bread' },
  },
  {
    n: '04', name: 'The Meat & Cheese Board',
    desc: 'Sopressa & Milano salami, prosciutto, exotic cheeses, cornichons, dips and dried fruit — sliced to order, boarded up, or boxed to travel.',
    img: { src: 'images/menu-platter.jpg', pos: 'center 55%', alt: 'A meat and cheese board with salami, ham, prosciutto, cheeses, cornichons and dips' },
  },
  {
    n: '05', name: 'Basque Cheesecake',
    desc: 'The sweet finish. Burnt on top, molten in the middle — baked in-house, gone by mid-afternoon.',
    img: { src: 'images/menu-cheesecake.jpg', pos: 'center 45%', alt: 'A burnt Basque cheesecake baked in-house' },
  },
];

function archSVG() {
  return `<svg class="menu__arch-svg" viewBox="0 0 880 210" role="img" aria-label="Soup & Sandwiches">
    <defs><path id="menu-arch-path" d="M 30 186 Q 440 42 850 186" fill="none"/></defs>
    <text class="menu__arch-text" text-anchor="middle">
      <textPath class="menu__arch-textpath" href="#menu-arch-path" startOffset="50%">SOUP &amp; SANDWICHES</textPath>
    </text>
  </svg>`;
}

function dialSVG() {
  return `<svg viewBox="0 0 40 40" aria-hidden="true">
    <circle cx="20" cy="20" r="18" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="2"/>
    <line x1="20" y1="20" x2="20" y2="5" stroke="var(--brick)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="20" cy="20" r="2.5" fill="var(--ink)"/>
  </svg>`;
}

function cardHTML(c) {
  const media = c.split
    ? `<div class="menu__media menu__media--split">
        ${c.split
          .map(
            (s) => `<div class="menu__imgwrap" style="--h:${s.h}"><img class="menu__img photo" src="${s.src}" alt="${s.alt}" loading="lazy" decoding="async"></div>`
          )
          .join('')}
      </div>`
    : `<div class="menu__media"><div class="menu__imgwrap"><img class="menu__img photo" src="${c.img.src}" alt="${c.img.alt}" style="object-position:${c.img.pos}" loading="lazy" decoding="async"></div></div>`;
  const star = c.star ? '<span class="menu__star" aria-hidden="true">★</span>' : '';
  const tag = c.tag ? `<span class="chip chip--tag menu__tag">${c.tag}</span>` : '';
  return `<article class="menu__card">
    ${media}
    <div class="menu__rule"></div>
    <div class="menu__body">
      <div class="menu__meta"><span class="menu__num">${c.n}${star}</span>${tag}</div>
      <h3 class="menu__name">${c.name}</h3>
      <p class="menu__desc">${c.desc}</p>
    </div>
  </article>`;
}

function endcapHTML() {
  return `<article class="menu__card menu__card--end">
    <div class="menu__end-inner">
      <p class="menu__end-title"><span>Made with</span><span class="menu__end-h">h</span><span>every day</span></p>
      <p class="menu__end-line">Full menu and prices at the counter — come hungry.</p>
      ${btn('Find Us', { href: '#visit', variant: 'inverted', magnetic: true, arrow: true })}
    </div>
  </article>`;
}

export function render() {
  const cards = CARDS.map(cardHTML).join('') + endcapHTML();
  return `
  <section id="menu" class="menu">
    <div class="menu__head wrap">
      <div class="menu__arch">${archSVG()}</div>
      <p class="menu__sub">House-roasted meats, imported cured classics, and the sandwich that made the neighbourhood talk.</p>
      <p class="menu__hint">Drag / Scroll →</p>
    </div>
    <div class="menu__viewport" data-cursor="drag">
      <div class="menu__track">${cards}</div>
      <div class="menu__gauge" aria-hidden="true">
        <div class="menu__gauge-track">
          <span class="menu__gauge-fill"></span>
          <span class="menu__gauge-knob">${dialSVG()}</span>
        </div>
      </div>
    </div>
  </section>`;
}

export function init(ctx) {
  const { gsap, ScrollTrigger, lenis, reduce } = ctx;
  const section = document.getElementById('menu');
  if (!section) return;

  const viewport = section.querySelector('.menu__viewport');
  const track = section.querySelector('.menu__track');
  const cards = Array.from(track.querySelectorAll('.menu__card'));
  const fill = section.querySelector('.menu__gauge-fill');
  const knob = section.querySelector('.menu__gauge-knob');
  const gaugeTrack = section.querySelector('.menu__gauge-track');

  // magnetic end-cap CTA
  const endBtn = section.querySelector('.menu__card--end .btn');
  if (endBtn) magnetic(endBtn, ctx);

  function updateGauge(p) {
    p = gsap.utils.clamp(0, 1, p || 0);
    if (fill) gsap.set(fill, { scaleX: p });
    if (knob && gaugeTrack) gsap.set(knob, { x: p * gaugeTrack.offsetWidth, rotate: p * 720 });
  }

  // Build per-card "stamp" timelines (number stamp + name char-rise + ★ spin).
  function buildStamps() {
    const splits = [];
    const timelines = cards.map((card) => {
      const num = card.querySelector('.menu__num');
      const name = card.querySelector('.menu__name');
      const star = card.querySelector('.menu__star');
      const tl = gsap.timeline({ paused: true });
      if (num) {
        tl.from(num, { scale: 1.5, autoAlpha: 0, duration: 0.4, ease: 'back.out(2.5)', transformOrigin: '50% 50%' }, 0)
          .to(num, { keyframes: { x: [-4, 3, 0] }, duration: 0.18, ease: 'power2.out' }, 0.28);
      }
      if (name) {
        const s = new SplitText(name, { type: 'chars' });
        splits.push(s);
        tl.from(s.chars, { yPercent: 110, autoAlpha: 0, duration: 0.5, ease: 'power4.out', stagger: 0.02 }, 0.08);
      }
      if (star) tl.to(star, { rotate: 360, duration: 0.6, ease: 'power2.out', transformOrigin: '50% 50%' }, 0.1);
      return tl;
    });
    return {
      play: (i) => timelines[i] && timelines[i].play(),
      cleanup: () => splits.forEach((s) => s.revert()),
    };
  }

  // Arched headline entrance (slide along the arc + fade). Runs in all modes
  // except reduced-motion.
  const archText = section.querySelector('.menu__arch-text');
  const archPath = section.querySelector('.menu__arch-textpath');
  if (archText && !reduce) {
    const trig = { trigger: section.querySelector('.menu__head'), start: 'top 78%', once: true };
    gsap.fromTo(archText, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'power2.out', scrollTrigger: trig });
    if (archPath) gsap.fromTo(archPath, { attr: { startOffset: '44%' }, autoAlpha: 0 }, { attr: { startOffset: '50%' }, autoAlpha: 1, duration: 1.0, ease: 'power3.out', scrollTrigger: trig });
  }

  const mm = gsap.matchMedia();

  // ── Desktop: pinned horizontal scrub ────────────────────────────────
  mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.add('menu--pinned');
    const distance = () => Math.max(0, track.scrollWidth - viewport.offsetWidth);

    const scrollTween = gsap.to(track, {
      x: () => -distance(),
      ease: 'none',
      scrollTrigger: {
        id: 'menuPin',
        trigger: viewport,
        start: 'top top',
        end: () => '+=' + distance(),
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => updateGauge(self.progress),
        onRefresh: (self) => updateGauge(self.progress),
      },
    });

    const stamps = buildStamps();

    cards.forEach((card, i) => {
      const imgs = card.querySelectorAll('.menu__img');

      gsap.from(card, {
        y: 40, rotate: 1.5, autoAlpha: 0.4, duration: 0.6, ease: 'power3.out',
        onComplete: () => gsap.set(card, { clearProps: 'transform,opacity' }),
        scrollTrigger: { trigger: card, containerAnimation: scrollTween, start: 'left 92%' },
      });

      if (imgs.length) {
        gsap.fromTo(imgs, { xPercent: -8 }, {
          xPercent: 8, ease: 'none',
          scrollTrigger: { trigger: card, containerAnimation: scrollTween, start: 'left right', end: 'right left', scrub: true },
        });
      }

      if (i === 0) {
        // The Reuben is visible first — stamp it as the section arrives.
        ScrollTrigger.create({ trigger: viewport, start: 'top 60%', once: true, onEnter: () => stamps.play(0) });
      } else {
        ScrollTrigger.create({
          trigger: card, containerAnimation: scrollTween, start: 'center 64%', once: true,
          onEnter: () => stamps.play(i),
        });
      }
    });

    // end-cap headline writes on
    const endTitle = section.querySelector('.menu__end-title');
    if (endTitle) {
      gsap.from(endTitle, {
        clipPath: 'inset(0 100% 0 0)', duration: 0.7, ease: 'power2.inOut',
        scrollTrigger: { trigger: endTitle, containerAnimation: scrollTween, start: 'left 75%', once: true },
      });
    }

    const drag = setupDrag(scrollTween);

    return () => {
      stamps.cleanup();
      if (drag) drag.kill();
      section.classList.remove('menu--pinned');
      gsap.set(track, { clearProps: 'transform' });
    };
  });

  // ── Mobile: native scroll-snap carousel + IO stamps ─────────────────
  mm.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
    const stamps = buildStamps();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = cards.indexOf(e.target);
            if (i >= 0) stamps.play(i);
            io.unobserve(e.target);
          }
        });
      },
      { root: track, threshold: 0.6 }
    );
    cards.forEach((c) => io.observe(c));

    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth;
      updateGauge(max > 0 ? track.scrollLeft / max : 0);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      stamps.cleanup();
      io.disconnect();
      track.removeEventListener('scroll', onScroll);
    };
  });

  // ── Reduced motion: static carousel, gauge tracks native scroll ─────
  mm.add('(prefers-reduced-motion: reduce)', () => {
    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth;
      updateGauge(max > 0 ? track.scrollLeft / max : 0);
    };
    track.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => track.removeEventListener('scroll', onScroll);
  });

  // Pointer drag + inertia fling maps horizontal drag to page scroll (which
  // the pin scrubs). Pointer-fine only.
  function setupDrag(scrollTween) {
    if (!window.matchMedia('(pointer: fine)').matches) return null;
    gsap.registerPlugin(Draggable, InertiaPlugin);
    const proxy = document.createElement('div');
    let startScroll = 0;
    const apply = (self) => lenis.scrollTo(startScroll - self.x, { immediate: true, force: true });
    const instances = Draggable.create(proxy, {
      type: 'x',
      trigger: viewport,
      inertia: true,
      dragClickables: true,
      minimumMovement: 6,
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress() { startScroll = lenis.scroll; gsap.set(proxy, { x: 0 }); },
      onDrag() { apply(this); },
      onThrowUpdate() { apply(this); },
    });
    return instances[0];
  }
}
