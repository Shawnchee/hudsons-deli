# Hudson's Deli — Design Specification
**One-page marketing site · Vite + vanilla JS · GSAP + ScrollTrigger + Lenis**
Source of truth for facts/copy: `brand-research.md`. All image paths relative to `public/`.

---

## 1. Art direction & concept

**Concept, one line:** *"The Living Poster"* — the site is Hudson's vintage Reuben poster brought to life: parchment paper, letterpress ink, starbursts and stamps, animated by the real rhythm of the deli — the slicer, the grill press, the Vespa.

**Mood adjectives:** hand-set · appetizing · warm · a little cheeky.

The aesthetic north star is `images/poster-reuben.jpg`: cream parchment, brick-red and navy letterpress type, arched headlines, starbursts, an "EST. 2019" corner mark, a "MADE WITH h EVERY DAY" badge and the "GOOD FOOD GOOD MOOD" smiley seal. The site borrows that poster's *grammar* — arched SVG headlines, circular rotating badges, serrated "sandwich-paper" section edges, hard offset shadows, ink hairlines, paper grain — and applies it with modern restraint: generous whitespace, a strict grid, fast type, and scroll motion that feels mechanical and physical (stamps, slices, presses) rather than floaty.

**What makes it NOT a generic AI template:**
- No white/#111 default palette — everything sits on parchment `#F4EAD5` with real paper grain.
- No uniform "fade-up on scroll" — every section has a *different*, physically-motivated move (a slice wipe, a stamp, a press, a drive-by).
- Poster devices used literally: an arched `SOUP & SANDWICHES` headline on an SVG textPath, a rotating circular "EST. 2019" badge, serrated ticket edges between sections.
- Portrait 9:16 reel footage embraced, not fought: tall deli-counter cards in a horizontal strip, and the feature video inside a phone frame.
- One running gag: the white Vespa drives across the page on scroll and "parks" in the footer.
- Banned outright: glassmorphism, purple/blue gradients, Inter/Poppins, emoji in UI, floating blob shapes, stock line-icon sets, lorem ipsum.

---

## 2. Color system

Design tokens (CSS custom properties). Day sections run parchment; the **Visit** section and footer shift to a warm-night variant keyed to `storefront-night.jpg` (blue dusk + red lanterns + glowing sign).

| Token | Hex | Role |
|---|---|---|
| `--paper` | `#F4EAD5` | Page background (parchment) |
| `--paper-raised` | `#FBF4E4` | Cards, nav bar fill, menu cards |
| `--paper-deep` | `#EADCBF` | Alternating "aged paper" section bands (Story, Gallery) |
| `--ink` | `#1C2B4A` | Primary text, hairlines, nav — the shopfront navy |
| `--ink-soft` | `#41506E` | Secondary body text, captions |
| `--char` | `#211C18` | Near-black for the heaviest display type only |
| `--brick` | `#B5321E` | Primary accent: key headline words, primary buttons, marquee band, starbursts |
| `--brick-deep` | `#8E2417` | Hover/pressed states of `--brick`, poster frame |
| `--gold` | `#E0A22B` | Secondary accent: badge strokes, active-link underline, "7 Years" counter, stars |
| `--pastrami` | `#C46A6A` | Food-tone tint: card tags, image duotone overlays |
| `--crust` | `#5A3620` | Food-tone deep: menu card numbers, borders on food imagery |
| `--night` | `#101B33` | Warm-night section background (deeper than `--ink`) |
| `--night-raised` | `#18264A` | Cards/rows on night background |
| `--lantern` | `#D8402B` | Night accent (lantern red) — CTAs and highlights on `--night` |
| `--glow` | `#F0B94C` | Night warm glow — sign-glow text accents, hover states on night |

Rules:
- Text on `--paper*`: `--ink` (body) and `--char` (display). Text on `--night*`: `--paper`.
- `--brick` on `--paper` passes AA at display sizes; never set body text in `--brick` or `--gold`.
- **Grain:** a fixed, full-viewport SVG `feTurbulence` noise (data-URI, `background-repeat`), `opacity: 0.05`, `mix-blend-mode: multiply`, `pointer-events: none`. Present on both day and night sections. Never animated.
- **Image grade:** all photos get `filter: saturate(1.06) contrast(1.03)` baked via CSS class `.photo`. Non-food location shots (`storefront-day`, `vespa-grass`, `community-tees`) additionally get a 12%-opacity `--pastrami` overlay (`mix-blend-mode: soft-light`) to unify temperature. Food shots get **no** color overlay — appetite first.

---

## 3. Typography

All Google Fonts. Load via two preconnected `<link>`s, `font-display: swap`. Weights kept minimal for speed.

| Role | Font | Weights | Usage |
|---|---|---|---|
| **Display slab** | **Alfa Slab One** | 400 | Hero headline words, section H2s, counter numbers, footer sign-off. Always uppercase-adjacent (it's unicase-heavy by design). |
| **Condensed caps** | **Oswald** | 500, 600 | Eyebrows, nav links, marquee, menu item names, buttons, labels, badge text. Always `text-transform: uppercase`. |
| **Body humanist** | **Karla** | 400, 700 | All body copy, descriptions, hours, address, form-free microcopy. |
| **Sign-painter script** | **Yellowtail** | 400 | "Good Food, Good Mood" flourishes only — max 3 appearances on the page (hero, poster interlude, footer). Never for information. |

Type scale (rem, fluid):

| Token | Value | Font | line-height | letter-spacing |
|---|---|---|---|---|
| `--fs-hero` | `clamp(3.4rem, 10.5vw, 9.5rem)` | Alfa Slab One | 0.95 | `0` |
| `--fs-h2` | `clamp(2.4rem, 5.5vw, 4.25rem)` | Alfa Slab One | 1.02 | `0` |
| `--fs-h3` | `clamp(1.4rem, 2.4vw, 1.9rem)` | Oswald 600 | 1.15 | `0.02em` |
| `--fs-counter` | `clamp(2.8rem, 5vw, 4.5rem)` | Alfa Slab One | 1 | `0` |
| `--fs-eyebrow` | `0.8125rem` | Oswald 500 | 1.2 | `0.22em` |
| `--fs-body-lg` | `1.1875rem` | Karla 400 | 1.65 | `0` |
| `--fs-body` | `1rem` | Karla 400 | 1.6 | `0` |
| `--fs-caption` | `0.875rem` | Karla 400 | 1.5 | `0.01em` |
| `--fs-script` | `clamp(1.8rem, 4vw, 3.2rem)` | Yellowtail | 1.2 | `0` |

Detail rules:
- Eyebrows always render as: `── EYEBROW TEXT ──` style — a 24px `--gold` rule, 12px gap, Oswald caps, in `--brick` on paper / `--glow` on night.
- H2s mix inks per the poster: e.g. `AN AUSTRIAN IN PENANG,` in `--char` with one payoff word (`PASTRAMI`) in `--brick`.
- Numbers in counters get Oswald 500 unit suffixes at 0.35em size (`YEARS`, `g`, `%`).

Layout constants: 8px spacing base; content max-width `1240px`; 12-col grid, 24px gutters; section vertical padding `clamp(96px, 14vh, 160px)`; card radius `12px`; hairlines `1px solid color-mix(in srgb, var(--ink) 25%, transparent)`.

**Section edges:** parchment↔parchment-deep and parchment↔night transitions use a **serrated ticket edge** — a CSS `mask-image` repeating triangle (12px teeth) on a 24px-tall divider strip, like torn sandwich paper. This is the signature section separator; use it at every background change, never a straight line.

---

## 4. Layout — section by section

Page order: `0 Load → 1 Nav → 2 Hero → 3 Marquee → 4 Story → 5 Menu (horizontal) → 6 Poster interlude → 7 Penang Foodie video → 8 Gallery/Community → 9 Visit (night) → 10 Footer`.

**Photography handling (applies throughout):** the reel stills carry a small "PENANG FOODIE" watermark top-left and some have baked-in caption bands; crop them out with `object-fit: cover` + the `object-position` values given per image below, and credit the source once in Section 7 and once in the footer: *"Film & food photography by @penangfoodie."*

---

### 4.1 Sticky nav

- **Structure:** 88px bar, transparent over parchment, bottom hairline. Left: the "h" seal — until the client supplies the real logo (see asset gaps), a 40px circle, 2px `--ink` stroke, Alfa Slab lowercase "h" centered. Center-left wordmark: `HUDSON'S DELI` Oswald 600, 1rem, ls 0.14em. Right: links `THE STORY · MENU · THE FILM · GALLERY · VISIT` (Oswald 500, 0.8125rem, ls 0.18em) + primary button `FIND US`.
- **Scrolled state** (>80px): height 64px, background `color-mix(in srgb, var(--paper-raised) 88%, transparent)` + `backdrop-filter: blur(8px)`, hairline persists. Over Section 9/10 (night) the bar swaps to `--night` tint with `--paper` text (toggled by a ScrollTrigger class).
- Anchor links smooth-scroll via Lenis `scrollTo`.
- **Mobile:** seal + burger. Burger opens a full-screen parchment overlay: links set in Alfa Slab One `clamp(2.2rem, 9vw, 3.4rem)`, stacked left-aligned; hours + phone in Karla at the bottom; a small Vespa doodle bottom-right.

### 4.2 Hero — "the counter"

- **Purpose:** land the claim in 2 seconds: best Reuben in Malaysia, Austrian-run, real person slicing real meat.
- **Composition:** 100svh (min 640px). Asymmetric split — left 7 cols type, right 5 cols a full-bleed-to-edge portrait panel of `images/hero-owner-slicing.jpg` (container `aspect-ratio: 3/4`, `object-position: center 42%` to crop the baked caption bands; rounded 12px, 1px `--ink` hairline, hard offset shadow `8px 8px 0 var(--ink)`).
- **Copy:**
  - Eyebrow: `── THE NEIGHBOURHOOD DELI · TANJUNG BUNGAH, PENANG ──`
  - H1, three stacked lines: `HOME OF` (char) / `THE BEST REUBEN` (`REUBEN` in `--brick`) / `IN MALAYSIA` (char). `--fs-hero`, tight stack.
  - Yellowtail overlay, rotated −4°, overlapping the H1 baseline right edge, in `--brick`: *"Good Food, Good Mood"*
  - Subline (Karla, `--fs-body-lg`, `--ink-soft`): *"Austrian-run. Hand-sliced. Pressed to order since 2019."*
  - Buttons: primary `SEE THE MENU` (anchors to §4.5), secondary `FIND US →` (anchors to §4.9).
- **Poster devices:** a 120px rotating circular-text badge pinned to the image panel's top-left corner overlap: `HUDSON'S DELI ★ EST. 2019 ★ TANJUNG BUNGAH ★` around a small `--gold` star. Two small `--brick` starburst SVGs punctuate the whitespace (top-right of H1, bottom-left of subline). Bottom-center: `SCROLL` in Oswald 500 11px ls 0.3em above a 32px vertical rule.

### 4.3 Marquee divider

Full-bleed `--brick` band, rotated −2°, slightly wider than viewport (`width: 104vw; margin-left: -2vw`), padding 18px 0. One row, Oswald 600 `clamp(1.1rem, 2vw, 1.5rem)` ls 0.14em, `--paper` text, ★ separators (`--gold`):
`PASTRAMI ★ THE REUBEN ★ GOULASH SOUP ★ HOUSE-ROASTED LAMB ★ SOPRESSA ★ MILANO ★ PANCETTA ★ GORGONZOLA ★ GOOD FOOD, GOOD MOOD ★` (repeat).

### 4.4 The Story — "An Austrian in Penang"

- **Background:** `--paper-deep`, serrated edges top and bottom.
- **Composition:** 12-col. Left 5 cols: copy block. Right 7 cols: two overlapping photos — `images/food-beef-slicing.jpg` (large, `aspect-ratio: 4/5`, `object-position: center 55%`) and `images/owners-storefront.jpg` (smaller, `aspect-ratio: 4/3`, overlapping the first's bottom-left corner by ~15%, rotated 2°, hard shadow). Below the copy, a 4-up counter row spanning all 12 cols.
- **Copy:**
  - Eyebrow: `── EST. 2019 · STILL SLICING ──`
  - H2: `AN AUSTRIAN IN PENANG,` / `SLICING PASTRAMI` (`PASTRAMI` in `--brick`) / `BY HAND.`
  - Body (Karla `--fs-body-lg`): *"Hudson's Deli is Christian Heidenreich's love letter to the European deli counter — meats brined, roasted and sliced by his own two hands in Tanjung Bungah. Around 150 grams of house-roasted beef goes into a sandwich. The lamb is roasted in-house. The spicy sauce is homemade. No franchises, no freezer aisle — just a neighbourhood deli, and the good mood that follows."*
  - Caption under the small photo (Karla `--fs-caption`, `--ink-soft`): *"Christian and partner, out front on Jalan Chan Siew Teong."*
- **Counters** (Alfa Slab `--fs-counter` in `--char`, labels Oswald 500 caps `--ink-soft`):
  1. `7 YEARS` — *the neighbourhood's deli*
  2. `150 g` — *house-roasted beef per sandwich*
  3. `98 %` — *recommend it (and they're right)*
  4. `1` — *white Vespa, non-negotiable* (the `1` is accompanied by a 28px Vespa doodle)

### 4.5 Signature menu — "Soup & Sandwiches" (pinned horizontal strip)

- **Purpose:** the food, presented like a walk along the deli counter.
- **Header (before the pin):** centered arched headline — `SOUP & SANDWICHES` set on an SVG `textPath` arc (rise ≈ 9% of width), Alfa Slab, `--brick`, exactly echoing the poster. Below it, Karla `--fs-body-lg` centered: *"House-roasted meats, imported cured classics, and the sandwich that made the neighbourhood talk."* Plus a right-aligned Oswald label: `DRAG / SCROLL →`
- **The strip:** a pinned viewport-height section; a flex row of six tall cards (card width `clamp(300px, 34vw, 420px)`, height ~72vh, gap 32px) scrubs horizontally. Cards: `--paper-raised`, 12px radius, hairline border, hard shadow `6px 6px 0 var(--ink)`. Card anatomy top-to-bottom: photo (68% height, radius top only), then a rule, then number + name + description.
  Numbers `01–05` in Alfa Slab `--crust`, small `--gold` star after the hero card's number.

| # | Name (Oswald 600) | Description (Karla) | Image(s) |
|---|---|---|---|
| 01★ | **THE REUBEN** — tag chip `THE HERO` in `--pastrami` | *"The one they cross the island for. House-cured pastrami piled high, sauerkraut, melted cheese and our homemade spicy sauce, pressed until it gives in. Home of the best Reuben in Malaysia — we put it on the poster."* | `images/food-plated.jpg` (`object-position: center 45%`) |
| 02 | **SMOKED BEEF PANINI** | *"Smoked beef and melting cheese, striped on the grill until the crust crackles."* | `images/food-panini-grill.jpg` (`object-position: center 62%`) |
| 03 | **GOULASH SOUP** | *"The Austrian in the room. Slow-simmered beef, paprika and potatoes — Vienna, by way of the tropics."* | `images/food-goulash.jpg` (`object-position: center 60%`) |
| 04 | **FROM THE COUNTER** | *"Sopressa & Milano salami, pancetta, gorgonzola from Italy — sliced to order, stacked to travel."* | Split-image card: `images/food-salami.jpg` over `images/food-gorgonzola.jpg`, stacked 60/40 |
| 05 | **THE HOUSE ROASTS** | *"Pastrami, roast beef and lamb, roasted in-house and carved off the counter you're standing at."* | Split-image card: `images/food-lamb.jpg` over `images/food-deli-case.jpg`, stacked 60/40 |
| — | **End-cap card** (no photo; `--brick` fill, `--paper` text) | Alfa Slab: `MADE WITH h EVERY DAY` + Karla line *"Full menu and prices at the counter — come hungry."* + button `FIND US →` (inverted: paper fill, brick text) | — |

- Under the strip: a slim progress gauge — a 2px `--ink` track with a `--brick` fill and a small circular "slicer dial" knob that traverses as the strip scrubs.

### 4.6 Poster interlude — "the north star, framed"

- **Purpose:** show the actual brand art; the moment the site admits what it's been imitating.
- **Composition:** `--paper` background, generous 20vh padding. Centered: `images/poster-reuben.jpg` at `min(520px, 82vw)` wide, inside a 10px `--brick-deep` frame + 1px `--gold` inner keyline, hard shadow `12px 12px 0 var(--ink)`. To its left, vertically-centered small copy block (3 cols):
  - Eyebrow: `── THE HOUSE ART ──`
  - Karla `--fs-body`: *"The poster hangs in the shop and rides on the totes. Cream paper, brick ink, one very good sandwich."*
  - Yellowtail line in `--brick`, −3°: *"Good Food, Good Mood"*
- A "MADE WITH h EVERY DAY" circular badge (SVG, `--ink` on `--gold`) stamps over the frame's bottom-right corner (see motion §5.6).

### 4.7 The film — Penang Foodie feature

- **Background:** `--char` → this is a *dark* palate-cleanser section (not the night navy yet): background `#211C18`, text `--paper`, serrated edges.
- **Composition:** split. Left 5 cols copy; right 7 cols the video, portrait 720×1280, presented inside a minimal "phone" frame: 16px radius outer `--paper` hairline, 8px padding, height ~78vh, centered. `<video>` uses `src="video/penangfoodie-feature.mp4"`, `poster="images/video-poster.jpg"`, `muted playsinline loop preload="none"`.
- **Copy:**
  - Eyebrow (in `--gold`): `── AS SEEN ON PENANG FOODIE ──`
  - H2 (`--paper`): `825,000 STOMACHS` / `FOLLOW @PENANGFOODIE.` / `THIS SENT THEM HERE.` (`HERE` in `--gold`)
  - Body (Karla, `--paper` at 80%): *"Sixty-seven seconds of slicing, pressing and one very photogenic goulash. Filmed at the counter, no acting required."*
  - Credit row: `FEATURED BY @PENANGFOODIE ↗` — Oswald 500 caps link → `https://www.instagram.com/p/Da62tnuTt1C/`, `--gold` underline on hover. Sub-caption: *"Film & food photography by @penangfoodie — reproduced with love."*
  - Sound chip overlaying the phone frame bottom: `TAP FOR SOUND` (Oswald, pill, `--paper`/`--char`), toggles mute.

### 4.8 Gallery / Community — "The corner of Chan Siew Teong"

- **Background:** `--paper-deep`, serrated edges. This is also the **Vespa drive-by** section (§5.8).
- **Header:** Eyebrow `── THE NEIGHBOURHOOD ──`; H2: `A DELI, A VESPA,` / `AND THE REGULARS.`; body: *"Navy awning, jars on the shelves, a wall of knives, and the white Vespa out front. The regulars wear the t-shirt. Literally."*
- **Composition:** a 2-row offset masonry of five photo cards (varying spans, all hairline + hard-shadow framed, captions in Karla `--fs-caption` beneath each):
  1. `images/storefront-vespa.jpg` — wide, `aspect-ratio: 16/10`, `object-position: top` (**crops the baked-in text in the source's bottom third**). Caption: *"The shopfront on Jalan Chan Siew Teong."*
  2. `images/storefront-day.jpg` — square. Caption: *"Open Tuesday to Sunday, 11 till 6."*
  3. `images/vespa-grass.jpg` — 4/5 portrait. Caption: *"The mascot, off duty."*
  4. `images/merch-tote.jpg` — square. Caption: *"The tote — poster art included."*
  5. `images/community-tees.jpg` — wide 3/2. Caption: *"Regulars in uniform."*
- Bottom strip: a low road — 2px `--ink` dashed line across the section's full width, on which the animated Vespa rides (see §5.8).

### 4.9 Visit — warm-night mode shift

- **Background:** `--night` with the grain overlay; text `--paper`. Serrated edge in. This is the mood shift: dusk, lanterns, glowing sign.
- **Composition:** split. Left 6 cols: `images/storefront-night.jpg` full-height card (`aspect-ratio: 4/5`, radius 12, hairline in `--glow` at 30%). Right 6 cols: the info stack.
- **Copy:**
  - Eyebrow (`--glow`): `── FIND THE GLOWING SIGN ──`
  - H2 (`--paper`): `COME HUNGRY.` / `LEAVE IN A` / `GOOD MOOD.` (`GOOD MOOD.` in `--glow`)
  - Info rows (each: Oswald 500 caps label in `--glow` + Karla value in `--paper`, separated by 30%-opacity hairlines):
    - `ADDRESS` — *103, Jalan Chan Siew Teong, Bandar Tanjung Bungah, Penang, Malaysia* + link `OPEN IN MAPS ↗`
    - `HOURS` — *Tuesday – Sunday, 11am – 6pm · Closed Monday*
    - `CALL` — *016-213 8344* (tel: link)
    - `EMAIL` — *Christian@pnchospitalityservices.com* (mailto:)
    - `GOOD TO KNOW` — three chip badges: `DINE IN` · `OUTDOOR SEATING` · `IN-STORE COLLECTION`, plus a plain Karla note: *Non-Halal · ££*
  - Primary CTA (lantern variant): `CALL THE DELI` — `--lantern` fill, `--paper` text.

### 4.10 Footer

- **Background:** continues `--night`, top hairline (no serration — the night flows into it).
- **Composition, top to bottom:**
  1. Full-width Yellowtail sign-off, `clamp(3rem, 9vw, 7.5rem)`, `--glow`: *"Good Food, Good Mood."*
  2. A reprise of the marquee at 60% scale, static (no band, just a single `--paper`-at-40% Oswald line with ★ separators).
  3. Three columns — (a) the "h" seal + `HUDSON'S DELI · THE NEIGHBOURHOOD DELI · EST. 2019`; (b) anchor links (same five as nav); (c) socials: `FACEBOOK ↗` `INSTAGRAM ↗` + *"Part of PNC Hospitality Services — pnchospitalityservices.com"*.
  4. Legal line, Karla `--fs-caption` at 50% opacity: *"© 2019–2026 Hudson's Deli, Penang · Non-Halal · Film & food photography by @penangfoodie"*.
  5. Bottom-right corner: the little Vespa SVG, parked at a slight angle next to a `--glow` map-pin dot — the end of its journey down the page.

---

## 5. Motion & parallax spec

**Global setup**
- Lenis: `new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })`, driven from `gsap.ticker` (`lenis.raf(time * 1000)`), `gsap.ticker.lagSmoothing(0)`. `ScrollTrigger.update` on Lenis `scroll` event.
- All animation is **transform + opacity + clip-path only**. No animated filters, no animated box-shadows (fake shadow lifts by translating the card off a static pseudo-element shadow). `will-change` applied only while a tween is active (`onStart`/`onComplete` toggles).
- Wrap everything in `gsap.matchMedia()`: `(prefers-reduced-motion: reduce)` gets **no** pins, no scrubs, no parallax, no marquee loop, no autoplaying video — only 0.3s opacity fades at `start: "top 80%"`. `(pointer: coarse)` disables cursor follower and magnetic buttons.
- Default entrance ease: `power4.out`. Default "stamp/impact" ease: `back.out(2.5)` for scale-ins, followed by a 4px 2-cycle shake (`x: [-4, 3, 0]`, 0.18s) for heavy stamps.
- Headline reveals use GSAP **SplitText** (free since 3.13): split into lines, each line wrapped in an `overflow: hidden` mask; animate `yPercent: 110 → 0`, `duration: 0.9`, `stagger: 0.08`.

### 5.0 Page-load choreography (no preloader)

Parchment + grain paint instantly (background is CSS — never a white flash). Then one timeline, total ≈ 1.15s, starting on `DOMContentLoaded`:
1. `0.00s` — nav: seal scales in `0.6 → 1` `back.out(2)`; links + CTA fade/slide down `y: -12 → 0`, stagger `0.05`.
2. `0.10s` — hero eyebrow: rule scales `scaleX: 0 → 1` (origin left), text fades in.
3. `0.20s` — H1 SplitText line reveal (3 lines, stagger 0.09). The word `REUBEN` additionally "over-inks": starts `--char`-colored, crossfades to `--brick` via an overlaid clone fading in at `0.75s`.
4. `0.55s` — hero image panel clip-reveal: `clip-path: inset(100% 0 0 0)` → `inset(0)`, `1.0s power4.inOut`, inner `<img>` counter-scales `1.3 → 1`.
5. `0.70s` — Yellowtail script "writes on": masked `clip-path: inset(0 100% 0 0)` → `inset(0)`, `0.7s power2.inOut`.
6. `0.85s` — starbursts pop `scale: 0 → 1, rotate: -30° → 0` `back.out(3)`, stagger 0.08; rotating badge fades in and begins its infinite spin; `SCROLL` cue fades up last.

### 5.1 Nav

- Scrolled state: GSAP `to` on a ScrollTrigger at `start: 80`, toggling height/background/blur via a `.is-scrolled` class (CSS transition 0.35s) — not tweened per-frame.
- **Hide/reveal:** on Lenis `direction === 1` past 400px → `yPercent: -110, 0.4s power3.out`; `direction === -1` → back to 0. Never hides while the §5.5 pin is active (check `ScrollTrigger.isActive`).
- Active-section link: a 2px `--gold` underline `scaleX` slides between links (FLIP-style measure, 0.35s `power3.inOut`), driven by section ScrollTriggers with `onToggle`.
- Night-mode swap: a ScrollTrigger on §4.9 (`start: "top 64"`) toggles `.nav--night`.
- Mobile menu: overlay clip-reveals from the top (`inset(0 0 100% 0)` → 0, 0.5s `power4.inOut`); links SplitText-stagger in; burger's two bars rotate into an X (0.3s).

### 5.2 Hero scroll-out + parallax

- Mouse parallax (desktop only): starbursts and the badge drift ±10px, image panel ±4px, opposite sign, lerped at 0.08 — subtle, on `mousemove` over the hero only.
- Scroll parallax (scrub `true`, trigger hero, `start: "top top"`, `end: "bottom top"`): H1 `yPercent: 0 → -18`; image panel `yPercent: 0 → -8` with inner img `scale: 1 → 1.08`; starbursts `yPercent: -30` and `rotate: +25`; badge `rotate` gets an extra +90° on top of its idle spin. Whole hero `opacity: 1 → 0.4` over the last 30%.
- Badge idle: infinite `rotate: 360°, 60s, linear`. On scroll, add Lenis velocity to its `timeScale` (`1 + |velocity| / 60`, clamped ≤ 3, lerped back to 1).

### 5.3 Marquee

- Two duplicated content spans, `xPercent: 0 → -100`, `40s linear repeat: -1`.
- **Velocity-reactive:** `timeScale` target = `1 + |lenis.velocity| / 50` (clamp 1–4), lerp 0.1; direction never flips (keeps it calm).
- Paused via `IntersectionObserver` when off-screen.

### 5.4 Story

- H2: SplitText line reveal at `start: "top 72%"`.
- Body copy: single fade + `y: 24 → 0`, 0.8s, 0.1s after H2.
- **Photo parallax (the classic, done properly):** both images scrub (`scrub: 0.6`) at different rates over the section — large photo `yPercent: 6 → -6`, small overlapping photo `yPercent: 12 → -12` and `rotate: 2° → 3.5°`. Each image also clip-reveals on entry: large from `inset(0 0 100% 0)` (top-down — like a slicer pass), small from `inset(0 100% 0 0)` (left-right), both 1.0s `power4.inOut`, 0.15s apart.
- **Counters:** at `start: "top 70%"`, `once: true`. Each number tweens from 0 (`snap: 1` for integers; `150` counts by 5s; `98` by 1s) over 1.4s `expo.out`, stagger 0.12; unit suffixes fade in after. The Vespa doodle on counter 4 does a tiny `x: -8 → 0` scoot with a 2° tilt. Labels fade up beneath.

### 5.5 Menu — pinned horizontal scrub (the centerpiece)

- Arched headline entrance: the SVG textPath animates `startOffset` from `-8%` → `0%` while chars fade in along the arc (stagger 0.02), triggered `top 70%`.
- **Pin:** container pinned; scrub timeline `x: 0 → -(track.scrollWidth - window.innerWidth)`, `end: () => "+=" + (track.scrollWidth - window.innerWidth)`, `scrub: 0.5`, `anticipatePin: 1`, `invalidateOnRefresh: true`.
- **Card choreography** (all with `containerAnimation` triggers):
  - Entrance: as each card enters the right edge (`start: "left 95%"` in container-animation space) it settles from `y: 40, rotate: 1.5°, opacity: 0.4` → neutral, 0.6s.
  - Inner-image parallax: each photo `xPercent: -8 → 8` across the card's traversal of the viewport (scrubbed) — the "looking past the counter glass" effect.
  - As a card crosses viewport center: its number **stamps** (`scale: 1.5 → 1, opacity: 0 → 1, back.out(2.5)` + micro-shake) and the name does a fast SplitText char rise (stagger 0.015). The Reuben card's ★ spins 360° once.
  - End-cap card: the `--brick` panel's `MADE WITH h EVERY DAY` line writes on via clip, and its button gets the magnetic treatment.
- Progress gauge: `scaleX` of the `--brick` fill maps 1:1 to the scrub; the dial knob translates along the track and rotates 720° over the full traverse (a slicer dial).
- **Drag:** the strip is also pointer-draggable (translate the same proxy; fling with `power2.out` decay); cursor follower shows `DRAG`.

### 5.6 Poster interlude — pinned zoom + stamp

- Pin the section for `+=160%`, scrub 0.6:
  - `0 → 60%`: poster scales `0.72 → 1`, `rotate: -4° → 0`, its hard shadow's parent offset `4px → 12px` (translate trick); the side copy fades in at 30%.
  - `60 → 75%`: hold (poster at rest) — the beat of looking at it.
  - `75 → 90%`: the `MADE WITH h EVERY DAY` badge **stamps** onto the corner: `scale: 1.8 → 1, opacity: 0 → 1` over 8% of scroll with `back.out(3)` feel (piecewise keyframes since it's scrubbed), plus a 3px shake of the whole frame at impact.
  - `90 → 100%`: everything eases `yPercent: -4` preparing the exit.
- The Yellowtail line writes on (clip left→right) during the hold.

### 5.7 The film

- Section background is dark; entering it, the serrated edge acts as the wipe. H2 SplitText per usual, `--gold` word last.
- **Phone frame:** enters with `rotate: 3° → 0, y: 60 → 0, opacity 0 → 1`, 0.9s `power4.out`. Then a scrubbed idle parallax: frame `yPercent: 4 → -4` across the section.
- **Playback logic:** ScrollTrigger `start: "top 40%", end: "bottom 60%"`; `onEnter/onEnterBack: video.play()` (muted), `onLeave/onLeaveBack: video.pause()`. Poster `images/video-poster.jpg` shows until first play. `TAP FOR SOUND` chip toggles `muted`; when unmuted, chip swaps to `SOUND ON` and gets a 2px `--gold` ring; leaving the section re-mutes.
- Cursor follower over the phone: `SOUND` (or `PLAY` before first entry).
- Credit link hover: underline `scaleX` 0→1 origin-left, 0.3s; `↗` nudges `x:2, y:-2`.

### 5.8 Gallery + the Vespa drive-by

- Masonry cards: batch-reveal via `ScrollTrigger.batch` — `clip-path: inset(8% 8% 8% 8% round 12px)` → `inset(0 round 12px)` + `y: 32 → 0`, 0.8s, stagger 0.1. Inner images scale `1.15 → 1` in sync.
- **Depth parallax:** cards scrub at alternating rates — odd cards `yPercent: 5 → -5`, even cards `yPercent: 10 → -10` (`scrub: 0.8`). Captions lag their card by `yPercent: 2` extra — a subtle paper-layered feel.
- **THE VESPA:** an inline SVG scooter (~90px, white body, `--ink` outline, `--brick` seat — traced from the mascot, simple 3-path illustration) rides the dashed road at the section's bottom. Scrubbed to the section (`start: "top bottom", end: "bottom top"`): `x: -15vw → 115vw`. Wheels `rotate` proportionally to x-distance; body bobs `y: ±2px` sine at ~6 bumps per viewport-width; on scroll-direction flip the Vespa flips `scaleX` after an 80ms delay (it turns around — the gag rewards playful scrolling). A tiny dust-puff (two 4px circles, opacity pulse) trails when |velocity| is high.
- Hover on any gallery card: image `scale: 1 → 1.06` (0.6s `power3.out`), card lifts `translate: -4px -6px` off its static shadow; caption's leading dash extends.

### 5.9 Visit (night)

- Crossing into the section, the nav swaps to night (§5.1). The serrated edge sells the cut; no fancy background transition needed — the palette does the work.
- `storefront-night.jpg` clip-reveals bottom-up (`inset(100% 0 0 0)` → 0, 1.1s `power4.inOut`) with inner scale `1.2 → 1`; then scrubs `yPercent: 4 → -4`.
- H2 SplitText; `GOOD MOOD.` line lands last and its `--glow` color arrives via clone-crossfade (like the hero's REUBEN).
- Info rows: stagger in `y: 20 → 0, opacity 0 → 1`, 0.08 stagger; each hairline `scaleX: 0 → 1` origin-left, 0.6s, synced with its row.
- Chips pop `scale: 0.9 → 1` `back.out(2)`, stagger 0.06.
- `CALL THE DELI` is magnetic (§6) and pulses its static glow pseudo-element (opacity 0.6→1, 2.4s ease-in-out yoyo — the lantern breathing; opacity-only, cheap).

### 5.10 Footer

- Yellowtail sign-off writes on with a scrubbed clip (`inset(0 100% 0 0)` → 0 across `start: "top 90%", end: "top 40%"`) — the sign-painter finishing the wall as you arrive.
- Columns fade up, stagger 0.08, `once: true`.
- The parked Vespa: arrives `x: -60 → 0` with a decelerating `power4.out` 0.8s, then a single headlight blink (a 6px `--glow` dot, opacity 0→1→0, 0.4s) 0.5s after it parks. It never loops.

---

## 6. Components & interaction details

**Buttons — "stamp" system.** Rect, 6px radius, Oswald 600 caps 0.875rem ls 0.12em, padding 16px 28px.
- *Primary:* `--brick` fill, `--paper` text, static pseudo-shadow `4px 4px 0 var(--ink)`. Hover: button translates `-2px -2px` (shadow appears to grow), fill → `--brick-deep`; label does a roll (two stacked labels in an overflow-hidden span, `yPercent: 0→-100`, 0.35s `expo.out`). Active: translates `+4px +4px` onto the shadow (a physical press). Night variant: `--lantern` fill.
- *Secondary:* transparent, 2px `--ink` border, `--ink` text, same shadow/hover mechanics; hover fills `--ink` with `--paper` text.
- **Magnetic** (primary CTAs only, `pointer: fine`): within a 1.4× padded hitbox, button lerps toward cursor ±10px max (lerp 0.25), label ±4px extra; snap back with `elastic.out(1, 0.4)`, 0.6s.

**Cursor follower** (desktop only): a 10px `--ink` dot + trailing 28px 1px-ring, lerp 0.15. Context states — over links/buttons: ring scales 1.4 and tints `--brick`; over menu strip: ring becomes a 56px `--paper-raised` disc labeled `DRAG` (Oswald 11px); over gallery cards: `VIEW`; over the video: `PLAY`/`SOUND`. Native cursor stays visible (`cursor: auto`) — the follower is decoration, never a replacement.

**Menu cards:** hover lifts card `-4px -6px` off its static shadow, photo scales 1.05, number tints `--brick`. Whole card is a no-op link area for now (menu is at the counter — no fake "order online").

**Marquee:** as §5.3; a11y `aria-hidden="true"` with a visually-hidden static sentence for screen readers.

**Rotating badges:** pure SVG `<textPath>` on a circle; idle CSS `rotate` animation (60s), GSAP only modulates `timeScale`. Reused in hero (EST. 2019) and poster interlude (MADE WITH h).

**Serrated edge:** one reusable `.serrated` element: `height: 24px; mask: url(#zigzag) / conic zigzag via repeating-linear-gradient` triangle mask, colored by the section it introduces. Ship as a tiny inline SVG mask, 12px tooth pitch.

**Links:** underline `scaleX` 0→1 origin-left 0.3s; external links append `↗` that nudges on hover.

**Focus states:** every interactive element gets a 2px `--gold` offset outline (`outline-offset: 3px`) — visible on `:focus-visible` only. The stamp shadow never substitutes for focus.

---

## 7. Responsive notes (breakpoints: 1024 / 768 / 480)

- **Hero:** below 768px, stacks — eyebrow, H1, script, image panel (full-width, `aspect-ratio: 4/5`), subline, buttons (full-width, stacked). Mouse parallax off; scroll parallax halved; the rotating badge shrinks to 88px and moves to the image's top-right.
- **Menu strip:** below 1024px the **pin is dropped entirely** — the track becomes a native `overflow-x: auto` scroll-snap carousel (`scroll-snap-type: x mandatory`, cards `scroll-snap-align: center`, width `78vw`, height 64vh). Card stamps fire via `IntersectionObserver` at 60% visibility instead of containerAnimation. Progress gauge maps to `scrollLeft`. Arched headline stays (it scales with width).
- **Poster interlude:** below 768px, no pin — poster simply clip-reveals + scales `0.9 → 1` on entry (`scrub` off, one 1.1s tween); badge stamps 0.4s after. Copy moves below the poster.
- **The film:** phone frame centers at `min(70vw, 340px)` width; copy above it. Autoplay-in-view logic unchanged (it's cheap and mobile-native for muted video).
- **Story/Gallery parallax:** amplitudes halved below 768px (`yPercent` ±3/±5); overlap layout in Story becomes stacked with the small photo inset-overlapping by 24px only.
- **Vespa:** survives on mobile (it's one transform) — reduced to 64px, dust puffs off.
- **Counters:** 4-up → 2×2 grid below 768px.
- **Visit:** stacks image-then-info below 1024px; info rows full-width.
- **Nav:** burger below 900px (§4.1). Hide-on-scroll disabled below 768px (bars are small; jitter risk).
- **Cursor follower + magnetic:** `pointer: coarse` ⇒ never initialized.
- **Type:** clamps handle scale; additionally H1 line 2 (`THE BEST REUBEN`) may wrap — set `text-wrap: balance` on all display headings.
- **Performance floor:** below-fold sections get `content-visibility: auto` with `contain-intrinsic-size` hints; all images `loading="lazy"` + `decoding="async"` except the hero panel; hero image `fetchpriority="high"`. Target: no long tasks > 50ms during scroll on a mid-tier Android.

---

## Appendix A — full asset map (every file, one home)

| File | Section | Treatment |
|---|---|---|
| `images/hero-owner-slicing.jpg` | 4.2 Hero | 3/4 crop, `center 42%` (hides baked captions) |
| `images/food-beef-slicing.jpg` | 4.4 Story | 4/5, `center 55%` |
| `images/owners-storefront.jpg` | 4.4 Story | 4/3 overlap card, +2° |
| `images/food-plated.jpg` | 4.5 Card 01 | `center 45%` |
| `images/food-panini-grill.jpg` | 4.5 Card 02 | `center 62%` (hides watermark) |
| `images/food-goulash.jpg` | 4.5 Card 03 | `center 60%` |
| `images/food-salami.jpg` + `images/food-gorgonzola.jpg` | 4.5 Card 04 | stacked 60/40 |
| `images/food-lamb.jpg` + `images/food-deli-case.jpg` | 4.5 Card 05 | stacked 60/40 |
| `images/poster-reuben.jpg` | 4.6 Interlude | framed, pinned zoom |
| `video/penangfoodie-feature.mp4` + `images/video-poster.jpg` | 4.7 Film | phone frame, muted autoplay in view |
| `images/storefront-vespa.jpg` | 4.8 Gallery | 16/10, `object-position: top` (**crops "CLOSED" overlay in source's bottom third**) |
| `images/storefront-day.jpg`, `images/vespa-grass.jpg`, `images/merch-tote.jpg`, `images/community-tees.jpg` | 4.8 Gallery | masonry |
| `images/storefront-night.jpg` | 4.9 Visit | 4/5, bottom-up reveal |

## Appendix B — asset gaps to chase (from brand-research.md)
1. Clean SVG of the circular "h" seal (nav + badges currently rebuilt as SVG approximations).
2. Un-watermarked hero-grade food photography (esp. a proper Reuben cross-section — Card 01 currently leans on `food-plated.jpg`).
3. A clean wide storefront shot (the current best has a baked-in "CLOSED" notice we crop around).
4. Real menu + prices, and the exact Google Maps embed/coords for §4.9's `OPEN IN MAPS` link.
