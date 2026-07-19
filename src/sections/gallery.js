// Gallery / Community + the Vespa drive-by — design.md §4.8 / §5.8.
import '../styles/sections/gallery.css';
import { revealLines, vespaSVG } from '../lib/ui.js';

export const id = 'gallery';

const CARDS = [
  {
    src: 'images/storefront-vespa.jpg',
    alt: "Hudson's Deli shopfront on Jalan Chan Siew Teong with the white Vespa parked out front",
    caption: 'The shopfront on Jalan Chan Siew Teong.',
    span: 'wide',
    objectPosition: 'top',
    loc: false,
  },
  {
    src: 'images/storefront-day.jpg',
    alt: "Daytime at Hudson's Deli",
    caption: 'Open Tuesday to Sunday, 11 till 6.',
    span: 'square',
    loc: true,
  },
  {
    src: 'images/vespa-grass.jpg',
    alt: 'The Hudson&rsquo;s Deli Vespa parked in tall grass',
    caption: 'The mascot, off duty.',
    span: 'portrait',
    loc: true,
  },
  {
    src: 'images/merch-tote.jpg',
    alt: "Hudson's Deli branded tote bag carrying the poster art",
    caption: 'The tote &mdash; poster art included.',
    span: 'square-sm',
    loc: false,
  },
  {
    src: 'images/community-tees.jpg',
    alt: "Regulars wearing Hudson's Deli branded t-shirts",
    caption: 'Regulars in uniform.',
    span: 'wide2',
    loc: true,
  },
];

function cardMarkup(c) {
  return `<figure class="gallery__card gallery__card--${c.span}" data-gallery-card>
    <div class="gallery__card-media">
      <img class="photo${c.loc ? ' photo--loc' : ''}" src="${c.src}" alt="${c.alt}" loading="lazy" decoding="async"${c.objectPosition ? ` style="object-position:${c.objectPosition}"` : ''}>
    </div>
    <figcaption class="gallery__caption">${c.caption}</figcaption>
  </figure>`;
}

export function render() {
  return `<section id="gallery" class="section gallery">
    <div class="serrated serrated--down" style="--serr-color:var(--paper-deep)"></div>

    <div class="wrap gallery__header">
      <p class="eyebrow">THE NEIGHBOURHOOD</p>
      <h2 class="gallery__heading">A DELI, A VESPA,<br>AND THE REGULARS.</h2>
      <p class="gallery__body">Navy awning, jars on the shelves, a wall of knives, and the white Vespa out front. The regulars wear the t-shirt. Literally.</p>
    </div>

    <div class="wrap gallery__grid">
      ${CARDS.map(cardMarkup).join('')}
    </div>

    <div class="gallery__road" data-road>
      <div class="gallery__road-line"></div>
      <div class="gallery__vespa" data-vespa>
        ${vespaSVG({ width: 90 })}
        <span class="gallery__dust gallery__dust--1"></span>
        <span class="gallery__dust gallery__dust--2"></span>
      </div>
    </div>

    <div class="serrated" style="--serr-color:var(--paper-deep)"></div>
  </section>`;
}

export function init(ctx) {
  const { gsap, ScrollTrigger, reduce } = ctx;
  const section = document.getElementById('gallery');
  if (!section) return;

  revealLines('.gallery__heading', ctx, { trigger: '.gallery__heading', start: 'top 75%' });

  const cards = gsap.utils.toArray('[data-gallery-card]');

  if (reduce) {
    gsap.set(cards, { clipPath: 'inset(0% round 12px)', autoAlpha: 1, y: 0 });
    gsap.set(cards.map((c) => c.querySelector('img')), { scale: 1 });
  } else {
    gsap.set(cards, { clipPath: 'inset(8% round 12px)', y: 32, autoAlpha: 0 });
    gsap.set(cards.map((c) => c.querySelector('img')), { scale: 1.15 });

    ScrollTrigger.batch(cards, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) => {
        gsap.to(batch, {
          clipPath: 'inset(0% round 12px)',
          y: 0,
          autoAlpha: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
        });
        gsap.to(
          batch.map((c) => c.querySelector('img')),
          { scale: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
        );
      },
    });

    // Alternating-rate depth parallax.
    cards.forEach((card, i) => {
      const amp = i % 2 === 0 ? 5 : 10;
      const caption = card.querySelector('figcaption');
      gsap.fromTo(
        card,
        { yPercent: amp },
        { yPercent: -amp, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }
      );
      if (caption) {
        gsap.fromTo(
          caption,
          { yPercent: amp + 2 },
          { yPercent: -(amp + 2), ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 } }
        );
      }
    });
  }

  // ── The Vespa drive-by ──────────────────────────────────────────────
  const vespaWrap = section.querySelector('[data-vespa]');
  const wheels = section.querySelectorAll('[data-vespa] .vespa__wheel');
  const dustEls = section.querySelectorAll('.gallery__dust');

  // Rotate each wheel around its OWN centre (GSAP resolves % origin off the
  // SVG bbox). Without this the wheels orbit the SVG origin and fly off.
  wheels.forEach((w) => gsap.set(w, { transformOrigin: '50% 50%' }));

  if (reduce) {
    gsap.set(vespaWrap, { x: '50vw', autoAlpha: 1 });
  } else {
    let lastDir = 1;
    let dustOn = false;

    gsap.fromTo(
      vespaWrap,
      { x: '-15vw' },
      {
        x: '115vw',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.5,
          onUpdate: (self) => {
            gsap.set(wheels, { rotate: self.progress * 2400 });

            const dir = self.direction;
            if (dir !== lastDir) {
              lastDir = dir;
              gsap.delayedCall(0.08, () => {
                gsap.to(vespaWrap, { scaleX: dir > 0 ? 1 : -1, duration: 0.2, ease: 'power2.out' });
              });
            }

            const v = Math.abs(self.getVelocity());
            const shouldShow = v > 400;
            if (shouldShow !== dustOn) {
              dustOn = shouldShow;
              gsap.to(dustEls, { autoAlpha: shouldShow ? 1 : 0, duration: 0.2 });
            }
          },
        },
      }
    );

    // Idle bob — a few bumps per viewport width.
    gsap.to(vespaWrap, { y: '+=3', duration: 0.35, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  }
}
