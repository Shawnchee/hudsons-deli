// Shared UI building blocks used across sections. Import what you need:
//   import { vespaSVG, rotatingBadge, starburst, magnetic, revealLines, btn, scrollToId } from '../lib/ui.js';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

/* ── Vespa mascot (side profile, facing right). Wheels tagged for rotation. */
export function vespaSVG({ className = '', width = 90 } = {}) {
  return `
  <span class="vespa ${className}" style="display:inline-block;width:${width}px" aria-hidden="true">
    <svg viewBox="0 0 230 150" fill="none" xmlns="http://www.w3.org/2000/svg" style="display:block;width:100%;overflow:visible">
      <!-- rear wheel -->
      <g class="vespa__wheel">
        <circle cx="58" cy="116" r="25" fill="#fff" stroke="var(--ink)" stroke-width="5"/>
        <circle cx="58" cy="116" r="6.5" fill="var(--ink)"/>
        <path d="M58 91 V141 M33 116 H83" stroke="var(--ink)" stroke-width="2"/>
      </g>
      <!-- front wheel -->
      <g class="vespa__wheel">
        <circle cx="176" cy="116" r="25" fill="#fff" stroke="var(--ink)" stroke-width="5"/>
        <circle cx="176" cy="116" r="6.5" fill="var(--ink)"/>
        <path d="M176 91 V141 M151 116 H201" stroke="var(--ink)" stroke-width="2"/>
      </g>
      <!-- main body silhouette (rear cowl → floorboard → front nose) -->
      <path d="M 30,116 C 26,84 34,58 60,56 C 86,54 100,72 99,96 L 126,96 C 133,96 137,88 142,76 C 147,62 155,56 164,56 L 168,56 C 178,56 183,66 181,82 C 179,98 170,100 160,100 L 99,100 Z" fill="var(--paper-raised)" stroke="var(--ink)" stroke-width="5" stroke-linejoin="round"/>
      <!-- front fender over front wheel -->
      <path d="M164,58 C176,60 186,74 184,94" stroke="var(--ink)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <!-- seat -->
      <path d="M42,56 C42,49 49,47 58,47 L92,47 C99,47 101,52 98,59 L42,60 Z" fill="var(--brick)"/>
      <!-- handlebar column + grip -->
      <path d="M166,57 L172,42" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
      <path d="M164,41 L184,41" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/>
      <!-- headlight -->
      <circle cx="176" cy="72" r="5.5" fill="var(--gold)" stroke="var(--ink)" stroke-width="2.5"/>
    </svg>
  </span>`;
}

/* ── Rotating circular text badge (SVG textPath). ──────────────────────── */
let _badgeSeq = 0;
export function rotatingBadge(text, { size = 120, stroke = 'var(--ink)', fill = 'transparent', textColor = 'var(--ink)', star = 'var(--gold)', className = '' } = {}) {
  const id = `badgepath-${_badgeSeq++}`;
  return `
  <span class="badge-rot ${className}" style="width:${size}px;height:${size}px" aria-hidden="true">
    <svg viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="58" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>
      <circle cx="60" cy="60" r="46" fill="none" stroke="${stroke}" stroke-width="1" opacity="0.5"/>
      <g class="badge-rot__spin">
        <defs><path id="${id}" d="M60,60 m-49,0 a49,49 0 1,1 98,0 a49,49 0 1,1 -98,0"/></defs>
        <text fill="${textColor}" font-family="var(--font-cond)" font-size="10.5" font-weight="600" letter-spacing="2.4">
          <textPath href="#${id}" startOffset="0%">${text}</textPath>
        </text>
      </g>
      <text x="60" y="66" text-anchor="middle" fill="${star}" font-size="18">★</text>
    </svg>
  </span>`;
}

/* ── Starburst punctuation ──────────────────────────────────────────────── */
export function starburst({ size = 44, color = 'var(--brick)', className = '' } = {}) {
  const pts = [];
  const spikes = 12;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 50 : 30;
    const a = (Math.PI / spikes) * i - Math.PI / 2;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  return `<span class="starburst ${className}" style="width:${size}px;height:${size}px;color:${color}" aria-hidden="true"><svg viewBox="0 0 100 100"><polygon points="${pts.join(' ')}" fill="currentColor"/></svg></span>`;
}

/* ── Button markup (label-roll ready) ──────────────────────────────────── */
export function btn(label, { href = '#', variant = 'primary', magnetic: mag = false, arrow = false } = {}) {
  const cls = ['btn', variant !== 'primary' ? `btn--${variant}` : ''].filter(Boolean).join(' ');
  const arr = arrow ? ' →' : '';
  return `<a class="${cls}" href="${href}"${mag ? ' data-magnetic' : ''}><span class="btn__roll" data-label="${label}${arr}"><span>${label}${arr}</span></span></a>`;
}

/* ── Magnetic pull for CTAs (pointer:fine only) ────────────────────────── */
export function magnetic(el, ctx) {
  if (!window.matchMedia('(pointer: fine)').matches || ctx.reduce) return;
  const strength = 0.35, max = 12;
  const setX = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' });
  const setY = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' });
  const onMove = (e) => {
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    setX(gsap.utils.clamp(-max, max, dx * strength));
    setY(gsap.utils.clamp(-max, max, dy * strength));
  };
  const reset = () => { gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }); };
  el.addEventListener('pointerenter', () => el.addEventListener('pointermove', onMove));
  el.addEventListener('pointerleave', () => { el.removeEventListener('pointermove', onMove); reset(); });
}

/* ── Masked line reveal via SplitText. Returns the SplitText instance. ─── */
export function revealLines(target, ctx, { trigger, start = 'top 78%', stagger = 0.08, duration = 0.9, delay = 0, immediate = false } = {}) {
  const els = typeof target === 'string' ? document.querySelectorAll(target) : [target];
  const splits = [];
  els.forEach((el) => {
    const split = new SplitText(el, { type: 'lines', linesClass: 'split-line' });
    split.lines.forEach((line) => {
      const wrap = document.createElement('span');
      wrap.className = 'split-mask';
      wrap.style.display = 'block';
      wrap.style.overflow = 'hidden';
      line.parentNode.insertBefore(wrap, line);
      wrap.appendChild(line);
    });
    if (ctx.reduce) { gsap.set(split.lines, { autoAlpha: 1 }); splits.push(split); return; }
    const tween = {
      yPercent: 0, autoAlpha: 1, duration, ease: 'power4.out', stagger, delay,
      onStart: () => gsap.set(split.lines, { willChange: 'transform' }),
      onComplete: () => gsap.set(split.lines, { willChange: 'auto' }),
    };
    gsap.set(split.lines, { yPercent: 110, autoAlpha: 0 });
    if (immediate) {
      gsap.to(split.lines, tween);
    } else {
      gsap.to(split.lines, { ...tween, scrollTrigger: { trigger: trigger || el, start, once: true } });
    }
    splits.push(split);
  });
  return splits.length === 1 ? splits[0] : splits;
}

/* ── Smooth-scroll to an anchor via Lenis ──────────────────────────────── */
export function scrollToId(lenis, id) {
  const el = document.querySelector(id);
  if (el) lenis.scrollTo(el, { offset: -70, duration: 1.2 });
}
