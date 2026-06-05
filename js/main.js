(function(){
  'use strict';

  // Safety reset: ensure the flash overlay never blocks clicks on reload
  const flashEl = document.getElementById('flash');
  if (flashEl) { flashEl.style.opacity = '0'; flashEl.style.pointerEvents = 'none'; }

  const btnTimeline = document.getElementById('btnTimeline');
  const btnTimelineBack = document.getElementById('btnTimelineBack');
  const introScreen = document.getElementById('intro-screen');
  const gamedevSection = document.getElementById('gamedev');
  const timelineSection = document.getElementById('timeline');
  const btnJourneyLabel = document.getElementById('btnJourneyLabel');
  const btnTimelineUp = document.getElementById('btnTimelineUp');

  // Transitions
  if(btnTimeline) {
    btnTimeline.addEventListener('click', () => {
      if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
      if(flashEl) {
        flashEl.style.opacity = 1;
        flashEl.style.pointerEvents = 'all';
      }
      
      setTimeout(() => {
        sessionStorage.setItem('gd_page', 'timeline');
        if(gamedevSection) gamedevSection.style.display = 'none';
        if(timelineSection) timelineSection.style.display = 'block';
        if(typeof initTimeline === 'function') initTimeline();
        
        if (window.goToTimelineStep) {
          gsap.set('#tlScrollLayer', { y: 0 });
        }
        
        if(flashEl) {
          gsap.to('#flash', { opacity: 0, duration: 0.4, onComplete: () => {
            flashEl.style.pointerEvents = 'none';
          }});
        }
      }, 200);
    });
  }
  
  if(btnTimelineBack) {
    btnTimelineBack.addEventListener('click', () => {
      if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
      if(flashEl) {
        flashEl.style.opacity = 1;
        flashEl.style.pointerEvents = 'all';
      }
      
      setTimeout(() => {
        sessionStorage.setItem('gd_page', 'grid');
        if(timelineSection) timelineSection.style.display = 'none';
        if(gamedevSection) gamedevSection.style.display = 'grid';
        
        if(flashEl) {
          gsap.to('#flash', { opacity: 0, duration: 0.4, onComplete: () => {
            flashEl.style.pointerEvents = 'none';
          }});
        }
      }, 200);
    });
  }
  
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

  // Page state persistence & Audio unlocker
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

  // Real-time Clock Logic
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

  // Always boot to intro screen
  sessionStorage.setItem('gd_page', 'intro');
})();
