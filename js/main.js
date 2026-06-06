/**
 * Main Application Logic
 * Bootstraps the application, handles global events (like the real-time clock), 
 * and manages view transitions between the Grid and Timeline sections.
 */
(function(){
  'use strict';

  // Safety reset: ensure the flash overlay never blocks clicks on reload
  const flashEl = document.getElementById('flash');
  if (flashEl) { flashEl.style.opacity = '0'; flashEl.style.pointerEvents = 'none'; }

  // DOM Elements for Navigation
  const btnTimeline = document.getElementById('btnTimeline');
  const btnTimelineBack = document.getElementById('btnTimelineBack');
  const introScreen = document.getElementById('intro-screen');
  const gamedevSection = document.getElementById('gamedev');
  const timelineSection = document.getElementById('timeline');
  const btnJourneyLabel = document.getElementById('btnJourneyLabel');
  const btnTimelineUp = document.getElementById('btnTimelineUp');

  // -- View Transitions --
  
  /**
   * Transition: Grid View -> Timeline View
   * Triggers a white flash, swaps the display states, and initializes the Timeline 
   * logic if it hasn't been booted yet.
   */
  if(btnTimeline) {
    btnTimeline.addEventListener('click', () => {
      if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
      
      // Trigger flash
      if(flashEl) {
        flashEl.style.opacity = 1;
        flashEl.style.pointerEvents = 'all';
      }
      
      // Swap views while the screen is white
      setTimeout(() => {
        sessionStorage.setItem('gd_page', 'timeline');
        if(gamedevSection) gamedevSection.style.display = 'none';
        if(timelineSection) timelineSection.style.display = 'block';
        
        // Initialize timeline SVG generation
        if(typeof initTimeline === 'function') initTimeline();
        
        // Reset scroll position
        if (window.goToTimelineStep) {
          gsap.set('#tlScrollLayer', { y: 0 });
        }
        
        // Fade flash out
        if(flashEl) {
          gsap.to('#flash', { opacity: 0, duration: 0.4, onComplete: () => {
            flashEl.style.pointerEvents = 'none';
          }});
        }
      }, 200);
    });
  }
  
  /**
   * Transition: Timeline View -> Grid View
   */
  if(btnTimelineBack) {
    btnTimelineBack.addEventListener('click', () => {
      if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
      
      // Trigger flash
      if(flashEl) {
        flashEl.style.opacity = 1;
        flashEl.style.pointerEvents = 'all';
      }
      
      // Swap views while the screen is white
      setTimeout(() => {
        sessionStorage.setItem('gd_page', 'grid');
        if(timelineSection) timelineSection.style.display = 'none';
        if(gamedevSection) gamedevSection.style.display = 'grid';
        
        // Fade flash out
        if(flashEl) {
          gsap.to('#flash', { opacity: 0, duration: 0.4, onComplete: () => {
            flashEl.style.pointerEvents = 'none';
          }});
        }
      }, 200);
    });
  }
  
  /**
   * Timeline specific navigation: Scroll to Top
   * Clicking the 'Journey' label or the 'Up' arrow smoothly scrubs the timeline back to the start.
   */
  if(btnJourneyLabel) {
    btnJourneyLabel.addEventListener('click', () => {
      if (typeof applyStepVisuals !== 'function') return;
      if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
      gsap.to(scrubProxy, { s: 0, duration: 1, ease: 'power2.inOut', onUpdate: () => { currentScrubStep = scrubProxy.s; applyStepVisuals(currentScrubStep); }});
    });
  }

  if(btnTimelineUp) {
    btnTimelineUp.addEventListener('click', () => {
      if (typeof applyStepVisuals !== 'function') return;
      if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
      gsap.to(scrubProxy, { s: 0, duration: 1, ease: 'power2.inOut', onUpdate: () => { currentScrubStep = scrubProxy.s; applyStepVisuals(currentScrubStep); }});
    });
  }

  // -- Global Audio Initialization --
  // Ensures the AudioContext is created/resumed on the first user interaction anywhere on the page
  
  window.addEventListener('click', () => {
    if (typeof audioCtx === 'undefined' || !audioCtx) {
      if(typeof initAudio === 'function') initAudio();
    }
    if (typeof audioCtx !== 'undefined' && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }, { once: true });
  
  window.addEventListener('keydown', () => {
    if (typeof audioCtx === 'undefined' || !audioCtx) {
      if(typeof initAudio === 'function') initAudio();
    }
    if (typeof audioCtx !== 'undefined' && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }, { once: true });

  // -- Real-time Clock Logic --
  // Updates the visual terminal clock in the UI
  const timeEl = document.getElementById('timestamp');
  if (timeEl) {
    setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      timeEl.innerText = `SYS ${h}:${m}:${s}`;
    }, 1000);
  }

  // -- Sound Toggle Logic --
  const soundToggle = document.getElementById('soundToggle');
  const soundLabel = document.getElementById('soundLabel');
  if (soundToggle && soundLabel) {
    soundToggle.addEventListener('click', () => {
      if (typeof sounds !== 'undefined') {
        sounds.isMuted = !sounds.isMuted;
        soundLabel.innerText = sounds.isMuted ? 'SOUND OFF' : 'SOUND ON';
        // Give tactile feedback when turning sound ON
        if (!sounds.isMuted) sounds.uiClick();
      }
    });
  }

  // Always boot to the intro screen sequence on fresh page loads
  sessionStorage.setItem('gd_page', 'intro');
})();

