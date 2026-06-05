import os

html_content = r"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Game Dev — Portfolio</title>
  <meta name="description" content="Game development showcase — interactive experiences and virtual worlds." />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap" rel="stylesheet" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --bg: #07070d;
      --cold: #4a9eff;
      --warm: #ff8c42;
      --success: #39d98a;
      --warning: #ffbe3d;
      --w92: rgba(255,255,255,0.92);
      --w50: rgba(255,255,255,0.50);
      --w25: rgba(255,255,255,0.25);
      --w07: rgba(255,255,255,0.07);
    }

    body {
      background: var(--bg);
      color: var(--w92);
      font-family: 'DM Sans', sans-serif;
      overflow-x: hidden;
      cursor: none;
      min-height: 100vh;
    }

    /* ─── FOUNDATION ──────────────────────────────────────────────────────── */
    #gamedev {
      position: relative;
      min-height: 100vh;
      display: grid;
      grid-template-columns: 300px 1fr;
      align-items: center;
      gap: 0;
      padding: 80px 64px;
      background:
        radial-gradient(ellipse 90% 50% at 50% -10%, rgba(74, 158, 255, 0.08) 0%, transparent 65%),
        #07070d;
    }

    #gamedev::before {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px);
      background-size: 28px 28px;
      pointer-events: none;
      z-index: 0;
    }

    #gamedev::after {
      content: '';
      position: fixed;
      inset: 0;
      opacity: 0.025;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
      background-size: 128px 128px;
      pointer-events: none;
      z-index: 999;
    }

    .gd-ambient-orb {
      position: absolute;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle, rgba(74,158,255,0.05) 0%, transparent 70%);
      filter: blur(90px);
      animation: orbFloat 12s ease-in-out infinite alternate;
      z-index: 1;
      right: 15%;
      top: 50%;
      margin-top: -250px;
    }
    @keyframes orbFloat {
      from { transform: translate(-40px, -20px) scale(1); }
      to   { transform: translate(40px, 20px) scale(1.05); }
    }

    .gd-col-divider {
      position: absolute;
      left: calc(64px + 300px);
      top: 0;
      bottom: 0;
      width: 1px;
      background: var(--w07);
      z-index: 2;
      transform-origin: top;
    }

    /* ─── HUD INFRASTRUCTURE ──────────────────────────────────────────────── */
    .gd-bracket {
      position: absolute;
      width: 20px;
      height: 20px;
      z-index: 5;
    }
    .gd-bracket.tl { top: 24px; left: 24px; border-top: 1px solid rgba(255,255,255,0.14); border-left: 1px solid rgba(255,255,255,0.14); }
    .gd-bracket.tr { top: 24px; right: 24px; border-top: 1px solid rgba(255,255,255,0.14); border-right: 1px solid rgba(255,255,255,0.14); }
    .gd-bracket.bl { bottom: 24px; left: 24px; border-bottom: 1px solid rgba(255,255,255,0.14); border-left: 1px solid rgba(255,255,255,0.14); }
    .gd-bracket.br { bottom: 24px; right: 24px; border-bottom: 1px solid rgba(255,255,255,0.14); border-right: 1px solid rgba(255,255,255,0.14); }

    .gd-statusbar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 38px;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px;
      z-index: 5;
      font-size: 0.58rem;
      text-transform: uppercase;
      letter-spacing: 0.17em;
      color: rgba(255,255,255,0.18);
    }

    .gd-sound-toggle {
      position: absolute;
      top: 24px;
      right: 60px;
      z-index: 10;
      border: 1px solid rgba(255,255,255,0.1);
      padding: 5px 12px;
      border-radius: 20px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.58rem;
      color: rgba(255,255,255,0.3);
      display: flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      cursor: none;
      transition: all 0.2s ease;
    }
    .gd-sound-toggle:hover {
      border-color: rgba(255,255,255,0.3);
      color: rgba(255,255,255,0.8);
    }
    .gd-sound-toggle svg {
      width: 10px;
      height: 10px;
      fill: currentColor;
    }

    .gd-timestamp {
      position: absolute;
      bottom: 50px;
      left: 64px;
      z-index: 5;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.55rem;
      letter-spacing: 0.12em;
      color: rgba(255,255,255,0.15);
    }

    /* ─── HEADER (LEFT COLUMN) ────────────────────────────────────────────── */
    .gd-header {
      position: relative;
      z-index: 5;
      padding-right: 40px;
    }
    .gd-label {
      display: inline-block;
      font-size: 0.68rem;
      letter-spacing: 0.2em;
      color: var(--warm);
      margin-bottom: 12px;
    }
    .gd-blink {
      animation: blink 1.1s step-end infinite;
    }
    @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

    .gd-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(5rem, 9vw, 10rem);
      line-height: 0.88;
      letter-spacing: -0.02em;
      margin-bottom: 16px;
    }
    .gd-accent-letter {
      background: linear-gradient(135deg, #4a9eff 0%, #ffffff 55%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .gd-subtitle {
      font-size: 0.82rem;
      color: rgba(255,255,255,0.32);
      letter-spacing: 0.04em;
      margin-bottom: 40px;
    }

    .gd-socials {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .gd-social-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100px;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.03);
      backdrop-filter: blur(4px);
      border-radius: 4px;
      padding: 7px 16px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.14em;
      color: rgba(255,255,255,0.5);
      text-decoration: none;
      cursor: none;
      transition: all 200ms ease;
    }
    .gd-social-btn svg {
      width: 10px; height: 10px; fill: currentColor;
    }
    .gd-social-btn:hover {
      border-color: rgba(74,158,255,0.5);
      color: rgba(255,255,255,0.9);
      background: rgba(74,158,255,0.07);
    }

    /* ─── CARDS AREA (RIGHT COLUMN) ───────────────────────────────────────── */
    .gd-right {
      position: relative;
      z-index: 5;
      padding-left: 60px;
      display: flex;
      flex-direction: column;
    }

    .gd-filters {
      display: flex;
      gap: 10px;
      margin-bottom: 24px;
    }
    .gd-filter-tab {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.1);
      color: rgba(255,255,255,0.35);
      padding: 5px 13px;
      border-radius: 3px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      cursor: none;
      transition: all 250ms ease;
    }
    .gd-filter-tab.active, .gd-filter-tab:hover {
      background: rgba(74,158,255,0.12);
      border-color: rgba(74,158,255,0.5);
      color: rgba(74,158,255,0.9);
    }

    .gd-cards {
      display: flex;
      flex-direction: row;
      gap: 14px;
      align-items: flex-end;
    }

    .gd-card {
      flex: 0 0 220px;
      height: 340px;
      border-radius: 10px;
      position: relative;
      overflow: hidden;
      cursor: none;
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: inset 0 0 50px rgba(0,0,0,0.45), 0 24px 64px rgba(0,0,0,0.45);
      background-size: 100% 100%;
      background-position: 50% 50%;
      transition: flex-basis 380ms cubic-bezier(0.25,0.46,0.45,0.94),
                  background-position 0.1s linear,
                  box-shadow 0.3s ease,
                  opacity 0.4s ease,
                  transform 0.4s ease;
    }
    .gd-card.dimmed {
      opacity: 0.25;
      transform: scale(0.97);
      pointer-events: none;
    }
    .gd-card:not(.hovered):not(.expanded) {
      animation: breathe 7s ease-in-out infinite;
    }
    .gd-card:nth-child(2){animation-delay:-1.75s}
    .gd-card:nth-child(3){animation-delay:-3.5s}
    .gd-card:nth-child(4){animation-delay:-5.25s}
    @keyframes breathe { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }

    .gd-card.hovered {
      flex: 0 0 400px;
      box-shadow: inset 0 0 50px rgba(0,0,0,0.45), 0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px rgba(74,158,255,0.25);
    }

    /* Status badge (top-left) */
    .gd-status-badge {
      position: absolute; top: 11px; left: 11px;
      border-radius: 3px; padding: 3px 8px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.55rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      z-index: 4;
    }
    .gd-status-badge.shipped { background: rgba(57,217,138,0.15); border: 1px solid rgba(57,217,138,0.4); color: #39d98a; }
    .gd-status-badge.wip { background: rgba(255,190,61,0.12); border: 1px solid rgba(255,190,61,0.35); color: #ffbe3d; }
    .gd-status-badge.demo { background: rgba(74,158,255,0.12); border: 1px solid rgba(74,158,255,0.35); color: #4a9eff; }

    /* Genre tag (top-right) */
    .gd-card-genre {
      position: absolute; top: 11px; right: 11px;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 3px; padding: 3px 9px;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 0.58rem;
      letter-spacing: 0.16em;
      z-index: 4;
    }

    /* Bottom scrim + title */
    .gd-card-scrim {
      position: absolute; bottom: 0; left: 0; right: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 45%, transparent 100%);
      padding: 18px 15px 16px;
      z-index: 3;
      pointer-events: none;
    }
    .gd-card-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 1.45rem;
      color: white;
      letter-spacing: 0.02em;
    }

    /* Revealed content */
    .gd-reveal {
      position: absolute;
      top: 0; right: 0; bottom: 0;
      width: 180px;
      border-left: 1px solid rgba(74,158,255,0.35);
      display: flex; flex-direction: column;
      justify-content: space-between;
      opacity: 0;
      transition: opacity 250ms ease;
      z-index: 4;
      pointer-events: none;
      background: rgba(0,0,0,0.1);
    }
    .gd-card.hovered .gd-reveal {
      opacity: 1;
      pointer-events: all;
      transition-delay: 300ms;
    }
    .gd-reveal-top {
      padding: 16px 14px 0;
    }
    .gd-card-tagline {
      font-family: 'DM Sans', sans-serif;
      font-size: 0.82rem;
      opacity: 0.62;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      margin-bottom: 12px;
      line-height: 1.3;
    }
    .gd-card-meta {
      font-size: 0.6rem;
      text-transform: uppercase;
      letter-spacing: 0.13em;
      color: rgba(255,255,255,0.28);
    }
    .gd-spine {
      position: absolute;
      right: 12px; top: 50%;
      transform: translateY(-50%) rotate(180deg);
      writing-mode: vertical-rl;
      font-family: 'Bebas Neue', sans-serif;
      font-size: 0.85rem;
      opacity: 0.1;
      letter-spacing: 0.1em;
      pointer-events: none;
    }
    .gd-reveal-bottom {
      padding: 0 14px 16px;
    }
    .gd-launch-btn {
      background: transparent;
      border: 1px solid rgba(74,158,255,0.4);
      padding: 6px 13px;
      border-radius: 3px;
      font-family: 'DM Sans', sans-serif;
      font-size: 0.58rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: rgba(74,158,255,0.9);
      cursor: none;
      transition: all 0.2s ease;
    }
    .gd-launch-btn:hover {
      border-color: rgba(74,158,255,1);
      box-shadow: 0 0 12px rgba(74,158,255,0.2);
    }

    /* Active indicators */
    .gd-indicators {
      display: flex;
      gap: 8px;
      margin-top: 24px;
      align-items: center;
      justify-content: center;
      width: 100%;
      max-width: calc(220px * 4 + 14px * 3); /* matches normal card row width roughly */
    }
    .gd-indicator {
      width: 5px; height: 5px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      transition: all 300ms ease;
    }
    .gd-indicator.active {
      width: 18px; height: 2px;
      border-radius: 2px;
      background: #4a9eff;
    }

    /* ─── FULL SCREEN TAKEOVER ────────────────────────────────────────────── */
    .gd-flash {
      position: fixed; inset: 0; background: white; pointer-events: none; z-index: 9998;
      opacity: 0;
    }
    .gd-overlay {
      position: fixed; inset: 0; z-index: 9997; overflow: hidden;
      display: grid; grid-template-columns: 52% 48%;
      pointer-events: none;
      opacity: 0;
    }
    .gd-overlay.active {
      pointer-events: all;
      opacity: 1;
    }
    
    .gd-ov-left {
      position: relative;
      z-index: 2;
      padding: 8% 12%;
      display: flex; flex-direction: column; justify-content: center;
      background: rgba(7,7,13,0.95);
    }
    .gd-ov-content {
      /* Wrapper for staggered animation */
      display: flex; flex-direction: column; align-items: flex-start;
    }
    .gd-ov-content > * {
      opacity: 0; transform: translateY(18px);
    }

    .gd-ov-header {
      display: flex; gap: 10px; margin-bottom: 24px;
    }
    .gd-ov-genre {
      font-family: 'Bebas Neue', sans-serif; font-size: 0.6rem; letter-spacing: 0.16em;
      background: rgba(0,0,0,0.6); padding: 3px 9px; border: 1px solid rgba(255,255,255,0.1); border-radius: 3px;
    }

    .gd-ov-title {
      font-family: 'Bebas Neue', sans-serif;
      font-size: clamp(4rem, 6.5vw, 7.5rem);
      line-height: 0.88; margin-bottom: 12px;
    }
    .gd-ov-tagline {
      font-size: 1.05rem; opacity: 0.58; margin-bottom: 24px;
    }
    .gd-ov-rule {
      width: 100%; height: 1px; background: rgba(255,255,255,0.07); margin-bottom: 24px;
    }
    .gd-ov-desc {
      font-size: 0.9rem; opacity: 0.68; line-height: 1.72; max-width: 400px; margin-bottom: 32px;
    }

    .gd-ov-tech {
      display: flex; gap: 14px; margin-bottom: 20px;
    }
    .gd-ov-tech-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.6rem; text-transform: uppercase; color: rgba(255,255,255,0.35);
    }
    .gd-ov-tech-item svg { width: 10px; height: 10px; fill: rgba(74,158,255,0.6); }

    .gd-ov-stats {
      display: flex; gap: 16px; margin-bottom: 40px;
    }
    .gd-ov-stat-item {
      display: flex; align-items: center; gap: 6px;
      font-size: 0.65rem; text-transform: uppercase; color: rgba(255,255,255,0.5);
    }
    .gd-ov-stat-item svg { width: 12px; height: 12px; fill: rgba(255,255,255,0.4); }

    .gd-ov-buttons {
      display: flex; gap: 16px;
    }
    .gd-ov-btn-play {
      background: rgba(74,158,255,0.14); border: 1px solid rgba(74,158,255,0.55);
      padding: 10px 22px; border-radius: 4px; font-size: 0.7rem; font-family: 'DM Sans', sans-serif;
      text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.9); cursor: none;
      transition: all 0.2s ease; display: none;
    }
    .gd-ov-btn-play:hover {
      background: rgba(74,158,255,0.22); box-shadow: 0 0 20px rgba(74,158,255,0.2);
    }
    .gd-ov-btn-source {
      background: transparent; border: 1px solid rgba(255,255,255,0.15);
      padding: 10px 22px; border-radius: 4px; font-size: 0.7rem; font-family: 'DM Sans', sans-serif;
      text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.7); cursor: none;
      transition: all 0.2s ease; display: none;
    }
    .gd-ov-btn-source:hover {
      border-color: rgba(255,255,255,0.35); color: white;
    }

    /* HUD elements inside overlay */
    .gd-ov-project-idx {
      position: absolute; top: 40px; left: 40px;
      font-size: 0.68rem; letter-spacing: 0.2em; color: var(--cold); text-transform: uppercase;
    }
    .gd-ov-nav {
      position: absolute; bottom: 40px; left: 40px;
      display: flex; gap: 24px;
    }
    .gd-ov-nav button {
      background: transparent; border: none; font-family: 'DM Sans', sans-serif;
      font-size: 0.62rem; text-transform: uppercase; color: rgba(255,255,255,0.3);
      cursor: none; transition: color 0.2s ease;
    }
    .gd-ov-nav button:hover { color: rgba(255,255,255,0.7); }

    /* Overlay right */
    .gd-ov-right {
      position: relative; z-index: 1; border-left: 1px solid rgba(74,158,255,0.15); overflow: hidden;
    }
    .gd-ov-art {
      position: absolute; inset: 0; background-size: cover;
      animation: ovArtShift 16s ease-in-out infinite alternate;
    }
    @keyframes ovArtShift { from { background-position: 40% 40%; } to { background-position: 60% 60%; } }
    
    .gd-ov-right::after {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background: radial-gradient(ellipse 65% 55% at 60% 28%, rgba(255,255,255,0.12) 0%, transparent 55%);
    }
    .gd-ov-right::before {
      content: ''; position: absolute; inset: 0; pointer-events: none;
      background-image: radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px);
      background-size: 28px 28px; z-index: 2;
    }

    .gd-ov-close {
      position: fixed; top: 30px; right: 30px; z-index: 9999;
      background: transparent; border: none; color: white; display: flex; flex-direction: column; align-items: center; cursor: none;
      opacity: 0; pointer-events: none; transition: opacity 0.3s ease;
    }
    .gd-ov-close.active { opacity: 1; pointer-events: all; }
    .gd-ov-close-x { font-size: 1.3rem; font-weight: 300; transition: transform 250ms ease; }
    .gd-ov-close-esc { font-size: 0.48rem; letter-spacing: 0.12em; opacity: 0.45; margin-top: 2px; }
    .gd-ov-close:hover .gd-ov-close-x { transform: rotate(45deg); }

    #gamedev.blur-active { filter: blur(5px) brightness(0.35); transition: filter 0.4s ease; }

    /* ─── CUSTOM CURSOR ────────────────────────────────────────────────── */
    .gd-dot { position: fixed; width: 6px; height: 6px; background: white; border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%,-50%); transition: opacity 0.2s, transform 0.2s; }
    .gd-ring { position: fixed; width: 32px; height: 32px; border: 1px solid rgba(255,255,255,0.22); border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%,-50%); transition: width 280ms cubic-bezier(0.34,1.56,0.64,1), height 280ms cubic-bezier(0.34,1.56,0.64,1), border-color 0.2s, opacity 0.2s; display: flex; align-items: center; justify-content: center; }
    .gd-ring-plus { font-size: 0.5rem; color: rgba(74,158,255,0.65); opacity: 0; transition: opacity 0.2s; font-family: 'DM Sans', sans-serif; }

    body:not(:hover) .gd-dot, body:not(:hover) .gd-ring { opacity: 0 !important; }

    body.cursor-card .gd-dot { opacity: 0; transform: translate(-50%,-50%) scale(0); }
    body.cursor-card .gd-ring { width: 52px; height: 52px; border-color: rgba(74,158,255,0.8); }
    body.cursor-card .gd-ring-plus { opacity: 1; }

    body.cursor-btn .gd-dot { opacity: 0; }
    body.cursor-btn .gd-ring { width: 40px; height: 40px; border-color: rgba(255,255,255,0.45); }

    body.cursor-click .gd-ring { width: 68px !important; height: 68px !important; border-color: rgba(255,255,255,1) !important; transition: width 180ms ease, height 180ms ease, border-color 180ms ease; }

    /* Scroll reveal classes */
    .sr-hide { opacity: 0; }

    /* ─── MOBILE ───────────────────────────────────────────────────────── */
    @media (max-width: 768px) {
      #gamedev { grid-template-columns: 1fr; padding: 40px 20px; }
      .gd-col-divider { display: none; }
      .gd-header { padding-right: 0; margin-bottom: 40px; }
      .gd-right { padding-left: 0; }
      .gd-cards { flex-wrap: nowrap; overflow-x: auto; scroll-snap-type: x mandatory; max-width: 100vw; padding-bottom: 20px; }
      .gd-card { flex: 0 0 85vw; scroll-snap-align: start; }
      .gd-card.hovered { flex: 0 0 85vw; }
      .gd-reveal { width: 100%; opacity: 1; pointer-events: all; background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%); }
      .gd-overlay { grid-template-columns: 1fr; }
      .gd-ov-right { display: none; }
      .gd-timestamp, .gd-sound-toggle { display: none; }
      .gd-statusbar { padding: 0 20px; }
    }
  </style>
</head>
<body>

  <div class="gd-dot" id="cursor-dot"></div>
  <div class="gd-ring" id="cursor-ring"><span class="gd-ring-plus">+</span></div>

  <section id="gamedev">
    <div class="gd-ambient-orb"></div>
    <div class="gd-col-divider" id="divider"></div>

    <div class="gd-bracket tl"></div><div class="gd-bracket tr"></div>
    <div class="gd-bracket bl"></div><div class="gd-bracket br"></div>

    <button class="gd-sound-toggle gd-hoverable" id="soundToggle">
      <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
      <span id="soundLabel">SOUND ON</span>
    </button>
    <div class="gd-timestamp" id="timestamp">SYS 00:00:00</div>

    <div class="gd-statusbar sr-hide" id="statusbar">
      <span>HOVER TO EXPAND · CLICK TO LAUNCH</span>
      <span>4 PROJECTS · 3 SHIPPED · 1 WIP · 0 DEMO</span>
    </div>

    <!-- LEFT COL -->
    <div class="gd-header">
      <span class="gd-label sr-hide" id="label">// 003<span class="gd-blink">_</span></span>
      <h2 class="gd-title">
        <div class="sr-hide" id="titleG"><span class="gd-accent-letter">G</span>AME</div>
        <div class="sr-hide" id="titleD">DEV</div>
      </h2>
      <p class="gd-subtitle sr-hide" id="subtitle">Interactive experiences &amp; virtual worlds</p>
      
      <div class="gd-socials">
        <a href="https://sudpy-dev.itch.io/" target="_blank" class="gd-social-btn gd-hoverable sr-hide">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3 13c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/></svg>
          ITCH.IO
        </a>
        <a href="https://github.com/SPY-Github22" target="_blank" class="gd-social-btn gd-hoverable sr-hide">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.47 2 2 6.47 2 12c0 4.42 2.86 8.17 6.84 9.49.5.09.68-.22.68-.48v-1.69c-2.78.6-3.36-1.34-3.36-1.34-.45-1.15-1.1-1.46-1.1-1.46-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.88 1.51 2.32 1.07 2.88.82.09-.64.35-1.07.63-1.32-2.22-.25-4.55-1.11-4.55-4.92 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.82-2.34 4.66-4.57 4.91.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48C19.14 20.17 22 16.42 22 12c0-5.53-4.53-10-10-10z"/></svg>
          GITHUB
        </a>
        <a href="https://www.linkedin.com/in/sudarshan-pai-y/" target="_blank" class="gd-social-btn gd-hoverable sr-hide">
          <svg viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
          LINKEDIN
        </a>
      </div>
    </div>

    <!-- RIGHT COL -->
    <div class="gd-right">
      <div class="gd-filters">
        <button class="gd-filter-tab gd-hoverable sr-hide active" data-filter="ALL">ALL</button>
        <button class="gd-filter-tab gd-hoverable sr-hide" data-filter="UNITY">UNITY</button>
        <button class="gd-filter-tab gd-hoverable sr-hide" data-filter="UNREAL 5">UNREAL</button>
        <button class="gd-filter-tab gd-hoverable sr-hide" data-filter="GODOT">GODOT</button>
      </div>

      <div class="gd-cards" id="cardsContainer"></div>

      <div class="gd-indicators sr-hide" id="indicators"></div>
    </div>
  </section>

  <!-- OVERLAY -->
  <div class="gd-flash" id="flash"></div>
  <div class="gd-overlay" id="overlay">
    <div class="gd-ov-left">
      <div class="gd-ov-project-idx" id="ovIdx">// PROJECT_01</div>
      <div class="gd-ov-nav">
        <button id="btnPrev" class="gd-hoverable">PREV ←</button>
        <button id="btnNext" class="gd-hoverable">→ NEXT</button>
      </div>

      <div class="gd-ov-content" id="ovContent">
        <div class="gd-ov-header">
          <div class="gd-status-badge" id="ovBadge"></div>
          <div class="gd-ov-genre" id="ovGenre"></div>
        </div>
        <div class="gd-ov-title" id="ovTitle"></div>
        <div class="gd-ov-tagline" id="ovTagline"></div>
        <div class="gd-ov-rule"></div>
        
        <div class="gd-ov-tech" id="ovTech"></div>
        <div class="gd-ov-stats" id="ovStats"></div>

        <div class="gd-ov-desc" id="ovDesc"></div>
        
        <div class="gd-ov-buttons">
          <button class="gd-ov-btn-play gd-hoverable" id="btnPlay">▶ PLAY DEMO</button>
          <button class="gd-ov-btn-source gd-hoverable" id="btnSource">⌥ VIEW SOURCE</button>
        </div>
      </div>
    </div>
    <div class="gd-ov-right">
      <div class="gd-ov-art" id="ovArt"></div>
    </div>
  </div>

  <button class="gd-ov-close" id="btnClose">
    <span class="gd-ov-close-x">×</span>
    <span class="gd-ov-close-esc">ESC</span>
  </button>

<script>
(function(){
  'use strict';

  /* ─── DATA ─────────────────────────────────────────────────────────── */
  const projects = [
    {
      id: 0, index: '01',
      title: "ALIEN OUTPOST", genre: "SCI-FI",
      tagline: "Fight for Mars in an alien invasion scenario.",
      engine: "Unity", year: "2023", role: "Solo Dev", status: "SHIPPED",
      duration: "6 WEEKS", tech: ["Unity", "C#", "Blender"],
      description: "An action-adventure game set in an alien invasion scenario. Aliens have invaded Earth, and you must fight for Mars. Features custom enemy AI and wave-based combat.",
      palette: ["#2a1a0a","#5c3010","#c86020","#ff8c42"],
      demoLink: "https://sudpy-dev.itch.io/alien-outpost", sourceLink: null
    },
    {
      id: 1, index: '02',
      title: "YEAR 3000", genre: "PLATFORMER",
      tagline: "A platformer set in the far future.",
      engine: "Unity", year: "2023", role: "Solo Dev", status: "SHIPPED",
      duration: "4 WEEKS", tech: ["Unity", "C#", "FMOD"],
      description: "Face challenges and retrieve the lost object in a futuristic world. Navigate difficult terrain to uncover the truth using advanced movement mechanics.",
      palette: ["#0d1f3c","#1a3a6b","#0a4fa8","#00d4ff"],
      demoLink: "https://sudpy-dev.itch.io/three-thousand-years", sourceLink: null
    },
    {
      id: 2, index: '03',
      title: "HEALTH++", genre: "ACTION",
      tagline: "Defeat enemies before time runs out.",
      engine: "Unity", year: "2024", role: "Solo Dev", status: "SHIPPED",
      duration: "8 WEEKS", tech: ["Unity", "C#", "Android"],
      description: "A fast-paced clicker game where you battle enemies to reach 100 health and win. Highly optimized for Browser and Android with juicy feedback.",
      palette: ["#0a2010","#1a4a20","#2d7a3a","#39ff6e"],
      demoLink: "https://sudpy-dev.itch.io/health-plus-clicker-game", sourceLink: null
    },
    {
      id: 3, index: '04',
      title: "THEY ARE COMING", genre: "SURVIVAL",
      tagline: "Unreal Engine 5 survival horror action.",
      engine: "Unreal 5", year: "2025", role: "Solo Dev", status: "WIP",
      duration: "ONGOING", tech: ["Unreal 5", "Blueprints", "Lumen"],
      description: "A survival game built in Unreal Engine 5. Face the incoming horde and fight to survive. Environment-focused narrative piece exploring Lumen GI.",
      palette: ["#1a0a2e","#3d1a6b","#7c3fcf","#b060ff"],
      demoLink: null, sourceLink: "https://github.com/SPY-Github22/UE5-Game---They-are-coming"
    }
  ];

  function getBadgeClass(status) {
    if(status === 'SHIPPED') return 'shipped';
    if(status === 'WIP') return 'wip';
    return 'demo';
  }

  function getCardCSS(p) {
    return `
      radial-gradient(ellipse 40% 28% at 72% 22%, rgba(255,255,255,0.08) 0%, transparent 55%),
      radial-gradient(ellipse at 35% 70%, ${p.palette[2]} 0%, transparent 55%),
      radial-gradient(ellipse at 78% 25%, ${p.palette[3]}44 0%, transparent 45%),
      linear-gradient(155deg, ${p.palette[1]} 0%, ${p.palette[0]} 100%)
    `;
  }
  function getOverlayCSS(p) {
    return `
      radial-gradient(ellipse 50% 50% at 50% 50%, ${p.palette[2]} 0%, transparent 80%),
      linear-gradient(155deg, ${p.palette[1]} 0%, ${p.palette[0]} 100%)
    `;
  }

  /* ─── AUDIO SYSTEM ─────────────────────────────────────────────────────── */
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;
  let soundEnabled = true;

  function initAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
  }
  window.addEventListener('click', initAudio, {once:true});
  window.addEventListener('keydown', initAudio, {once:true});

  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');
  soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundLabel.textContent = soundEnabled ? 'SOUND ON' : 'SOUND OFF';
    soundToggle.querySelector('svg').style.opacity = soundEnabled ? '1' : '0.5';
    sounds.uiClick();
  });

  const sounds = {
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

  /* ─── DOM GENERATION ───────────────────────────────────────────────────── */
  const cardsContainer = document.getElementById('cardsContainer');
  const indicatorsContainer = document.getElementById('indicators');

  projects.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'gd-card gd-hoverable-card sr-hide';
    card.dataset.id = p.id;
    card.dataset.engine = p.engine.toUpperCase();
    
    card.innerHTML = `
      <div class="gd-status-badge ${getBadgeClass(p.status)}">${p.status}</div>
      <div class="gd-card-genre">${p.genre}</div>
      <div class="gd-card-scrim">
        <div class="gd-card-title">${p.title}</div>
      </div>
      <div class="gd-reveal">
        <div class="gd-reveal-top">
          <div class="gd-card-tagline">${p.tagline}</div>
          <div class="gd-card-meta">${p.engine} · ${p.year} · ${p.role}</div>
        </div>
        <div class="gd-spine">${p.title}</div>
        <div class="gd-reveal-bottom">
          <button class="gd-launch-btn gd-hoverable">LAUNCH →</button>
        </div>
      </div>
    `;
    card.style.background = getCardCSS(p);
    cardsContainer.appendChild(card);

    const ind = document.createElement('div');
    ind.className = 'gd-indicator';
    indicatorsContainer.appendChild(ind);
  });

  const cards = document.querySelectorAll('.gd-card');
  const indicators = document.querySelectorAll('.gd-indicator');

  function updateIndicators(activeIndex) {
    indicators.forEach((ind, i) => ind.classList.toggle('active', i === activeIndex));
  }

  /* ─── CARD INTERACTIONS ────────────────────────────────────────────────── */
  let activeOverlayProject = null;
  let activeOverlayCard = null;

  cards.forEach((card, i) => {
    card.addEventListener('mouseenter', () => {
      if(activeOverlayProject) return;
      sounds.cardHover();
      cards.forEach(c => c.classList.remove('hovered'));
      card.classList.add('hovered');
      updateIndicators(i);
    });
    card.addEventListener('mouseleave', () => {
      if(activeOverlayProject) return;
      card.classList.remove('hovered');
      updateIndicators(-1);
    });

    // Launch
    const launchBtn = card.querySelector('.gd-launch-btn');
    launchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      sounds.uiClick();
      setTimeout(() => openOverlay(projects[i], card), 80);
    });
    card.addEventListener('click', () => {
      if(!activeOverlayProject && !card.classList.contains('dimmed')) {
        openOverlay(projects[i], card);
      }
    });
  });

  // Parallax
  const section = document.getElementById('gamedev');
  section.addEventListener('mousemove', e => {
    if(activeOverlayProject) return;
    const r = section.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    cards.forEach((c, i) => {
      const d = 0.5 + i * 0.18;
      c.style.backgroundPosition = `${50 + mx*10*d}% ${50 + my*10*d}%`;
    });
  });

  /* ─── FILTER TABS ──────────────────────────────────────────────────────── */
  const tabs = document.querySelectorAll('.gd-filter-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      sounds.tabSwitch();
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const f = tab.dataset.filter;
      cards.forEach(c => {
        if (f === 'ALL' || c.dataset.engine.includes(f)) {
          c.classList.remove('dimmed');
        } else {
          c.classList.add('dimmed');
        }
      });
    });
  });

  /* ─── OVERLAY LOGIC ────────────────────────────────────────────────────── */
  const overlay = document.getElementById('overlay');
  const flash = document.getElementById('flash');
  const btnClose = document.getElementById('btnClose');
  const ovContent = document.getElementById('ovContent');
  const ovContentItems = Array.from(ovContent.children);

  const uiPlay = document.getElementById('btnPlay');
  const uiSource = document.getElementById('btnSource');

  function openOverlay(p, cardEl) {
    activeOverlayProject = p;
    activeOverlayCard = cardEl;

    populateOverlay(p);

    const rect = cardEl.getBoundingClientRect();
    const vw = window.innerWidth, vh = window.innerHeight;
    const t = (rect.top / vh * 100).toFixed(2);
    const b = ((vh - rect.bottom) / vh * 100).toFixed(2);
    const l = (rect.left / vw * 100).toFixed(2);
    const r = ((vw - rect.right) / vw * 100).toFixed(2);

    overlay.style.clipPath = `inset(${t}% ${r}% ${b}% ${l}%)`;
    overlay.classList.add('active');
    
    // Phase 1: Flash
    sounds.flash();
    flash.style.opacity = '0.1';
    setTimeout(() => flash.style.opacity = '0', 160);

    // Phase 2: Expand
    sounds.launch();
    setTimeout(() => {
      gsap.to(overlay, {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.4,
        ease: 'cubic-bezier(0.76, 0, 0.24, 1)',
        onComplete: staggerOverlayContent
      });
      section.classList.add('blur-active');
    }, 160);
  }

  function populateOverlay(p) {
    document.getElementById('ovIdx').textContent = '// PROJECT_' + p.index;
    const badge = document.getElementById('ovBadge');
    badge.className = 'gd-status-badge ' + getBadgeClass(p.status);
    badge.textContent = p.status;
    document.getElementById('ovGenre').textContent = p.genre;
    document.getElementById('ovTitle').textContent = p.title;
    document.getElementById('ovTagline').textContent = p.tagline;
    document.getElementById('ovDesc').textContent = p.description;

    document.getElementById('ovArt').style.background = getOverlayCSS(p);

    // Tech
    const techEl = document.getElementById('ovTech');
    techEl.innerHTML = '';
    const shapes = [
      '<circle cx="5" cy="5" r="5"/>',
      '<rect width="10" height="10"/>',
      '<polygon points="5,0 10,10 0,10"/>'
    ];
    p.tech.forEach((t, i) => {
      techEl.innerHTML += `<div class="gd-ov-tech-item"><svg viewBox="0 0 10 10">${shapes[i%3]}</svg>${t}</div>`;
    });

    // Stats
    const statsEl = document.getElementById('ovStats');
    statsEl.innerHTML = `
      <div class="gd-ov-stat-item"><svg viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>${p.duration}</div>
      <div class="gd-ov-stat-item"><svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>${p.role}</div>
      <div class="gd-ov-stat-item"><svg viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>${p.status}</div>
    `;

    if (p.demoLink) {
      uiPlay.style.display = 'block';
      uiPlay.onclick = () => window.open(p.demoLink, '_blank');
    } else uiPlay.style.display = 'none';

    if (p.sourceLink) {
      uiSource.style.display = 'block';
      uiSource.onclick = () => window.open(p.sourceLink, '_blank');
    } else uiSource.style.display = 'none';
  }

  function staggerOverlayContent() {
    btnClose.classList.add('active');
    ovContentItems.forEach((el, i) => {
      const delay = i * 0.08;
      gsap.to(el, { opacity: 1, y: 0, duration: 0.4, ease: 'cubic-bezier(0.16, 1, 0.3, 1)', delay });
    });
  }

  function closeOverlay() {
    if(!activeOverlayProject) return;
    sounds.close();
    btnClose.classList.remove('active');
    
    // Fade content out fast
    gsap.to(ovContentItems, { opacity: 0, duration: 0.2 });

    setTimeout(() => {
      const rect = activeOverlayCard.getBoundingClientRect();
      const vw = window.innerWidth, vh = window.innerHeight;
      const t = (rect.top / vh * 100).toFixed(2);
      const b = ((vh - rect.bottom) / vh * 100).toFixed(2);
      const l = (rect.left / vw * 100).toFixed(2);
      const r = ((vw - rect.right) / vw * 100).toFixed(2);

      gsap.to(overlay, {
        clipPath: `inset(${t}% ${r}% ${b}% ${l}%)`,
        duration: 0.35,
        ease: 'power2.inOut',
        onComplete: () => {
          overlay.classList.remove('active');
          section.classList.remove('blur-active');
          activeOverlayProject = null;
          activeOverlayCard = null;
          // reset items for next time
          gsap.set(ovContentItems, { opacity: 0, y: 18 });
        }
      });
      // Flash briefly
      flash.style.opacity = '0.08';
      setTimeout(() => flash.style.opacity = '0', 100);
    }, 200);
  }

  btnClose.addEventListener('click', closeOverlay);
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && activeOverlayProject) closeOverlay();
  });

  // Prev / Next Nav
  document.getElementById('btnPrev').addEventListener('click', () => {
    sounds.tabSwitch();
    const currId = activeOverlayProject.id;
    const prevId = currId === 0 ? projects.length - 1 : currId - 1;
    switchOverlay(projects[prevId], cards[prevId]);
  });
  document.getElementById('btnNext').addEventListener('click', () => {
    sounds.tabSwitch();
    const currId = activeOverlayProject.id;
    const nextId = currId === projects.length - 1 ? 0 : currId + 1;
    switchOverlay(projects[nextId], cards[nextId]);
  });

  function switchOverlay(p, newCard) {
    gsap.to(ovContentItems, { opacity: 0, y: 10, duration: 0.15, onComplete: () => {
      populateOverlay(p);
      activeOverlayProject = p;
      activeOverlayCard = newCard;
      gsap.set(ovContentItems, { y: 18 });
      staggerOverlayContent();
    }});
  }

  /* ─── LIVE TIMESTAMP ───────────────────────────────────────────────────── */
  const timeEl = document.getElementById('timestamp');
  setInterval(() => {
    const d = new Date();
    timeEl.textContent = 'SYS ' + d.toTimeString().split(' ')[0];
  }, 1000);

  /* ─── CUSTOM CURSOR ────────────────────────────────────────────────────── */
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx=0, my=0, rx=0, ry=0;

  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
  function loop() {
    rx += (mx - rx) * 0.10;
    ry += (my - ry) * 0.10;
    dot.style.left = mx+'px'; dot.style.top = my+'px';
    ring.style.left = rx+'px'; ring.style.top = ry+'px';
    requestAnimationFrame(loop);
  }
  loop();

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup', () => setTimeout(()=>document.body.classList.remove('cursor-click'), 180));

  // Hover states
  document.querySelectorAll('.gd-hoverable').forEach(el => {
    el.addEventListener('mouseenter', () => {
      sounds.uiHover();
      document.body.classList.add('cursor-btn');
    });
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-btn'));
    el.addEventListener('click', () => sounds.uiClick());
  });

  document.querySelectorAll('.gd-hoverable-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-card'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-card'));
  });

  /* ─── SCROLL REVEAL ────────────────────────────────────────────────────── */
  const observer = new IntersectionObserver(entries => {
    if(entries[0].isIntersecting) {
      triggerReveal();
      observer.disconnect();
    }
  }, { threshold: 0.12 });
  observer.observe(section);

  function triggerReveal() {
    // Phase 1 - Header
    gsap.to('#label', { opacity: 1, x: 0, duration: 0.28, ease: 'power1.out' });
    gsap.to('#titleG', { opacity: 1, y: 0, duration: 0.48, delay: 0.08, ease: 'cubic-bezier(0.16,1,0.3,1)' });
    gsap.to('#titleD', { opacity: 1, y: 0, duration: 0.48, delay: 0.17, ease: 'cubic-bezier(0.16,1,0.3,1)' });
    gsap.to('#divider', { scaleY: 1, opacity: 1, duration: 0.6, delay: 0.22, ease: 'cubic-bezier(0.16,1,0.3,1)' });
    gsap.to('#subtitle', { opacity: 1, duration: 0.5, delay: 0.35 });
    
    gsap.utils.toArray('.gd-social-btn').forEach((btn, i) => {
      gsap.fromTo(btn, { opacity: 0, x: -8 }, { opacity: 1, x: 0, duration: 0.4, delay: 0.5 + i*0.06 });
      btn.classList.remove('sr-hide');
    });

    // Phase 2 - Tabs + Cards
    gsap.utils.toArray('.gd-filter-tab').forEach((tab, i) => {
      gsap.fromTo(tab, { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.45 + i*0.05 });
      tab.classList.remove('sr-hide');
    });
    
    gsap.utils.toArray('.gd-card').forEach((card, i) => {
      gsap.fromTo(card, { opacity: 0, y: 55, scaleY: 0.9 }, { opacity: 1, y: 0, scaleY: 1, duration: 0.6, delay: 0.45 + i*0.085, ease: 'cubic-bezier(0.16,1,0.3,1)' });
      card.classList.remove('sr-hide');
    });

    // Phase 3 - HUD
    setTimeout(() => {
      gsap.to('.gd-bracket', { opacity: 0.14, duration: 0.6 });
      gsap.to('#statusbar', { opacity: 1, duration: 0.5, delay: 0.1 });
      document.getElementById('statusbar').classList.remove('sr-hide');
      gsap.to('#indicators', { opacity: 1, duration: 0.5, delay: 0.2 });
      document.getElementById('indicators').classList.remove('sr-hide');
    }, 800);
  }

})();
</script>
</body>
</html>
"""

with open(r"d:\portfolio\index.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("index.html successfully overwritten with V3.")
