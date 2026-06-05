# Game Dev Portfolio Section — Final Prompt V2

---

## WHAT YOU ARE BUILDING

A standalone **game development showcase section** — one self-contained page that will eventually be embedded in a larger portfolio. Single `index.html` file. Hosted on GitHub Pages. All CSS and JS inline. No build tools. No npm. Vanilla HTML/CSS/JS only.

Allowed CDN imports:
- Google Fonts via `<link>`: **Bebas Neue** + **DM Sans**
- GSAP 3 from cdnjs (only if needed for clip-path animation): `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- Nothing else.

No external images. All visuals are CSS gradients. Must work on Chrome and Firefox.

---

## THE CONCEPT

The section should feel like a **game engine's scene viewport** — the visitor is looking at games through the interface of someone who *builds* them. Not a portfolio page. Not a gallery. A cockpit. An environment with infrastructure, atmosphere, and life. Every detail should reinforce: this person operates at a serious level.

---

## BACKGROUND & ATMOSPHERE

### Base background
```css
background:
  radial-gradient(ellipse 80% 40% at 50% -5%, rgba(74, 158, 255, 0.07) 0%, transparent 70%),
  #07070d;
```
`#07070d` is non-negotiable. No grays. No `#1a1a1a`. A true near-black with a barely-there blue tint.

### Dot grid overlay
Behind everything, add a full-section dot grid using a CSS background-image pattern:
```css
background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
background-size: 28px 28px;
```
Place this on a `::before` pseudo-element on the section. The dots are very faint — `0.06` opacity — but give the section a sense of structured space, like graph paper or a game engine grid. They should not be visible at a glance; only noticed on close inspection.

### Noise grain overlay
On top of everything, a `::after` pseudo-element with:
```css
position: fixed; inset: 0; pointer-events: none; z-index: 999;
opacity: 0.022;
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
background-size: 128px 128px;
```
Grain sits over the dot grid and everything else. It unifies all the layers and prevents the gradients from looking digital and flat.

### Floating light orb
Behind the card row specifically, an absolutely positioned div:
- `500px × 500px`, `border-radius: 50%`, `pointer-events: none`
- `background: radial-gradient(circle, rgba(74, 158, 255, 0.05) 0%, transparent 70%)`
- `filter: blur(80px)`
- `animation: orbFloat 10s ease-in-out infinite alternate`
```css
@keyframes orbFloat {
  from { transform: translate(-30px, -15px); }
  to   { transform: translate(30px, 15px); }
}
```
Barely visible. Creates a sense that a light source is slowly drifting behind the cards.

---

## UI INFRASTRUCTURE — THE VIEWPORT FRAME

This is what makes the section feel like an environment rather than a webpage. All of these are purely decorative — thin, low-opacity, discovered rather than announced.

### Corner brackets
Four corner bracket elements, one in each corner of the section:
```
⌐ ¬
L ⌐ (flipped)
```
Implemented as absolutely positioned divs with two borders each (top+left, top+right, bottom+left, bottom+right). Size: `20px × 20px`. Color: `rgba(255,255,255,0.12)`. No fill. These frame the entire section like a camera viewfinder or a game engine's scene editor.

### Status bar (bottom of section)
A fixed-to-section-bottom bar, full width, `40px` tall:
```
[left]  HOVER TO EXPAND  ·  CLICK TO LAUNCH          [right]  4 PROJECTS  ·  2 SHIPPED  ·  1 WIP  ·  1 DEMO
```
Styling:
- `border-top: 1px solid rgba(255,255,255,0.06)`
- Text: `0.6rem`, all caps, `letter-spacing: 0.18em`, `color: rgba(255,255,255,0.2)`
- Left text is the instruction hint. Right text is the project stats.
- No background — fully transparent, just the top border and text.

### Section number with blinking cursor
The `// 003` label at the top of the header should have a blinking `_` cursor appended:
```html
<span class="gd-label">// 003<span class="blink">_</span></span>
```
```css
.blink {
  animation: blink 1.1s step-end infinite;
  color: #4a9eff;
  margin-left: 2px;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
```
This single detail signals "terminal / builder" without being a full terminal interface.

### Active card indicator
Below the card row, a row of 4 small indicators — one per card:
```
—  ·  ·  ·
```
The dash (`—`) marks the currently hovered/expanded card. Dots mark the rest.
- Dash: `14px wide, 2px tall`, `background: #4a9eff`
- Dots: `4px × 4px`, `border-radius: 50%`, `background: rgba(255,255,255,0.2)`
- Transition between states: `300ms`
- Update via JS when hover state changes

---

## LAYOUT

### Grid structure
```
┌──────────────────────────────────────────────────────────┐
│  [corner ⌐]                              [corner ¬]      │
│                                                          │
│  // 003_          │                                      │
│                   │                                      │
│  GAME             │   [card] [card] [card] [card]        │
│  DEV              │                                      │
│                   │                                      │
│  Interactive      │                                      │
│  experiences &    │   · — · ·  (card indicators)        │
│  virtual worlds   │                                      │
│                                                          │
│  [corner L]  HOVER TO EXPAND · CLICK TO LAUNCH  4 PROJECTS · 2 SHIPPED  [corner ⌐]  │
└──────────────────────────────────────────────────────────┘
```

CSS Grid: `grid-template-columns: 280px 1fr`
- Left column: header block (section label, title, subtitle)
- Right column: card row + indicator dots below
- A thin `1px solid rgba(255,255,255,0.05)` vertical divider between columns
- Both columns `align-items: center`
- Section padding: `80px 60px`

Mobile (`< 768px`): single column, title stacks above cards, cards are horizontal-scroll `overflow-x: auto` with `scroll-snap-type: x mandatory`.

---

## TYPOGRAPHY

- **Bebas Neue**: section title (`GAME DEV`), card titles, overlay game title, genre tags
- **DM Sans**: subtitle, taglines, descriptions, metadata, all body text
- Never: Inter, Roboto, Arial, Space Grotesk, system-ui

### Section title
```css
font-size: clamp(4.5rem, 9vw, 10rem);
line-height: 0.9;
letter-spacing: -0.02em;
color: #ffffff;
```

First letter `G` gets a gradient accent:
```css
.gd-title .accent-letter {
  background: linear-gradient(135deg, #4a9eff 0%, #ffffff 55%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```
Barely visible on white. Rewards close inspection.

### Section label (`// 003`)
`0.7rem`, `letter-spacing: 0.2em`, `color: #ff8c42` (the warm accent — used here and almost nowhere else)

### Subtitle
`0.85rem`, DM Sans, `color: rgba(255,255,255,0.35)`, `letter-spacing: 0.05em`

---

## COLOR SYSTEM

**Background:** `#07070d`
**Primary accent (cold):** `#4a9eff` — interactive states, borders, cursor ring, active indicators, the `G` gradient
**Secondary accent (warm):** `#ff8c42` — section label only (`// 003`), used nowhere else
**Text hierarchy:**
- Primary: `rgba(255,255,255,0.92)`
- Secondary: `rgba(255,255,255,0.5)`
- Tertiary / metadata: `rgba(255,255,255,0.28)`
- Whisper: `rgba(255,255,255,0.1)` — for borders and structural lines

The warm accent is precious. Using it on only one element makes it feel intentional. Resist putting it anywhere else.

---

## PROJECT DATA

```js
const projects = [
  {
    id: 0,
    title: "AXIOM BREACH",
    genre: "SCI-FI",
    tagline: "A rogue-like tactical shooter set in a dying space station",
    engine: "Unity", year: "2024", role: "Solo Dev", status: "SHIPPED",
    description: "Built over 6 weeks. Features procedural level generation, a custom AI state machine for enemies, and a shader-based damage visualization system.",
    palette: ["#0d1f3c", "#1a3a6b", "#0a4fa8", "#00d4ff"],
  },
  {
    id: 1,
    title: "VERDANT SIEGE",
    genre: "STRATEGY",
    tagline: "Tower defense in a bioluminescent alien jungle",
    engine: "Unity", year: "2023", role: "Solo Dev", status: "SHIPPED",
    description: "Real-time economy system with hand-authored wave scripting. Focused on juicy visual feedback — every tower hit has a distinct particle effect.",
    palette: ["#0a2010", "#1a4a20", "#2d7a3a", "#39ff6e"],
  },
  {
    id: 2,
    title: "ASHFALL",
    genre: "NARRATIVE",
    tagline: "A short first-person experience about the last city",
    engine: "Unreal", year: "2024", role: "Environment + Dev", status: "DEMO",
    description: "Environment-focused narrative piece exploring Unreal's Lumen GI — every scene uses fully dynamic lighting, zero baked lightmaps.",
    palette: ["#2a1a0a", "#5c3010", "#c86020", "#ff8c42"],
  },
  {
    id: 3,
    title: "NULLSPACE",
    genre: "PUZZLE",
    tagline: "Gravity doesn't exist here. Neither do walls.",
    engine: "Godot", year: "2025", role: "Solo Dev", status: "WIP",
    description: "Spatial puzzle game in Godot 4 exploring non-euclidean geometry through gameplay — portals, gravity flipping, and impossible spaces.",
    palette: ["#1a0a2e", "#3d1a6b", "#7c3fcf", "#b060ff"],
  }
];
```

---

## CARDS — DEFAULT STATE

**Dimensions:** `240px wide × 360px tall`, `border-radius: 10px`

**Background:** Layered CSS gradients from each project's palette:
```css
/* Example for card 0 */
background:
  radial-gradient(ellipse 40% 30% at 70% 25%, rgba(255,255,255,0.07) 0%, transparent 60%),  /* specular */
  radial-gradient(ellipse at 30% 65%, [palette[2]] 0%, transparent 55%),
  radial-gradient(ellipse at 75% 20%, [palette[3]]33 0%, transparent 45%),
  linear-gradient(160deg, [palette[1]] 0%, [palette[0]] 100%);
background-size: 100% 100%;
background-position: 50% 50%;
```
The first layer is always the specular highlight (white, semi-transparent ellipse at top-right). Gives every card a sense of physical surface with a light source.

**Border:** `1px solid rgba(255,255,255,0.07)`
**Inner shadow:** `box-shadow: inset 0 0 50px rgba(0,0,0,0.45), 0 20px 60px rgba(0,0,0,0.4)`

**Genre tag (top-right):**
- `position: absolute; top: 12px; right: 12px`
- `background: rgba(0,0,0,0.55)`, `backdrop-filter: blur(8px)`
- `border: 1px solid rgba(255,255,255,0.1)`
- `border-radius: 3px`, `padding: 3px 8px`
- Text: `0.55rem`, Bebas Neue, `letter-spacing: 0.15em`

**Bottom scrim + title:**
- `position: absolute; bottom: 0; left: 0; right: 0`
- `background: linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)`
- `padding: 20px 16px 18px`
- Title: Bebas Neue, `1.5rem`, `letter-spacing: 0.03em`, white

**Idle breathe animation:**
```css
.gd-card:not(.hovered):not(.expanded) {
  animation: cardBreathe 7s ease-in-out infinite;
}
@keyframes cardBreathe {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-5px); }
}
.gd-card:nth-child(2) { animation-delay: -1.75s; }
.gd-card:nth-child(3) { animation-delay: -3.5s; }
.gd-card:nth-child(4) { animation-delay: -5.25s; }
```
5px float over 7 seconds. Each card offset so they don't move in sync — organic, not mechanical.

**Mouse parallax on gradients:**
```js
section.addEventListener('mousemove', (e) => {
  const rect = section.getBoundingClientRect();
  const mx = (e.clientX - rect.left) / rect.width - 0.5;
  const my = (e.clientY - rect.top) / rect.height - 0.5;
  cards.forEach((card, i) => {
    const d = 0.5 + i * 0.18;
    card.style.backgroundPosition = `${50 + mx * 10 * d}% ${50 + my * 10 * d}%`;
  });
});
```
Each card shifts its gradient by a slightly different amount — creates a parallax depth illusion, like each card is a lit box at a different distance.

---

## CARDS — HOVER / EXPANDED STATE

### Trigger
On `mouseenter`: add class `.hovered` (stops breathe animation). On `mouseleave` of the whole card row: remove `.hovered` and `.expanded`.

### Horizontal expand
```css
.gd-card { flex: 0 0 240px; transition: flex-basis 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94); }
.gd-card.hovered { flex: 0 0 420px; }
```
Flexbox handles sibling compression automatically. Don't manually resize other cards.

### Revealed content (the extra 180px)
Inside the card, a `.gd-card-reveal` div:
- Sits to the right of the cover art area
- `opacity: 0` by default → `opacity: 1` with `transition-delay: 320ms` after expand begins
- Contains:
  - A `1px solid rgba(74, 158, 255, 0.4)` left border (the accent divider line)
  - Tagline: DM Sans, `0.82rem`, `opacity: 0.65`, max 2 lines, left-aligned, padding `16px`
  - Metadata line: `ENGINE · YEAR · ROLE` — `0.6rem`, all caps, `letter-spacing: 0.14em`, `color: rgba(255,255,255,0.28)`
  - A rotated title watermark on the far right edge: Bebas Neue, `0.9rem`, `opacity: 0.12`, `writing-mode: vertical-rl`, `transform: rotate(180deg)` — like a book spine
  - `LAUNCH →` button at bottom:
    - No fill background
    - `border: 1px solid rgba(74, 158, 255, 0.45)`
    - `padding: 6px 14px`, `border-radius: 3px`
    - Text: `0.58rem`, tracked caps, `color: rgba(74, 158, 255, 0.8)`
    - On hover: border and text go full opacity, `box-shadow: 0 0 14px rgba(74, 158, 255, 0.25)`

### Card hover glow
On `.hovered`:
```css
box-shadow:
  inset 0 0 50px rgba(0,0,0,0.45),
  0 0 0 1px rgba(74, 158, 255, 0.3),
  0 30px 80px rgba(0,0,0,0.5);
```
A thin blue outline appears around the active card. Subtle.

---

## FULL-SCREEN TAKEOVER — LAUNCH SEQUENCE

### Phase 1 — Flash (0–180ms)
A `position: fixed; inset: 0` div, `background: white`, animates:
`opacity: 0 → 0.12 → 0` over 180ms. A brief screen flash like booting a game.

### Phase 2 — Overlay expand (180–600ms)
Full-screen overlay using `clip-path` animation:
- Start: `inset(Y1% X1% Y2% X2%)` — matching the clicked card's bounding box (compute via `getBoundingClientRect()`)
- End: `inset(0% 0% 0% 0%)`
- The overlay background uses the same gradient palette as the clicked card, filling the screen with that game's world color
- Easing: `cubic-bezier(0.76, 0, 0.24, 1)` — aggressive ease-in-out, fast then hard stop

### Phase 3 — Content stagger (600ms–1400ms)
Two-column layout inside the overlay:

**Left column (55% width) — content:**
Each element stagger-reveals (80ms apart, `translateY(20px) opacity:0 → 0`):
1. Genre tag — same style as card tag
2. Game title — `clamp(4rem, 7vw, 8rem)`, Bebas Neue, tight line-height
3. Tagline — `1.05rem`, DM Sans, `opacity: 0.6`
4. `1px solid rgba(255,255,255,0.08)` horizontal rule
5. Description — `0.9rem`, DM Sans, `opacity: 0.7`, max `360px` wide, comfortable line-height `1.7`
6. Metadata: `ENGINE · YEAR · ROLE · STATUS` — same typographic style as cards
7. Button row:
   - `▶ PLAY DEMO` — primary button: `background: rgba(74,158,255,0.15)`, `border: 1px solid rgba(74,158,255,0.6)`, on hover fills more
   - `⌥ SOURCE` — secondary: ghost button same style as `LAUNCH →`
   - Spacing between: `12px`

**Right column (45% width) — art panel:**
- Full height of the overlay
- Same gradient as the card but larger, more dramatic
- Specular highlight much larger: `radial-gradient(ellipse 60% 50% at 65% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)`
- Slow ambient animation: `background-position` shifts from `40% 40%` to `60% 60%` over `14s ease-in-out infinite alternate`
- Left border: `1px solid rgba(74, 158, 255, 0.2)`
- A very faint dot grid overlaid on this panel too (same `0.06` opacity pattern)

**Close button (top-right, `position: fixed`):**
```
  ×
 ESC
```
- The `×` is `1.4rem`, DM Sans light weight
- `ESC` is `0.5rem`, all caps, `letter-spacing: 0.15em`, `opacity: 0.5` — styled to look like a keyboard key hint
- On hover: `×` rotates `45deg` (smooth), border appears around the whole button
- Also triggers on `Escape` keydown

**Backdrop:**
When overlay is open, apply `filter: blur(6px) brightness(0.4)` to the main section behind it.

### Phase 4 — Close (reverse)
- Content fades out: `200ms`
- Clip-path reverses back to card's original bounding box: `400ms`
- Flash again briefly
- `.hovered` and `.expanded` removed from card

---

## CUSTOM CURSOR

`cursor: none` on the entire section. Two elements: `.gd-cursor-dot` and `.gd-cursor-ring`. Both `position: fixed`, `pointer-events: none`, `z-index: 9999`.

**State 1 — Default (inside section):**
- Dot: `6px × 6px`, `border-radius: 50%`, `background: rgba(255,255,255,0.9)`, centered via `transform: translate(-50%,-50%)`
- Ring: `32px × 32px`, `border-radius: 50%`, `border: 1px solid rgba(255,255,255,0.25)`, no fill
- Ring uses lerp in `requestAnimationFrame`:
```js
let rx = 0, ry = 0, mx = 0, my = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  rx += (mx - rx) * 0.10;
  ry += (my - ry) * 0.10;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
```

**State 2 — Hovering a card:**
Toggle class `.cursor-hover`:
- Dot: `opacity: 0`, `transform: translate(-50%,-50%) scale(0)`
- Ring: grows to `52px × 52px`, `border-color: rgba(74, 158, 255, 0.85)`
- A tiny `+` appears centered in the ring: `position: absolute`, `font-size: 0.5rem`, `color: rgba(74,158,255,0.7)`
- Transition: `300ms cubic-bezier(0.34, 1.56, 0.64, 1)` — the slight spring on scale-up only

**State 3 — On click:**
Toggle class `.cursor-click` for `200ms`:
- Ring momentarily scales to `72px` then returns
- Ring opacity briefly goes full `1` then back

Hide both elements when mouse leaves the section.

---

## SCROLL REVEAL

Use `IntersectionObserver` with `{ threshold: 0.15, once: true }`.

**Phase 1 — Header (on trigger):**
- `// 003_` label: `translateX(-12px) opacity:0 → 0` — `300ms`, ease-out
- `GAME` word: `translateY(35px) opacity:0 → 0` — `500ms`, `delay: 80ms`, `cubic-bezier(0.16, 1, 0.3, 1)`
- `DEV` word: same — `delay: 180ms`
- Subtitle: `opacity:0 → 1` — `delay: 380ms`
- Vertical divider line between columns: scaleY from `0 → 1`, `transform-origin: top`, `delay: 200ms`

**Phase 2 — Cards (starts at `delay: 480ms` from trigger):**
- Each card: `translateY(55px) scaleY(0.9) opacity:0 → natural`
- Stagger: `90ms` between cards
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- The `scaleY(0.9)` start gives a satisfying "place on table" physical feel

**Phase 3 — UI infrastructure (delay: 800ms):**
- Corner brackets fade in: `opacity: 0 → 1`, `600ms`
- Status bar fades in: `opacity: 0 → 1`, `delay: 900ms`
- Active indicator dots fade in: `delay: 1000ms`

---

## SELF-CHECK BEFORE DELIVERING

Run through every item. Fix before output:

1. ☐ Background is `#07070d` or darker — no grays
2. ☐ Dot grid is visible (faintly) on the section background
3. ☐ Corner brackets exist in all four corners
4. ☐ Status bar exists at the bottom with project count stats
5. ☐ `// 003_` has a blinking cursor in warm accent color
6. ☐ Active card indicator row exists below cards
7. ☐ Card titles are pinned to the bottom with a scrim — not floating mid-card
8. ☐ Cards have specular highlights (white radial at top-right)
9. ☐ Idle breathe animation is active and staggered
10. ☐ Mouse parallax on card gradients is working
11. ☐ Hover expand uses flexbox — adjacent cards compress, not disappear
12. ☐ Revealed content has: accent divider, tagline, metadata text, spine watermark, LAUNCH button
13. ☐ LAUNCH button has no fill — ghost border only
14. ☐ Metadata is plain text with `·` separators — no boxy badges
15. ☐ Full-screen takeover is two-column (content left, art panel right)
16. ☐ Launch sequence has flash → clip-path expand → staggered content
17. ☐ Close button shows `×` + `ESC` label, rotates on hover
18. ☐ Escape key closes the overlay
19. ☐ Custom cursor has 3 states (default, hover, click)
20. ☐ Scroll reveal has 3 phases — header, cards, UI infrastructure
21. ☐ Warm accent (`#ff8c42`) is used ONLY on the `// 003` label, nowhere else
22. ☐ No Inter, Roboto, Arial, or system font used anywhere
23. ☐ No boxy rectangular badge components anywhere
24. ☐ No purple gradient on a white/light background anywhere

---

## THINGS THAT MUST NOT APPEAR

- Pixel fonts or retro CRT scanlines
- Boxy colored badge pills for metadata
- Single-column full-screen overlay (must be two-column)
- Static idle state (must have breathe + orb + parallax)
- Stacked header-then-cards layout (must be side-by-side grid)
- Gray background of any kind
- Inter, Roboto, Space Grotesk, or system fonts
- Heavy glows on everything (glow is used surgically — cursor ring on hover, LAUNCH button on hover, active card outline — nowhere else)
- Bouncy easing on anything except the cursor ring scale-up

---

*Final V2 — game dev section prompt. May 2026.*
