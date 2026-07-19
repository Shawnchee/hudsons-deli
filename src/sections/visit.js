// Visit — warm-night mode shift — design.md §4.9 / §5.9.
import '../styles/sections/visit.css';
import { revealLines, magnetic, btn } from '../lib/ui.js';

export const id = 'visit';

const ADDRESS = '103, Jalan Chan Siew Teong, Bandar Tanjung Bungah, Penang, Malaysia';
const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

export function render() {
  return `<section id="visit" class="section visit">
    <div class="serrated serrated--down" style="--serr-color:var(--night)"></div>

    <div class="wrap visit__grid">
      <figure class="visit__photo">
        <img class="photo" src="images/storefront-night.jpg" alt="Hudson's Deli storefront at dusk with red lanterns and the glowing h Hudson's Deli sign" loading="lazy" decoding="async">
      </figure>

      <div class="visit__info">
        <p class="eyebrow eyebrow--night">FIND THE GLOWING SIGN</p>
        <h2 class="visit__heading">COME HUNGRY.<br>LEAVE IN A<br><span class="visit__accent" data-crossfade>GOOD MOOD.</span></h2>

        <div class="visit__rows">
          <div class="visit__row">
            <span class="visit__row-label">ADDRESS</span>
            <div class="visit__row-value">
              <p>${ADDRESS}</p>
              <a class="visit__maps-link" href="${MAPS_URL}" target="_blank" rel="noopener">OPEN IN MAPS <span class="visit__arrow">↗</span></a>
            </div>
            <span class="hairline hairline--night" data-row-hairline></span>
          </div>

          <div class="visit__row">
            <span class="visit__row-label">HOURS</span>
            <div class="visit__row-value"><p>Tuesday &ndash; Sunday, 11am &ndash; 6pm &middot; Closed Monday</p></div>
            <span class="hairline hairline--night" data-row-hairline></span>
          </div>

          <div class="visit__row">
            <span class="visit__row-label">CALL</span>
            <div class="visit__row-value"><a href="tel:+60162138344">016-213 8344</a></div>
            <span class="hairline hairline--night" data-row-hairline></span>
          </div>

          <div class="visit__row">
            <span class="visit__row-label">EMAIL</span>
            <div class="visit__row-value"><a href="mailto:Christian@pnchospitalityservices.com">Christian@pnchospitalityservices.com</a></div>
            <span class="hairline hairline--night" data-row-hairline></span>
          </div>

          <div class="visit__row visit__row--chips">
            <span class="visit__row-label">GOOD TO KNOW</span>
            <div class="visit__row-value">
              <div class="visit__chips">
                <span class="chip" data-chip>DINE IN</span>
                <span class="chip" data-chip>OUTDOOR SEATING</span>
                <span class="chip" data-chip>IN-STORE COLLECTION</span>
              </div>
              <p class="visit__note">Non-Halal &middot; ££</p>
            </div>
          </div>
        </div>

        <span class="visit__cta">
          <span class="visit__cta-glow" aria-hidden="true"></span>
          ${btn('CALL THE DELI', { href: 'tel:+60162138344', variant: 'night', magnetic: true })}
        </span>
      </div>
    </div>
  </section>`;
}

export function init(ctx) {
  const { gsap, ScrollTrigger, reduce } = ctx;
  const section = document.getElementById('visit');
  if (!section) return;

  const photoFig = section.querySelector('.visit__photo');
  const photoImg = photoFig.querySelector('img');

  if (reduce) {
    gsap.set(photoFig, { clipPath: 'inset(0)' });
  } else {
    gsap.set(photoFig, { clipPath: 'inset(100% 0 0 0)' });
    gsap.set(photoImg, { scale: 1.2 });

    gsap
      .timeline({ scrollTrigger: { trigger: photoFig, start: 'top 82%', once: true } })
      .to(photoFig, { clipPath: 'inset(0)', duration: 1.1, ease: 'power4.inOut' })
      .to(photoImg, { scale: 1, duration: 1.1, ease: 'power4.inOut' }, '<');

    gsap.fromTo(
      photoFig,
      { yPercent: 4 },
      { yPercent: -4, ease: 'none', scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6 } }
    );
  }

  revealLines('.visit__heading', ctx, { trigger: '.visit__heading', start: 'top 75%' });

  // "GOOD MOOD." arrives via clone-crossfade (like the hero's REUBEN).
  const accent = section.querySelector('[data-crossfade]');
  if (accent) {
    if (reduce) {
      accent.style.color = 'var(--glow)';
    } else {
      const clone = accent.cloneNode(true);
      clone.removeAttribute('data-crossfade');
      clone.setAttribute('aria-hidden', 'true');
      clone.style.position = 'absolute';
      clone.style.inset = '0';
      clone.style.color = 'var(--glow)';
      clone.style.opacity = '0';
      accent.style.position = 'relative';
      accent.style.display = 'inline-block';
      accent.appendChild(clone);

      ScrollTrigger.create({
        trigger: '.visit__heading',
        start: 'top 75%',
        once: true,
        onEnter: () => gsap.to(clone, { opacity: 1, duration: 0.4, delay: 1.0 }),
      });
    }
  }

  const rows = gsap.utils.toArray('.visit__row');
  if (reduce) {
    gsap.set(rows, { autoAlpha: 1, y: 0 });
    gsap.set('[data-row-hairline]', { scaleX: 1 });
  } else {
    gsap.set(rows, { autoAlpha: 0, y: 20 });
    gsap.set(section.querySelectorAll('[data-row-hairline]'), { scaleX: 0 });

    ScrollTrigger.create({
      trigger: '.visit__rows',
      start: 'top 78%',
      once: true,
      onEnter: () => {
        rows.forEach((row, i) => {
          const d = i * 0.08;
          gsap.to(row, { autoAlpha: 1, y: 0, duration: 0.6, delay: d, ease: 'power2.out' });
          const hl = row.querySelector('[data-row-hairline]');
          if (hl) gsap.to(hl, { scaleX: 1, duration: 0.6, delay: d, ease: 'power2.out' });
        });
      },
    });
  }

  const chips = gsap.utils.toArray('[data-chip]');
  if (reduce) {
    gsap.set(chips, { scale: 1, autoAlpha: 1 });
  } else {
    gsap.set(chips, { scale: 0.9, autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: '.visit__chips',
      start: 'top 85%',
      once: true,
      onEnter: () => gsap.to(chips, { scale: 1, autoAlpha: 1, duration: 0.5, stagger: 0.06, ease: 'back.out(2)' }),
    });
  }

  const cta = section.querySelector('[data-magnetic]');
  if (cta) magnetic(cta, ctx);

  const glow = section.querySelector('.visit__cta-glow');
  if (glow) {
    if (reduce) {
      gsap.set(glow, { opacity: 0.8 });
    } else {
      gsap.fromTo(glow, { opacity: 0.6 }, { opacity: 1, duration: 1.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    }
  }
}
