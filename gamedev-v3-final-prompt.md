# Game Dev Portfolio Section — V3 Prompt
## "Professional Game Studio Interface"

---

## WHAT YOU ARE BUILDING

A standalone game development showcase section. Single `index.html`. All CSS and JS inline. GitHub Pages compatible. No build tools, no npm, no frameworks.

**Allowed CDN imports only:**
- Google Fonts: `Bebas Neue` + `DM Sans`
- GSAP 3.12.2 from cdnjs (for clip-path animation)
- Nothing else — no icon libraries, no sound libraries, no jQuery

**No external images. No external audio files.** All visuals are CSS gradients. All sounds are synthesized via the Web Audio API inline in JS.

Must work on Chrome and Firefox. Single `index.html` output.

---

## THE CONCEPT

The section should feel like the **main menu of a professionally shipped game** — the kind of interface you'd encounter when booting up a cinematic indie title. Every element responds to interaction with sound, motion, and visual feedback. The visitor feels like a player navigating a game's UI, not a recruiter reading a webpage.

Three layers of craft:
1. **Visual** — cinematic dark, layered atmospheric depth, HUD infrastructure
2. **Sound** — every interaction has a distinct synthesized audio response
3. **Motion** — everything moves with physical weight, nothing pops in instantly

---

## FOUNDATION: BACKGROUND & ATMOSPHERE

### Base
```css
background:
  radial-gradient(ellipse 90% 50% at 50% -10%, rgba(74, 158, 255, 0.08) 0%, transparent 65%),
  #07070d;
```

### Dot grid (on `section::before`)
```css
background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
background-size: 28px 28px;
pointer-events: none;
```

### Noise grain (on `section::after`, fixed, z-index 999)
```css
opacity: 0.025;
background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
background-size: 128px 128px;
```

### Ambient orb (behind card row)
A `500×500px` div, `border-radius: 50%`, `pointer-events: none`:
```css
background: radial-gradient(circle, rgba(74,158,255,0.05) 0%, transparent 70%);
filter: blur(90px);
animation: orbFloat 12s ease-in-out infinite alternate;
```
```css
@keyframes orbFloat {
  from { transform: translate(-40px, -20px) scale(1); }
  to   { transform: translate(40px, 20px) scale(1.05); }
}
```

---

## COLOR SYSTEM

| Role | Value | Used where |
|---|---|---|
| Background | `#07070d` | Base only |
| Primary accent (cold blue) | `#4a9eff` | Interactive states, borders, cursor, indicators |
| Secondary accent (warm amber) | `#ff8c42` | `// 003` label ONLY |
| Success / confirm | `#39d98a` | Status badges "SHIPPED" only |
| Warning / WIP | `#ffbe3d` | Status badges "WIP" / "DEMO" only |
| Text — primary | `rgba(255,255,255,0.92)` | Headings |
| Text — secondary | `rgba(255,255,255,0.50)` | Body |
| Text — tertiary | `rgba(255,255,255,0.25)` | Metadata, hints |
| Structural lines | `rgba(255,255,255,0.07)` | Borders, dividers |

Warm amber appears exactly once. Do not use it anywhere else.

---

## TYPOGRAPHY

- **Bebas Neue** — section title, card titles, overlay title, genre tags, all-caps labels
- **DM Sans** — all body text, taglines, descriptions, metadata
- Never: Inter, Roboto, Arial, system-ui, Space Grotesk

---

## LAYOUT

CSS Grid, two columns:
```css
display: grid;
grid-template-columns: 300px 1fr;
align-items: center;
gap: 0;
padding: 80px 64px;
min-height: 100vh;
```

Left column: header block. Right column: card area + everything below cards.

A `1px solid rgba(255,255,255,0.05)` vertical line separates the two columns — full height of the section.

**Mobile (`< 768px`):** Single column. Title stacks above cards. Cards are `overflow-x: auto` with `scroll-snap-type: x mandatory`. Each card `scroll-snap-align: start`.

---

## LEFT COLUMN: HEADER BLOCK

### Section label
```html
<span class="gd-label">// 003<span class="gd-blink">_</span></span>
```
- `0.68rem`, `letter-spacing: 0.2em`, color: `#ff8c42`
- Blinking underscore: `animation: blink 1.1s step-end infinite`
- `@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`

### Title
```html
<h2 class="gd-title"><span class="gd-accent-letter">G</span>AME<br>DEV</h2>
```
- `font-size: clamp(5rem, 9vw, 10rem)`, `line-height: 0.88`, `letter-spacing: -0.02em`
- `.gd-accent-letter`:
  ```css
  background: linear-gradient(135deg, #4a9eff 0%, #ffffff 55%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  ```

### Subtitle
- `0.82rem`, DM Sans, `rgba(255,255,255,0.32)`, `letter-spacing: 0.04em`
- Text: "Interactive experiences & virtual worlds"

### Social / link buttons (below subtitle)
Three small ghost buttons in a column: `ITCH.IO`, `GITHUB`, `LINKEDIN`

Design per button:
- `border: 1px solid rgba(255,255,255,0.12)`
- `background: rgba(255,255,255,0.03)`
- `backdrop-filter: blur(4px)`
- `border-radius: 4px`
- `padding: 7px 16px`
- Font: DM Sans, `0.65rem`, all caps, `letter-spacing: 0.14em`, `rgba(255,255,255,0.5)`
- Width: `100px`, left-aligned column with `gap: 8px`

On hover:
- `border-color: rgba(74,158,255,0.5)`
- `color: rgba(255,255,255,0.9)`
- `background: rgba(74,158,255,0.07)`
- Transition: `200ms`
- **Sound:** play `sounds.uiClick()` (defined below)

Each button has a small icon to its left (SVG inline, 10×10px, same color as text):
- ITCH.IO → gamepad icon (simple 2-path SVG)
- GITHUB → circle with a dot (simplified octocat shape or just a circle-branch SVG)
- LINKEDIN → `in` square (simple rect + text SVG)

These SVG icons are hand-coded inline, minimal paths. Do not use any icon library.

---

## RIGHT COLUMN: CARD AREA

### Card row
```css
display: flex;
flex-direction: row;
gap: 14px;
align-items: flex-end;
```

### Individual cards (default state)
- `flex: 0 0 220px`
- `height: 340px`
- `border-radius: 10px`
- `position: relative`, `overflow: hidden`
- `cursor: pointer`

**Background** (layered gradients from project palette):
```css
background:
  radial-gradient(ellipse 40% 28% at 72% 22%, rgba(255,255,255,0.08) 0%, transparent 55%),  /* specular */
  radial-gradient(ellipse at 35% 70%, [palette[2]] 0%, transparent 55%),
  radial-gradient(ellipse at 78% 25%, [palette[3]]44 0%, transparent 45%),
  linear-gradient(155deg, [palette[1]] 0%, [palette[0]] 100%);
background-size: 100% 100%;
background-position: 50% 50%;
transition: background-position 0.1s linear;
```

**Border + shadow:**
```css
border: 1px solid rgba(255,255,255,0.08);
box-shadow: inset 0 0 50px rgba(0,0,0,0.45), 0 24px 64px rgba(0,0,0,0.45);
```

**Genre tag (top-right):**
```css
position: absolute; top: 11px; right: 11px;
background: rgba(0,0,0,0.6);
backdrop-filter: blur(10px);
border: 1px solid rgba(255,255,255,0.1);
border-radius: 3px;
padding: 3px 9px;
font: Bebas Neue, 0.58rem, letter-spacing: 0.16em;
```

**Status badge (top-left) — NEW:**
```css
position: absolute; top: 11px; left: 11px;
border-radius: 3px;
padding: 3px 8px;
font: DM Sans, 0.55rem, all caps, letter-spacing: 0.1em;
```
- SHIPPED → `background: rgba(57,217,138,0.15)`, `border: 1px solid rgba(57,217,138,0.4)`, `color: #39d98a`
- WIP → `background: rgba(255,190,61,0.12)`, `border: 1px solid rgba(255,190,61,0.35)`, `color: #ffbe3d`
- DEMO → `background: rgba(74,158,255,0.12)`, `border: 1px solid rgba(74,158,255,0.35)`, `color: #4a9eff`

**Bottom scrim + title:**
```css
position: absolute; bottom: 0; left: 0; right: 0;
background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 45%, transparent 100%);
padding: 18px 15px 16px;
```
- Title: Bebas Neue, `1.45rem`, white, `letter-spacing: 0.02em`

**Idle breathe:**
```css
.gd-card:not(.hovered):not(.expanded) {
  animation: breathe 7s ease-in-out infinite;
}
@keyframes breathe { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
.gd-card:nth-child(2){animation-delay:-1.75s}
.gd-card:nth-child(3){animation-delay:-3.5s}
.gd-card:nth-child(4){animation-delay:-5.25s}
```

**Mouse parallax on gradients:**
```js
section.addEventListener('mousemove', e => {
  const r = section.getBoundingClientRect();
  const mx = (e.clientX - r.left) / r.width - 0.5;
  const my = (e.clientY - r.top) / r.height - 0.5;
  cards.forEach((c, i) => {
    const d = 0.5 + i * 0.18;
    c.style.backgroundPosition = `${50 + mx*10*d}% ${50 + my*10*d}%`;
  });
});
```

---

## CARD HOVER — HORIZONTAL EXPAND

On `mouseenter` a card, add `.hovered`:
```css
.gd-card { flex: 0 0 220px; transition: flex-basis 380ms cubic-bezier(0.25,0.46,0.45,0.94); }
.gd-card.hovered { flex: 0 0 400px; }
```

Flexbox compresses siblings automatically.

**Revealed content** (`.gd-reveal`, `opacity:0` → `opacity:1` at `transition-delay: 300ms`):
- `1px solid rgba(74,158,255,0.35)` left border (accent divider)
- Tagline: DM Sans, `0.82rem`, `opacity: 0.62`, max 2 lines, padding `16px 14px 0`
- Metadata: `ENGINE · YEAR · ROLE` — `0.6rem`, caps, `letter-spacing: 0.13em`, `rgba(255,255,255,0.28)`
- Spine watermark: title text, Bebas Neue, `0.85rem`, `opacity:0.1`, `writing-mode: vertical-rl`, `transform: rotate(180deg)`, pinned to far right
- `LAUNCH →` ghost button pinned to bottom: `border: 1px solid rgba(74,158,255,0.4)`, `padding: 6px 13px`, `border-radius: 3px`, `0.58rem`, tracked caps
  - On hover: `border-color` full opacity, `box-shadow: 0 0 12px rgba(74,158,255,0.2)`
  - **Sound:** `sounds.uiHover()` on hover, `sounds.uiClick()` on click

**On card hover:**
- `box-shadow` gains outer glow: `0 0 0 1px rgba(74,158,255,0.25)`
- **Sound:** `sounds.cardHover()` — a subtle low-pitched tick

---

## BELOW CARDS: INTERACTIVE UI INFRASTRUCTURE

### Active card indicators
A row of 4 elements below the card row, `gap: 8px`, centered under the cards:

```
[—]  [·]  [·]  [·]
```
- Active (hovered/expanded): `18px × 2px` rectangle, `background: #4a9eff`, `border-radius: 2px`
- Inactive: `5px × 5px` circle, `background: rgba(255,255,255,0.2)`
- Transition between states: `300ms`
- Update via JS on hover change

### Engine filter tabs — NEW
A row of clickable filter tabs above the card row:
```
[ ALL ]  [ UNITY ]  [ UNREAL ]  [ GODOT ]  [ BLENDER ]
```
Design:
- Default: `background: transparent`, `border: 1px solid rgba(255,255,255,0.1)`, `color: rgba(255,255,255,0.35)`
- Active: `background: rgba(74,158,255,0.12)`, `border-color: rgba(74,158,255,0.5)`, `color: rgba(74,158,255,0.9)`
- `padding: 5px 13px`, `border-radius: 3px`, `font: DM Sans 0.6rem`, all caps, tracked
- On click: filter cards — cards for other engines `opacity: 0.25 scale(0.97)`, matching cards stay full opacity
- **Sound:** `sounds.tabSwitch()` on each click
- Transition: `250ms`

---

## HUD FRAME INFRASTRUCTURE

### Corner brackets (4 corners of the section)
Each corner: absolutely positioned div, `20px × 20px`:
```css
/* top-left */
border-top: 1px solid rgba(255,255,255,0.14);
border-left: 1px solid rgba(255,255,255,0.14);
top: 24px; left: 24px;

/* top-right */
border-top: 1px solid rgba(255,255,255,0.14);
border-right: 1px solid rgba(255,255,255,0.14);
top: 24px; right: 24px;

/* bottom-left */
border-bottom: 1px solid rgba(255,255,255,0.14);
border-left: 1px solid rgba(255,255,255,0.14);
bottom: 24px; left: 24px;

/* bottom-right */
border-bottom: 1px solid rgba(255,255,255,0.14);
border-right: 1px solid rgba(255,255,255,0.14);
bottom: 24px; right: 24px;
```

### Status bar (bottom of section, full width)
`height: 38px`, `border-top: 1px solid rgba(255,255,255,0.05)`, transparent background:

Left side text: `HOVER TO EXPAND  ·  CLICK TO LAUNCH`
Right side text: `4 PROJECTS  ·  2 SHIPPED  ·  1 WIP  ·  1 DEMO`

Both: `0.58rem`, all caps, `letter-spacing: 0.17em`, `rgba(255,255,255,0.18)`

### Sound toggle button — NEW
Top-right area of the section (inside corner bracket zone):
```
[🔊] SOUND ON
```
- Small pill button: `border: 1px solid rgba(255,255,255,0.1)`, `padding: 5px 12px`
- `0.58rem`, DM Sans, `rgba(255,255,255,0.3)`
- SVG speaker icon (inline, 10px, simple path)
- On click: toggles `soundEnabled` global boolean, updates label to `SOUND OFF`, icon changes to muted speaker
- **Important:** The first user interaction anywhere on the page initializes `AudioContext` (browser autoplay policy). Sound should be on by default after first interaction.

### Live timestamp — NEW
Bottom-left of the section, above the status bar:
```
SYS  14:32:07
```
Updated every second via `setInterval`. Font: DM Sans, `0.55rem`, `letter-spacing: 0.12em`, `rgba(255,255,255,0.15)`. Feels like a system clock in a game's pause menu.

---

## SOUND SYSTEM — WEB AUDIO API, ZERO EXTERNAL FILES

All sounds synthesized inline. Initialize `AudioContext` lazily on first user gesture.

```js
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;
let soundEnabled = true;

function initAudio() {
  if (!audioCtx) audioCtx = new AudioCtx();
}

// Call initAudio() on the first click/keydown anywhere

const sounds = {

  // Card hover — soft low tick, 30ms
  cardHover() {
    if (!soundEnabled || !audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine'; o.frequency.setValueAtTime(320, audioCtx.currentTime);
    g.gain.setValueAtTime(0.04, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);
    o.start(); o.stop(audioCtx.currentTime + 0.03);
  },

  // UI button click — crisp mid-frequency tap, 40ms
  uiClick() {
    if (!soundEnabled || !audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'square'; o.frequency.setValueAtTime(600, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.04);
    g.gain.setValueAtTime(0.06, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.05);
    o.start(); o.stop(audioCtx.currentTime + 0.05);
  },

  // UI hover — near-silent high tick
  uiHover() {
    if (!soundEnabled || !audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine'; o.frequency.setValueAtTime(900, audioCtx.currentTime);
    g.gain.setValueAtTime(0.025, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.025);
    o.start(); o.stop(audioCtx.currentTime + 0.025);
  },

  // Tab switch — short mid tone with slight pitch drop
  tabSwitch() {
    if (!soundEnabled || !audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'triangle'; o.frequency.setValueAtTime(500, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(380, audioCtx.currentTime + 0.06);
    g.gain.setValueAtTime(0.07, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.08);
    o.start(); o.stop(audioCtx.currentTime + 0.08);
  },

  // Launch — rising two-tone chime, game-boot feeling
  launch() {
    if (!soundEnabled || !audioCtx) return;
    [0, 0.08].forEach((delay, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.type = 'sine';
      const freq = i === 0 ? 440 : 660;
      o.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime + delay);
      g.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + delay + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + delay + 0.18);
      o.start(audioCtx.currentTime + delay);
      o.stop(audioCtx.currentTime + delay + 0.2);
    });
  },

  // Close — reverse of launch, falling tone
  close() {
    if (!soundEnabled || !audioCtx) return;
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    o.type = 'sine'; o.frequency.setValueAtTime(440, audioCtx.currentTime);
    o.frequency.exponentialRampToValueAtTime(220, audioCtx.currentTime + 0.15);
    g.gain.setValueAtTime(0.08, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.18);
    o.start(); o.stop(audioCtx.currentTime + 0.2);
  },

  // Flash — very brief white-noise burst for the screen flash
  flash() {
    if (!soundEnabled || !audioCtx) return;
    const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.04, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = audioCtx.createBufferSource();
    const g = audioCtx.createGain();
    src.buffer = buf; src.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.06, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.04);
    src.start(); src.stop(audioCtx.currentTime + 0.04);
  }
};
```

**Where each sound fires:**
| Event | Sound |
|---|---|
| Card `mouseenter` | `sounds.cardHover()` |
| LAUNCH button hover | `sounds.uiHover()` |
| LAUNCH button click | `sounds.uiClick()` + then `sounds.launch()` after 80ms |
| Social link hover | `sounds.uiHover()` |
| Social link click | `sounds.uiClick()` |
| Filter tab click | `sounds.tabSwitch()` |
| Screen flash (launch sequence) | `sounds.flash()` |
| Overlay close | `sounds.close()` |
| Sound toggle button | `sounds.uiClick()` |

**Never** play `uiHover()` on dense elements like the card row itself — only on deliberate small targets (buttons, tabs). Card hover gets `cardHover()` which is quieter and lower-pitched.

---

## FULL-SCREEN TAKEOVER — LAUNCH SEQUENCE

### Phase 1 — Flash (0–160ms)
`position:fixed; inset:0; background:white; pointer-events:none; z-index:9998`
`opacity: 0 → 0.1 → 0` over 160ms. Play `sounds.flash()` at start.

### Phase 2 — Overlay expand (160–560ms)
`position:fixed; inset:0; z-index:9997; overflow:hidden`
Background: same gradient palette as clicked card (set dynamically from project data).

Animate using `clip-path`:
- Start: `inset(Y1% X1% Y2% X2%)` — from card's `getBoundingClientRect()` converted to viewport percentages
- End: `inset(0% 0% 0% 0%)`
- Duration: `400ms`, `cubic-bezier(0.76, 0, 0.24, 1)`

Play `sounds.launch()` at start of Phase 2.

### Phase 3 — Content stagger (560ms–1400ms)
**Two-column layout inside overlay:**

Left column (`52%`): content
Right column (`48%`): art panel

**Left column — stagger each element in (80ms apart, `translateY(18px) opacity:0 → 0`):**

1. Genre tag (same style as card tag, `0.6rem`)
2. Status badge (SHIPPED/WIP/DEMO, same style as card badge)
3. Game title — `clamp(4rem, 6.5vw, 7.5rem)`, Bebas Neue, tight `line-height: 0.88`
4. Tagline — `1.05rem`, DM Sans, `opacity: 0.58`
5. `1px solid rgba(255,255,255,0.07)` horizontal rule
6. Description — `0.9rem`, DM Sans, `opacity: 0.68`, `line-height: 1.72`, `max-width: 400px`
7. **Tech stack icon row — NEW:**
   A row of small labeled icons, each showing a tool used:
   ```
   [⬡ Unity]  [◈ C#]  [▣ Blender]
   ```
   Each "icon" is a small inline SVG (10×10px, simple geometric shape unique per tool) + label in `0.6rem` caps. Row `gap: 14px`.
   Colors: icons in `rgba(74,158,255,0.6)`, labels in `rgba(255,255,255,0.35)`.
   These are purely decorative geometric SVGs — not real brand logos.

8. Stats row — NEW:
   ```
   [⏱ 6 WEEKS]  [👁 SOLO]  [★ SHIPPED]
   ```
   Each stat: small icon + value. Same design language as tech stack row but slightly larger text (`0.65rem`). Icons are simple inline SVGs.

9. Button row:
   - `▶ PLAY DEMO` — `background: rgba(74,158,255,0.14)`, `border: 1px solid rgba(74,158,255,0.55)`, `padding: 10px 22px`, `border-radius: 4px`, `0.7rem`, tracked caps
     - On hover: background to `rgba(74,158,255,0.22)`, `box-shadow: 0 0 20px rgba(74,158,255,0.2)`
     - **Sound:** `sounds.uiClick()` on hover — wait, use `sounds.uiHover()` on hover, `sounds.uiClick()` on click
   - `⌥ VIEW SOURCE` — ghost button same width, same height, `border: 1px solid rgba(255,255,255,0.15)`, transparent fill
     - On hover: border `rgba(255,255,255,0.35)`

**Right column — art panel:**
- Full height of viewport
- Gradient from project palette, much more saturated and dramatic than card version
- Specular: `radial-gradient(ellipse 65% 55% at 60% 28%, rgba(255,255,255,0.12) 0%, transparent 55%)`
- Ambient animation: `background-position` shifts `40% 40% → 60% 60%` over `16s ease-in-out infinite alternate`
- `border-left: 1px solid rgba(74,158,255,0.15)`
- Faint dot grid overlaid (same pattern, `0.04` opacity)

**Overlay HUD elements — NEW:**
- Top-left inside overlay: small `// PROJECT_0X` label (project index), same style as section label
- Bottom-left inside overlay: `PREV ←` and `→ NEXT` navigation — cycle between projects without closing
  - DM Sans, `0.62rem`, caps, `rgba(255,255,255,0.3)`
  - On hover: `rgba(255,255,255,0.7)`
  - On click: transition content within the overlay (fade out content, change data, fade back in — 300ms total)
  - **Sound:** `sounds.tabSwitch()` on PREV/NEXT

**Close button (top-right, `position:fixed`, `z-index:9999`):**
```html
<button class="gd-close">
  <span class="gd-close-x">×</span>
  <span class="gd-close-esc">ESC</span>
</button>
```
- `×`: `1.3rem`, DM Sans light
- `ESC`: `0.48rem`, caps, `letter-spacing:0.12em`, `opacity:0.45` — looks like a keyboard key hint
- On hover: `×` rotates `45deg` over `250ms`, border appears
- Keyboard: `Escape` key closes and plays `sounds.close()`
- **Sound:** `sounds.close()` on click

### Phase 4 — Close
1. Content fades: `200ms`
2. `clip-path` reverses to card origin: `350ms`
3. Flash briefly
4. Return card row to normal

Backdrop during open: `filter: blur(5px) brightness(0.35)` on section behind overlay.

---

## CUSTOM CURSOR

`cursor: none` on section. Two elements: `.gd-dot` (6px) and `.gd-ring` (32px). Both `position:fixed`, `pointer-events:none`, `z-index:9999`.

**State 1 — Default:**
- Dot: white, `border-radius:50%`, follows mouse exactly
- Ring: `border:1px solid rgba(255,255,255,0.22)`, lag via lerp `0.10`

**State 2 — Card hover:**
- Dot: `opacity:0 scale(0)`
- Ring: `52px`, `border-color: rgba(74,158,255,0.8)`
- Inside ring: tiny `+` character, `0.5rem`, centered, `color: rgba(74,158,255,0.65)`
- Transition: `280ms cubic-bezier(0.34,1.56,0.64,1)` (spring on scale only)

**State 3 — Button hover:**
- Dot: `opacity:0`
- Ring: `40px`, `border-color: rgba(255,255,255,0.45)`
- No `+` inside

**State 4 — Click:**
Ring scales to `68px` then returns, `180ms`. Ring briefly fully opaque.

Hide both on `mouseleave` from section.

---

## SCROLL REVEAL (IntersectionObserver, `threshold: 0.12`, `once: true`)

**Phase 1 — Header (on trigger):**
- `// 003_`: `translateX(-10px) opacity:0` → `0` — `280ms` ease-out
- `GAME` word: `translateY(30px) opacity:0` → `0` — `480ms delay:80ms cubic-bezier(0.16,1,0.3,1)`
- `DEV` word: same — `delay:170ms`
- Subtitle: `opacity:0` → `1` — `delay:350ms`
- Column divider: `scaleY(0)→1` from top, `delay:220ms`
- Social buttons: stagger in, `opacity:0 translateX(-8px)` → `0`, `delay:500ms,560ms,620ms`

**Phase 2 — Tabs + cards (delay 450ms from trigger):**
- Filter tabs: `opacity:0 translateY(-8px)` → `0`, stagger `50ms` each
- Each card: `translateY(55px) scaleY(0.9) opacity:0` → natural
- Stagger: `85ms` between cards, easing `cubic-bezier(0.16,1,0.3,1)`

**Phase 3 — HUD infrastructure (delay 800ms):**
- Corner brackets: `opacity:0` → `0.14`, all 4 simultaneously, `600ms`
- Status bar: `opacity:0` → `1`, `delay:900ms`
- Indicator dots: `opacity:0` → `1`, `delay:1000ms`
- Live clock: starts ticking at `delay:1100ms`

---

## PROJECT DATA

```js
const projects = [
  {
    id: 0, index: '01',
    title: "AXIOM BREACH",
    genre: "SCI-FI",
    tagline: "A rogue-like tactical shooter set in a dying space station",
    engine: "Unity", year: "2024", role: "Solo Dev", status: "SHIPPED",
    duration: "6 WEEKS",
    tech: ["Unity", "C#", "HLSL"],
    description: "Features procedural level generation, a custom AI state machine for enemies, and a shader-based damage visualization system. Playable on itch.io.",
    palette: ["#0d1f3c","#1a3a6b","#0a4fa8","#00d4ff"],
  },
  {
    id: 1, index: '02',
    title: "VERDANT SIEGE",
    genre: "STRATEGY",
    tagline: "Tower defense in a bioluminescent alien jungle",
    engine: "Unity", year: "2023", role: "Solo Dev", status: "SHIPPED",
    duration: "4 WEEKS",
    tech: ["Unity", "C#", "VFX Graph"],
    description: "Real-time economy system with hand-authored wave scripting. Focused on juicy visual feedback — every tower impact has a distinct particle effect.",
    palette: ["#0a2010","#1a4a20","#2d7a3a","#39ff6e"],
  },
  {
    id: 2, index: '03',
    title: "ASHFALL",
    genre: "NARRATIVE",
    tagline: "A short first-person experience about the last city",
    engine: "Unreal", year: "2024", role: "Environment + Dev", status: "DEMO",
    duration: "8 WEEKS",
    tech: ["Unreal 5", "Blueprints", "Lumen"],
    description: "Environment-focused narrative piece exploring Lumen GI — every scene uses fully dynamic lighting with zero baked lightmaps.",
    palette: ["#2a1a0a","#5c3010","#c86020","#ff8c42"],
  },
  {
    id: 3, index: '04',
    title: "NULLSPACE",
    genre: "PUZZLE",
    tagline: "Gravity doesn't exist here. Neither do walls.",
    engine: "Godot", year: "2025", role: "Solo Dev", status: "WIP",
    duration: "ONGOING",
    tech: ["Godot 4", "GDScript", "Shaders"],
    description: "Spatial puzzle game exploring non-euclidean geometry through gameplay — portals, gravity flipping, and impossible architectural spaces.",
    palette: ["#1a0a2e","#3d1a6b","#7c3fcf","#b060ff"],
  }
];
```

---

## SELF-CHECK — COMPLETE BEFORE DELIVERING

Run every item. Fix if false.

**Foundation**
- ☐ Background is `#07070d` — no grays
- ☐ Dot grid visible (faintly) on background
- ☐ Noise grain overlay present
- ☐ Ambient orb animating behind cards

**Layout**
- ☐ Two-column CSS Grid (header left, cards right)
- ☐ Vertical divider line between columns
- ☐ Mobile: single column + horizontal scroll cards

**Header**
- ☐ `// 003_` has blinking cursor in `#ff8c42`
- ☐ First letter `G` has blue→white gradient
- ☐ Three social ghost buttons with inline SVG icons
- ☐ Warm amber used ONLY on `// 003` label

**Cards**
- ☐ Status badge (SHIPPED/WIP/DEMO) top-left of every card
- ☐ Genre tag top-right
- ☐ Title pinned to bottom with scrim
- ☐ Specular highlight on every card
- ☐ Idle breathe animation, staggered
- ☐ Mouse parallax on gradients

**Card hover**
- ☐ Horizontal expand via flexbox
- ☐ Revealed content: divider, tagline, metadata text, spine watermark, LAUNCH button
- ☐ Revealed content fades in AFTER expand completes
- ☐ No boxy badge pills anywhere

**Sound**
- ☐ AudioContext initialized on first user gesture
- ☐ Sound toggle button exists (top-right area)
- ☐ `cardHover()` fires on card mouseenter
- ☐ `uiHover()` fires on LAUNCH/button hover
- ☐ `uiClick()` fires on link/button click
- ☐ `tabSwitch()` fires on filter tab click
- ☐ `launch()` fires on card click (Phase 2)
- ☐ `flash()` fires on screen flash
- ☐ `close()` fires on overlay close + Escape key

**Filter tabs**
- ☐ ALL / UNITY / UNREAL / GODOT / BLENDER tabs present
- ☐ Clicking filters cards visually (dimmed vs full opacity)
- ☐ Active tab styled distinctly

**Overlay**
- ☐ Two-column (content left, art right)
- ☐ Phase 1 flash → Phase 2 clip-path expand → Phase 3 stagger → Phase 4 close
- ☐ Tech stack icon row in overlay
- ☐ Stats row in overlay
- ☐ PREV / NEXT navigation in overlay
- ☐ Close button shows `×` + `ESC` hint, rotates on hover
- ☐ Escape key closes overlay
- ☐ Background behind overlay blurred

**HUD infrastructure**
- ☐ Corner brackets in all 4 corners
- ☐ Status bar at bottom (instruction + project count)
- ☐ Active card indicator dots below cards
- ☐ Live clock (updates every second)

**Cursor**
- ☐ 4 cursor states implemented
- ☐ Ring lerp is smooth
- ☐ Cursor hides on mouseleave from section

**Scroll reveal**
- ☐ 3 phases: header → cards → HUD
- ☐ `scaleY(0.9)` start on cards
- ☐ Triggers once only

**Quality**
- ☐ No Inter, Roboto, Arial, system-ui fonts
- ☐ No purple gradient on white anywhere
- ☐ No bouncy easing anywhere except cursor ring scale
- ☐ No boxy rectangular badge pills
- ☐ Warm accent `#ff8c42` used only on `// 003`
- ☐ Everything works without a server (open `index.html` directly)

---

## THINGS THAT MUST NOT APPEAR

- Gray backgrounds of any value
- External audio files (`.mp3`, `.ogg`, `.wav`)
- External icon libraries (Font Awesome, Heroicons, Lucide, etc.)
- Pixel fonts, CRT scanlines, retro aesthetics
- Boxy colored badge pills for metadata
- Single-column overlay layout
- Bouncy/elastic easing on anything except cursor ring
- Heavy purple gradients on dark backgrounds (the AI default)
- Static idle state with no animation
- Lorem ipsum text

---

*V3 Final — Game Dev Portfolio Section. May 2026.*
