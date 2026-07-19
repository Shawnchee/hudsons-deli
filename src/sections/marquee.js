// Marquee divider — design.md §4.3 / §5.3.
// Full-bleed --brick band, rotated -2deg, seamless GSAP loop of the meat list.
import '../styles/sections/marquee.css';

export const id = 'marquee';

const ITEMS = [
  'PASTRAMI',
  'THE REUBEN',
  'GOULASH SOUP',
  'HOUSE-ROASTED LAMB',
  'SOPRESSA',
  'MILANO',
  'PANCETTA',
  'GORGONZOLA',
  'GOOD FOOD, GOOD MOOD',
];

function group() {
  return ITEMS.map(
    (t) => `<span class="marquee-band__item">${t}</span><span class="marquee__sep" aria-hidden="true">★</span>`
  ).join('');
}

export function render() {
  return `<section id="marquee" class="marquee-section">
    <div class="marquee-band">
      <div class="marquee marquee-band__marquee">
        <div class="marquee__track">
          <div class="marquee__group">${group()}</div>
          <div class="marquee__group">${group()}</div>
        </div>
      </div>
    </div>
    <p class="sr-only">Pastrami, the Reuben, goulash soup, house-roasted lamb, sopressa, milano, pancetta, gorgonzola &mdash; good food, good mood.</p>
  </section>`;
}

export function init(ctx) {
  const { gsap, reduce } = ctx;
  const section = document.getElementById('marquee');
  if (!section) return;

  const band = section.querySelector('.marquee-band');
  const groups = section.querySelectorAll('.marquee__group');

  if (reduce || !groups.length) {
    gsap.set(band, { autoAlpha: 1 });
    return;
  }

  // Entrance fade (band is visible by default via CSS — this only enhances).
  gsap.set(band, { autoAlpha: 0, y: 8 });
  gsap.to(band, {
    autoAlpha: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: { trigger: section, start: 'top 92%', once: true },
  });

  // Seamless loop: two identical groups laid side by side, both animate
  // xPercent 0 -> -100 in lockstep so the second slides in as the first exits.
  const tween = gsap.to(groups, { xPercent: -100, ease: 'none', duration: 40, repeat: -1 });

  // Velocity-reactive timeScale — direction never flips, just speeds up.
  let current = 1;
  const onTick = () => {
    const v = Math.abs(ctx.lenis?.velocity || 0);
    const target = gsap.utils.clamp(1, 4, 1 + v / 50);
    current += (target - current) * 0.1;
    tween.timeScale(current);
  };
  gsap.ticker.add(onTick);

  // Pause the loop while off-screen to save cycles.
  const io = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) tween.play();
      else tween.pause();
    },
    { threshold: 0 }
  );
  io.observe(section);
}
