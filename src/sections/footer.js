// Footer — design.md §4.10 / §5.10.
import '../styles/sections/footer.css';
import { vespaSVG, scrollToId } from '../lib/ui.js';

export const id = 'footer';

const LINKS = [
  { href: '#story', label: 'THE STORY' },
  { href: '#menu', label: 'MENU' },
  { href: '#video', label: 'THE FILM' },
  { href: '#gallery', label: 'GALLERY' },
  { href: '#visit', label: 'VISIT' },
];

const MARQUEE_LINE =
  'PASTRAMI ★ THE REUBEN ★ GOULASH SOUP ★ HOUSE-ROASTED LAMB ★ SOPRESSA ★ MILANO ★ PANCETTA ★ GORGONZOLA ★ GOOD FOOD, GOOD MOOD ★';

export function render() {
  return `<footer id="footer" class="footer">
    <div class="wrap footer__inner">
      <p class="footer__signoff" data-signoff>Good Food, Good Mood.</p>

      <div class="footer__marquee" aria-hidden="true">
        <p class="footer__marquee-line">${MARQUEE_LINE}</p>
      </div>

      <div class="footer__cols">
        <div class="footer__col footer__col--brand">
          <img class="footer__seal" src="images/logo-h-light.png" alt="Hudson's Deli logo" width="52" height="52" />
          <p class="footer__wordmark">HUDSON&rsquo;S DELI <span class="footer__dot">&middot;</span> THE NEIGHBOURHOOD DELI <span class="footer__dot">&middot;</span> EST. 2019</p>
        </div>

        <nav class="footer__col footer__col--links" aria-label="Footer">
          ${LINKS.map((l) => `<a href="${l.href}" data-anchor>${l.label}</a>`).join('')}
        </nav>

        <div class="footer__col footer__col--social">
          <a class="footer__social-link" href="https://www.facebook.com/hudsonsdeli" target="_blank" rel="noopener">FACEBOOK <span class="footer__arrow">↗</span></a>
          <a class="footer__social-link" href="https://www.instagram.com/hudsonsdeli/" target="_blank" rel="noopener">INSTAGRAM <span class="footer__arrow">↗</span></a>
          <p class="footer__pnc">Part of PNC Hospitality Services &mdash; pnchospitalityservices.com</p>
        </div>
      </div>

      <p class="footer__legal">&copy; 2019&ndash;2026 Hudson&rsquo;s Deli, Penang &middot; Non-Halal &middot; Film &amp; food photography by @penangfoodie</p>
    </div>

    <div class="footer__vespa" data-footer-vespa aria-hidden="true">
      ${vespaSVG({ width: 84 })}
      <span class="footer__pin"></span>
      <span class="footer__headlight" data-headlight></span>
    </div>
  </footer>`;
}

export function init(ctx) {
  const { gsap, ScrollTrigger, reduce, lenis } = ctx;
  const section = document.getElementById('footer');
  if (!section) return;

  // Defensive re-measure: many below-fold sections use lazy/async images
  // without a fixed aspect-ratio (out of this file's control), which can
  // shift layout — and every ScrollTrigger position after it — once they
  // finish loading past the orchestrator's single initial refresh.
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  const signoff = section.querySelector('[data-signoff]');
  if (reduce) {
    gsap.set(signoff, { clipPath: 'inset(0)' });
  } else {
    gsap.set(signoff, { clipPath: 'inset(0 100% 0 0)' });
    gsap.to(signoff, {
      clipPath: 'inset(0)',
      ease: 'none',
      scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 40%', scrub: 0.6 },
    });
  }

  const cols = gsap.utils.toArray('.footer__col');
  if (reduce) {
    gsap.set(cols, { autoAlpha: 1, y: 0 });
  } else {
    gsap.set(cols, { autoAlpha: 0, y: 24 });
    ScrollTrigger.create({
      trigger: '.footer__cols',
      start: 'top 90%',
      once: true,
      onEnter: () => gsap.to(cols, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out' }),
    });
  }

  // Anchor links smooth-scroll via Lenis (design.md §4.1).
  section.querySelectorAll('[data-anchor]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToId(lenis, a.getAttribute('href'));
    });
  });

  const vespa = section.querySelector('[data-footer-vespa]');
  const headlight = section.querySelector('[data-headlight]');

  if (reduce) {
    gsap.set(vespa, { x: 0, autoAlpha: 1 });
  } else {
    gsap.set(vespa, { x: -60, autoAlpha: 0 });
    ScrollTrigger.create({
      trigger: vespa,
      start: 'top 95%',
      once: true,
      onEnter: () => {
        gsap.to(vespa, {
          x: 0,
          autoAlpha: 1,
          duration: 0.8,
          ease: 'power4.out',
          onComplete: () => {
            gsap.delayedCall(0.5, () => {
              gsap.fromTo(headlight, { opacity: 0 }, { opacity: 1, duration: 0.2, yoyo: true, repeat: 1 });
            });
          },
        });
      },
    });
  }
}
