// Poster interlude — "the north star, framed" — design.md §4.6 / §5.6.
import '../styles/sections/poster.css';
import { rotatingBadge } from '../lib/ui.js';

export const id = 'poster';

export function render() {
  return `<section id="poster" class="section poster">
    <div class="wrap poster__grid">
      <div class="poster__copy">
        <p class="eyebrow">THE HOUSE ART</p>
        <p class="poster__text">The poster hangs in the shop and rides on the totes. Cream paper, brick ink, one very good sandwich.</p>
        <p class="poster__script" data-script>Good Food, Good Mood</p>
      </div>

      <div class="poster__stage">
        <div class="poster__frame" data-frame>
          <img class="poster__img" src="images/poster-reuben.jpg" alt="Hudson's Deli house poster art — Soup &amp; Sandwiches, The Reuben" loading="lazy" decoding="async">
          <span class="poster__badge" data-badge>${rotatingBadge('MADE WITH h EVERY DAY ★ ', {
            size: 116,
            fill: 'var(--gold)',
            stroke: 'var(--ink)',
            textColor: 'var(--ink)',
            star: 'var(--ink)',
          })}</span>
        </div>
      </div>
    </div>
  </section>`;
}

export function init(ctx) {
  const { gsap, reduce } = ctx;
  const section = document.getElementById('poster');
  if (!section) return;

  const frame = section.querySelector('[data-frame]');
  const badge = section.querySelector('[data-badge]');
  const copy = section.querySelector('.poster__copy');
  const script = section.querySelector('[data-script]');

  gsap.set(script, { clipPath: 'inset(0 100% 0 0)' });
  gsap.set(badge, { scale: 1.8, autoAlpha: 0, transformOrigin: '50% 50%' });

  const mm = gsap.matchMedia();

  mm.add(
    {
      isReduced: '(prefers-reduced-motion: reduce)',
      isDesktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
      isMobile: '(max-width: 767.98px) and (prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const { isReduced, isDesktop, isMobile } = context.conditions;

      if (isReduced) {
        gsap.set([frame, copy], { clearProps: 'transform,opacity', autoAlpha: 1 });
        gsap.set(script, { clipPath: 'inset(0)' });
        gsap.set(badge, { scale: 1, autoAlpha: 1 });
        return;
      }

      if (isDesktop) {
        gsap.set(frame, { scale: 0.72, rotate: -4, transformOrigin: '50% 50%' });
        gsap.set(copy, { autoAlpha: 0.3 });

        // Piecewise scrub timeline: total = 1 "unit" == 160% of viewport scroll.
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=160%',
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        tl.to(frame, { scale: 1, rotate: 0, duration: 0.6, ease: 'none' }, 0)
          .to(copy, { autoAlpha: 1, duration: 0.3, ease: 'none' }, 0.15)
          .to(script, { clipPath: 'inset(0)', duration: 0.15, ease: 'none' }, 0.6)
          // Badge stamp: 75% -> 90% of scroll, back.out feel via piecewise scale keys.
          .to(badge, { scale: 1.15, autoAlpha: 1, duration: 0.06, ease: 'none' }, 0.75)
          .to(badge, { scale: 0.94, duration: 0.05, ease: 'none' }, 0.81)
          .to(badge, { scale: 1, duration: 0.04, ease: 'none' }, 0.86)
          // Impact shake.
          .to(frame, { x: 3, duration: 0.015, ease: 'none' }, 0.86)
          .to(frame, { x: -2, duration: 0.015, ease: 'none' }, 0.875)
          .to(frame, { x: 0, duration: 0.015, ease: 'none' }, 0.89)
          .to([frame, copy, badge], { yPercent: -4, duration: 0.1, ease: 'none' }, 0.9);

        return;
      }

      if (isMobile) {
        gsap.set(frame, { clipPath: 'inset(0 0 100% 0)', scale: 0.9 });
        gsap.set(copy, { autoAlpha: 1 });

        gsap.to(frame, {
          clipPath: 'inset(0)',
          scale: 1,
          duration: 1.1,
          ease: 'power4.inOut',
          scrollTrigger: { trigger: section, start: 'top 75%', once: true },
          onComplete: () => {
            gsap.to(badge, { scale: 1, autoAlpha: 1, duration: 0.4, ease: 'back.out(2.5)', delay: 0.4 });
          },
        });
        gsap.to(script, {
          clipPath: 'inset(0)',
          duration: 0.7,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: section, start: 'top 60%', once: true },
        });
      }
    }
  );
}
