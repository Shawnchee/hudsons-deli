// The Story — "An Austrian in Penang" — design.md §4.4 / §5.4.
import '../styles/sections/story.css';
import { revealLines, vespaSVG } from '../lib/ui.js';

export const id = 'story';

const COUNTERS = [
  { value: 7, snap: 1, suffix: 'YEARS', label: "the neighbourhood&rsquo;s deli" },
  { value: 150, snap: 5, suffix: 'g', label: 'house-roasted beef per sandwich' },
  { value: 98, snap: 1, suffix: '%', label: "recommend it (and they&rsquo;re right)" },
  { value: 1, snap: 1, suffix: '', label: 'white Vespa, non-negotiable', vespa: true },
];

function counterMarkup(c) {
  return `<div class="story__counter" data-counter data-value="${c.value}" data-snap="${c.snap}">
    <div class="story__counter-figure">
      ${c.vespa ? `<span class="story__counter-vespa" data-vespa-doodle>${vespaSVG({ width: 28 })}</span>` : ''}
      <span class="story__counter-num" data-num>0</span><span class="story__counter-unit">${c.suffix}</span>
    </div>
    <p class="story__counter-label">${c.label}</p>
  </div>`;
}

export function render() {
  return `<section id="story" class="section story">
    <div class="serrated serrated--down" style="--serr-color:var(--paper-deep)"></div>

    <div class="wrap grid12 story__grid">
      <div class="story__copy">
        <p class="eyebrow">EST. 2019 &middot; STILL SLICING</p>
        <h2 class="story__heading">AN AUSTRIAN IN PENANG,<br>SLICING <span class="story__accent">PASTRAMI</span><br>BY HAND.</h2>
        <p class="story__body">Hudson&rsquo;s Deli is Christian Heidenreich&rsquo;s love letter to the European deli counter. A five-star hotel chef who simply couldn&rsquo;t find a proper Reuben in Penang &mdash; so he built one, and named the place after his grandson. Meats are brined, roasted and sliced by his own two hands. Around 150 grams of house-roasted beef goes into a sandwich, the lamb is roasted in-house, the spicy sauce is homemade. No franchises, no freezer aisle &mdash; just a neighbourhood deli, and the good mood that follows.</p>
      </div>

      <div class="story__photos">
        <figure class="story__photo story__photo--large">
          <img class="photo" src="images/food-beef-slicing.jpg" alt="150 grams of house-roasted beef being hand-sliced at the Hudson's Deli counter" loading="lazy" decoding="async" style="object-position:center 55%">
        </figure>
        <figure class="story__photo story__photo--small">
          <img class="photo" src="images/owners-storefront.jpg" alt="Christian and Pearl outside Hudson's Deli" loading="lazy" decoding="async">
          <figcaption class="story__caption">Christian &amp; Pearl, out front on Jalan Chan Siew Teong.</figcaption>
        </figure>
      </div>

      <div class="story__counters">
        ${COUNTERS.map(counterMarkup).join('')}
      </div>
    </div>

    <div class="serrated" style="--serr-color:var(--paper-deep)"></div>
  </section>`;
}

export function init(ctx) {
  const { gsap, ScrollTrigger, reduce } = ctx;
  const section = document.getElementById('story');
  if (!section) return;

  revealLines('.story__heading', ctx, { trigger: '.story__heading', start: 'top 72%' });

  const body = section.querySelector('.story__body');
  if (reduce) {
    gsap.set(body, { autoAlpha: 1 });
  } else {
    gsap.set(body, { autoAlpha: 0, y: 24 });
    gsap.to(body, {
      autoAlpha: 1,
      y: 0,
      duration: 0.8,
      delay: 0.1,
      ease: 'power2.out',
      scrollTrigger: { trigger: '.story__heading', start: 'top 72%', once: true },
    });
  }

  const largeFig = section.querySelector('.story__photo--large');
  const smallFig = section.querySelector('.story__photo--small');
  const photosWrap = section.querySelector('.story__photos');

  if (reduce) {
    gsap.set([largeFig, smallFig], { clipPath: 'inset(0)', autoAlpha: 1 });
  } else {
    gsap.set(largeFig, { clipPath: 'inset(0 0 100% 0)' });
    gsap.set(smallFig, { clipPath: 'inset(0 100% 0 0)' });

    gsap
      .timeline({ scrollTrigger: { trigger: photosWrap, start: 'top 78%', once: true } })
      .to(largeFig, { clipPath: 'inset(0)', duration: 1.0, ease: 'power4.inOut' })
      .to(smallFig, { clipPath: 'inset(0)', duration: 1.0, ease: 'power4.inOut' }, 0.15);

    // Dual-rate scrub parallax.
    gsap.fromTo(
      largeFig,
      { yPercent: 6 },
      {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: photosWrap, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      }
    );
    gsap.fromTo(
      smallFig,
      { yPercent: 12, rotate: 2 },
      {
        yPercent: -12,
        rotate: 3.5,
        ease: 'none',
        scrollTrigger: { trigger: photosWrap, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      }
    );
  }

  // Counters — count up once on enter.
  const counters = gsap.utils.toArray('[data-counter]');
  if (counters.length) {
    if (reduce) {
      counters.forEach((c) => {
        c.querySelector('[data-num]').textContent = c.dataset.value;
        gsap.set(c, { autoAlpha: 1, y: 0 });
      });
    } else {
      gsap.set(counters, { autoAlpha: 0, y: 16 });
      ScrollTrigger.create({
        trigger: '.story__counters',
        start: 'top 70%',
        once: true,
        onEnter: () => {
          counters.forEach((c, i) => {
            const target = Number(c.dataset.value);
            const snap = Number(c.dataset.snap) || 1;
            const numEl = c.querySelector('[data-num]');
            const unitEl = c.querySelector('.story__counter-unit');
            const proxy = { v: 0 };
            const d = i * 0.12;

            gsap.to(c, { autoAlpha: 1, y: 0, duration: 0.5, delay: d, ease: 'power2.out' });
            gsap.to(proxy, {
              v: target,
              duration: 1.4,
              delay: d,
              ease: 'expo.out',
              snap: { v: snap },
              onUpdate: () => { numEl.textContent = Math.round(proxy.v); },
              onComplete: () => gsap.fromTo(unitEl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }),
            });

            const doodle = c.querySelector('[data-vespa-doodle]');
            if (doodle) {
              gsap.fromTo(
                doodle,
                { x: -8, rotate: -2 },
                { x: 0, rotate: 2, duration: 0.6, delay: d + 0.2, ease: 'power2.out' }
              );
            }
          });
        },
      });
    }
  }
}
