// The Film — Penang Foodie feature — design.md §4.7 / §5.7.
import '../styles/sections/video.css';
import { revealLines } from '../lib/ui.js';

export const id = 'video';

export function render() {
  return `<section id="video" class="section video">
    <div class="serrated serrated--down" style="--serr-color:#211C18"></div>

    <div class="wrap video__grid">
      <div class="video__copy">
        <p class="eyebrow">AS SEEN ON PENANG FOODIE</p>
        <h2 class="video__heading">825,000 STOMACHS<br>FOLLOW @PENANGFOODIE.<br>THIS SENT THEM <span class="video__accent">HERE.</span></h2>
        <p class="video__body">Sixty-seven seconds of slicing, pressing and one very photogenic goulash. Filmed at the counter, no acting required.</p>
        <p class="video__credit"><a class="video__credit-link" href="https://www.instagram.com/p/Da62tnuTt1C/" target="_blank" rel="noopener">FEATURED BY @PENANGFOODIE <span class="video__arrow">↗</span></a></p>
        <p class="video__subcaption">Film &amp; food photography by @penangfoodie &mdash; reproduced with love.</p>
      </div>

      <div class="video__stage">
        <div class="video__phone" data-phone>
          <video class="video__el" data-video src="video/penangfoodie-feature.mp4" poster="images/video-poster.jpg" muted playsinline loop preload="metadata"></video>
          <button class="video__play" type="button" data-play aria-label="Play the Penang Foodie feature video">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>
          </button>
          <button class="video__sound-chip" type="button" data-sound-chip aria-pressed="false">TAP FOR SOUND</button>
        </div>
      </div>
    </div>

    <div class="serrated" style="--serr-color:#211C18"></div>
  </section>`;
}

export function init(ctx) {
  const { gsap, ScrollTrigger, reduce } = ctx;
  const section = document.getElementById('video');
  if (!section) return;

  revealLines('.video__heading', ctx, { trigger: '.video__heading', start: 'top 72%' });

  const phone = section.querySelector('[data-phone]');
  const videoEl = section.querySelector('[data-video]');
  const chip = section.querySelector('[data-sound-chip]');
  const playBtn = section.querySelector('[data-play]');

  // Keep the play-overlay in sync with the real playback state.
  const syncUI = () => section.classList.toggle('is-playing', !videoEl.paused && !videoEl.ended);
  videoEl.addEventListener('play', syncUI);
  videoEl.addEventListener('pause', syncUI);
  videoEl.addEventListener('ended', syncUI);
  const tryPlay = () => videoEl.play().then(syncUI).catch(syncUI);
  const toggle = () => { videoEl.paused ? tryPlay() : videoEl.pause(); };
  playBtn.addEventListener('click', toggle);
  videoEl.addEventListener('click', toggle);

  if (reduce) {
    gsap.set(phone, { autoAlpha: 1 });
  } else {
    gsap.fromTo(
      phone,
      { rotate: 3, y: 60, autoAlpha: 0 },
      {
        rotate: 0,
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: { trigger: phone, start: 'top 85%', once: true },
      }
    );
    gsap.fromTo(
      phone,
      { yPercent: 4 },
      {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
      }
    );
  }

  const resetChip = () => {
    videoEl.muted = true;
    chip.textContent = 'TAP FOR SOUND';
    chip.setAttribute('aria-pressed', 'false');
  };

  // Muted scroll-autoplay for non-reduced-motion. Manual play always works
  // (the overlay button), so reduced-motion users can still watch it.
  if (!reduce) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top 75%',
      end: 'bottom 25%',
      onEnter: tryPlay,
      onEnterBack: tryPlay,
      onLeave: () => { videoEl.pause(); resetChip(); },
      onLeaveBack: () => { videoEl.pause(); resetChip(); },
    });
  }

  // Sound chip: start playback if paused, then toggle mute.
  chip.addEventListener('click', () => {
    if (videoEl.paused) tryPlay();
    videoEl.muted = !videoEl.muted;
    const on = !videoEl.muted;
    chip.textContent = on ? 'SOUND ON' : 'TAP FOR SOUND';
    chip.setAttribute('aria-pressed', String(on));
  });

  syncUI();
}
