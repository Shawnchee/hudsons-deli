// Smooth scroll (Lenis) wired into GSAP ScrollTrigger.
// Exposes a single shared context so every section animates on the same timeline.
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export function createScroll() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: !reduce,
    syncTouch: false,
    touchMultiplier: 1.5,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Let ScrollTrigger drive scroll position through Lenis if needed.
  ScrollTrigger.scrollerProxy(document.body, {
    scrollTop(value) {
      if (arguments.length) lenis.scrollTo(value, { immediate: true });
      return lenis.scroll;
    },
  });

  return { gsap, ScrollTrigger, lenis, reduce };
}
