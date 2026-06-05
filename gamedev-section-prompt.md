# Prompt: Game Dev Portfolio Section

---

## CONTEXT

You are building a standalone **game development showcase section** for a personal portfolio website. This is not a full site — it is one self-contained section/page that will eventually be embedded into a larger portfolio. It is hosted on **GitHub Pages**, so the output must be a single `index.html` file with all CSS and JS inline or in `<style>` and `<script>` tags. No build tools, no npm, no frameworks. Vanilla HTML/CSS/JS only. You may import fonts from Google Fonts via `<link>` and optionally import GSAP from cdnjs for animations — nothing else.

The person building this is an 18-year-old CS student and builder — not a professional studio. The section should feel like someone with serious taste and technical depth made it, not like a polished corporate product. Raw creative energy, not sanitized.

---

## GOAL

Build a **cinematic, interactive game development showcase section** that functions as follows:

1. On load: an atmospheric section with a title and a horizontal row of tall, portrait-oriented game project cards
2. On hover: a card horizontally expands — pushing adjacent cards aside — revealing additional info in the newly created space
3. On click: a full-screen takeover animates in — like a game launching — showing the full project details
4. On close: reverse animation, return to card grid

Use **3–4 placeholder game projects** with made-up names, fake descriptions, and placeholder visuals (CSS-generated — no external images needed). The placeholder content should feel like real indie games, not "Project 1, Project 2."

---

## VISUAL DIRECTION

### Aesthetic
Cinematic dark. Not retro, not pixel art, not neon-on-black. Think: the website for a serious indie game studio. The visual language of Steam capsule art meets a curated editorial layout. Heavy atmosphere. Things move with weight and intention.

### Background
- Base: `#08080e` — near-black with a very slight blue tint
- Add a CSS noise grain overlay on the entire section using a pseudo-element with an SVG filter or `background-image: url("data:image/svg+xml...")` — subtle grain, not heavy
- Optional: a very faint radial gradient in the center-top of the section in a muted color (like `rgba(80, 40, 120, 0.12)`) to create depth

### Color
Do NOT use a single neon accent. Instead use a **dual-accent system**:
- Primary accent: a cold, desaturated blue — `#4a9eff` or similar
- Secondary accent: a warm highlight — `#ff8c42` or similar
- Use primary for interactive states, hover glows, borders
- Use secondary sparingly — maybe only on the section title or one key detail per card
- Everything else: whites at different opacities (`rgba(255,255,255,0.9)`, `rgba(255,255,255,0.4)`, `rgba(255,255,255,0.15)`) for hierarchy

### Typography
- Display / title font: **Bebas Neue** (Google Fonts) — for the section heading and card titles. Tall, aggressive, unmistakably game-adjacent without being retro.
- Body font: **DM Sans** or **Syne** — clean, slightly geometric, modern. For descriptions and metadata.
- NEVER use Inter, Roboto, Arial, Space Grotesk, or any system font.
- Section title: large, slightly letter-spaced, maybe `clamp(4rem, 8vw, 9rem)` — takes up presence
- Card titles: `1.4rem–2rem` in Bebas Neue
- Metadata (engine, year, role): `0.7rem`, all caps, tracked out, low opacity

### Cards (default state)
- Portrait orientation — roughly `240px wide × 360px tall`
- Each card has a CSS-generated "cover art" background — use `linear-gradient` + `radial-gradient` combinations to create distinct atmospheric color palettes per game (e.g., one is deep red-black for a horror game, one is teal-green for a sci-fi game, one is amber-sand for an adventure game)
- On the card: game title at bottom, one-word genre tag at top-right, subtle inner shadow on all edges to create depth
- Cards sit in a flex row with `gap: 16px`, centered horizontally
- Slight `border: 1px solid rgba(255,255,255,0.06)` on each card

### Cursor
When the mouse enters this section, replace the default cursor with a custom `cursor: none` and a small JS-driven dot + ring follower:
- A small filled circle (6px) that moves exactly with the mouse
- A larger ring (28px) that follows with a slight lag (lerp interpolation in requestAnimationFrame)
- Both disappear when mouse leaves the section
- The ring briefly scales up on hover over interactive elements

---

## INTERACTIONS — THIS IS THE MOST IMPORTANT PART

### 1. Card Hover — Horizontal Expand

When the user hovers a card:
- The hovered card smoothly expands from `240px` to `420px` width
- Adjacent cards compress slightly (reduce their width, don't disappear)
- The expanded space reveals: a larger version of the cover art, the game title in bigger type, a one-line tagline, and a row of metadata badges (Engine, Year, Role)
- A thin `1px` accent-colored border appears on the left edge of the expanded card
- Transition: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` — smooth, weighted, not bouncy
- Timing: `400ms`
- On mouse leave: everything smoothly returns to default

Technical approach: use CSS `flex` with `flex: 0 0 240px` on cards normally, and toggle a `.expanded` class via JS that sets `flex: 0 0 420px`. Let flexbox handle the redistribution of siblings.

### 2. Card Click — Full-Screen Takeover (Game Launch)

When the user clicks an expanded (or any) card:

**Phase 1 — Launch flash (0–200ms):**
- A white or accent-colored flash briefly blooms from the card's position — like a screen flash when a game boots
- Implemented via a fixed overlay div that fades in to `opacity: 0.6` then immediately starts fading out

**Phase 2 — Screen transition (200–600ms):**
- A full-screen overlay (`position: fixed, inset: 0`) slides in from the card's exact position, expanding to fill the screen
- Use the FLIP technique or a simpler approach: animate `clip-path` from `inset(y% x% y% x%)` matching the card's bounding box down to `inset(0% 0% 0% 0%)`
- The overlay uses the same gradient palette as the card's cover art — feels like you're entering the game's world

**Phase 3 — Content reveal (600ms–1200ms):**
Once the overlay fills the screen, content stagger-fades in:
- Game title (huge, Bebas Neue, left-aligned)
- Subtitle / tagline
- A large "cover art" area (right side — CSS gradient, same as card but bigger)
- Metadata row: Engine badge, Year, Role, Status
- Description: 2–3 sentences of placeholder text
- Two buttons: `▶ PLAY DEMO` and `⌥ SOURCE`
- A close button top-right: `✕` with a subtle hover state

**Phase 4 — Close (on ✕ click or Escape key):**
- Content fades out first
- Then clip-path reverses: overlay shrinks back toward the card's origin position
- Flash again briefly
- Card grid returns to normal state

### 3. Section Entry Animation (on scroll into view)

Use `IntersectionObserver` to trigger when the section enters the viewport:
- Section title: slides up from `translateY(40px)` + `opacity: 0` to natural position
- Cards: stagger in from below, each card `80ms` after the previous
  - Start: `translateY(60px) opacity: 0 scale(0.96)`
  - End: natural position
  - Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — fast out, gentle settle
- This only triggers once (use `{ once: true }` on the observer)

### 4. Subtle Ambient Animation (idle state)

While no card is being interacted with:
- A very subtle, slow parallax on the card cover art backgrounds: as the mouse moves across the section, the gradient backgrounds shift position by `±8px` — creates a sense of depth and life
- Implemented via `mousemove` listener on the section, applying `background-position` offset to each card proportional to mouse position

---

## SECTION STRUCTURE (HTML skeleton concept)

```
<section id="gamedev">
  <div class="gd-noise"></div>               <!-- grain overlay -->
  <div class="gd-cursor-dot"></div>          <!-- custom cursor dot -->
  <div class="gd-cursor-ring"></div>         <!-- custom cursor ring -->

  <div class="gd-header">
    <span class="gd-label">// 003</span>     <!-- section number -->
    <h2 class="gd-title">GAME<br>DEV</h2>
    <p class="gd-subtitle">Interactive experiences & virtual worlds</p>
  </div>

  <div class="gd-cards">
    <div class="gd-card" data-id="0"> ... </div>
    <div class="gd-card" data-id="1"> ... </div>
    <div class="gd-card" data-id="2"> ... </div>
    <div class="gd-card" data-id="3"> ... </div>
  </div>

  <div class="gd-overlay" id="gd-overlay">  <!-- full-screen takeover -->
    <button class="gd-close">✕</button>
    <div class="gd-overlay-art"></div>
    <div class="gd-overlay-content"> ... </div>
  </div>

  <div class="gd-flash"></div>               <!-- flash effect -->
</section>
```

---

## PLACEHOLDER PROJECT DATA

Use these 4 fictional projects. They should feel like real indie games:

```js
const projects = [
  {
    id: 0,
    title: "AXIOM BREACH",
    genre: "SCI-FI",
    tagline: "A rogue-like tactical shooter set in a dying space station",
    engine: "Unity",
    year: "2024",
    role: "Solo Dev",
    status: "SHIPPED",
    description: "Built over 6 weeks as a solo project. Features procedural level generation, a custom AI state machine for enemies, and a shader-based damage visualization system. Playable on itch.io.",
    palette: ["#0d1f3c", "#1a3a6b", "#0a4fa8", "#00d4ff"],  // deep space blues
  },
  {
    id: 1,
    title: "VERDANT SIEGE",
    genre: "STRATEGY",
    tagline: "Tower defense in a bioluminescent alien jungle",
    engine: "Unity",
    year: "2023",
    role: "Solo Dev",
    status: "SHIPPED",
    description: "Tower defense mechanics with hand-authored wave scripting and a real-time economy system. Focused on juicy visual feedback — every tower hit has a distinct particle effect.",
    palette: ["#0a2010", "#1a4a20", "#2d7a3a", "#39ff6e"],  // jungle greens
  },
  {
    id: 2,
    title: "ASHFALL",
    genre: "NARRATIVE",
    tagline: "A short first-person experience about the last city",
    engine: "Unreal",
    year: "2024",
    role: "Environment + Dev",
    status: "DEMO",
    description: "Environment-focused narrative piece. Built to explore Unreal's Lumen GI system — every scene is lit entirely with dynamic lighting, no baked lightmaps.",
    palette: ["#2a1a0a", "#5c3010", "#c86020", "#ff8c42"],  // ash and ember
  },
  {
    id: 3,
    title: "NULLSPACE",
    genre: "PUZZLE",
    tagline: "Gravity doesn't exist here. Neither do walls.",
    engine: "Godot",
    year: "2025",
    role: "Solo Dev",
    status: "WIP",
    description: "A spatial puzzle game built in Godot 4. Explores non-euclidean geometry concepts through gameplay — portals, gravity flipping, and impossible spaces.",
    palette: ["#1a0a2e", "#3d1a6b", "#7c3fcf", "#b060ff"],  // deep violet
  }
];
```

Each card's CSS background should be built from its `palette` array — a layered `radial-gradient` and `linear-gradient` combination. Example for card 0:
```css
background:
  radial-gradient(ellipse at 30% 60%, #0a4fa8 0%, transparent 60%),
  radial-gradient(ellipse at 80% 20%, #00d4ff22 0%, transparent 50%),
  linear-gradient(160deg, #1a3a6b 0%, #0d1f3c 100%);
```

---

## TECHNICAL CONSTRAINTS

- **Single file** — all HTML, CSS, JS in one `index.html`
- **No npm, no build step** — must work by opening the file or hosting on GitHub Pages
- **Allowed CDN imports:**
  - Google Fonts via `<link>` (Bebas Neue + DM Sans)
  - GSAP 3 from cdnjs if needed for the clip-path animation: `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js`
- **No external images** — all visuals are CSS gradients
- **Must work on Chrome and Firefox** — don't use Safari-only features
- **Responsive:** Cards section should scroll horizontally on mobile rather than breaking the layout. The full-screen takeover should work on mobile too.
- **Keyboard accessible:** Escape key closes the overlay. Cards should be focusable.
- **Performance:** Do not use heavy `box-shadow` animations — use `filter: drop-shadow` or `opacity` transitions instead. The grain overlay should be a single pseudo-element, not JS-generated.

---

## THINGS TO EXPLICITLY AVOID

- No pixel fonts, no CRT scanlines, no "retro" anything
- No purple gradient on dark background (the single most overused AI-generated aesthetic)
- No glowing neon outlines on everything
- No card designs that look like Tailwind UI components
- No generic sans-serif fonts (Inter, Roboto, Arial, system-ui)
- No bounce easing on any animation — everything moves with weight
- No loading spinner — section should render immediately
- No lorem ipsum — use the placeholder project data provided above

---

## QUALITY BAR

The final result should feel like it took a week to build, not an afternoon. Someone looking at it should think "this person understands visual craft" — not "this person used a template." Every transition should feel physically weighted. Every hover state should feel responsive and alive. The section should be something you'd genuinely want to show in a job interview or to a senior developer, not just to friends.

---

*Prompt version 1.0 — built for Spy's game dev portfolio section, May 2026*
