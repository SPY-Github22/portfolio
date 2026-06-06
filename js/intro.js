/**
 * Intro Screen Logic
 * Handles the initial boot sequence, terminal text animation, and transitioning
 * from the intro screen into the main portfolio grid.
 */

const btnIntroStart = document.getElementById('btnIntroStart');
const introScreen = document.getElementById('intro-screen');
const gamedevSection = document.getElementById('gamedev');
const terminal = document.getElementById('introTerminal');
const introCenter = document.getElementById('introCenter');
const initPrompt = document.getElementById('initPrompt');

// Step 1: Initial "Click Anywhere" Prompt
// This is required to bypass browser autoplay policies and initialize the AudioContext.
if (initPrompt) {
  // Hide the native cursor so the custom cursor logic remains visually cohesive
  initPrompt.style.cursor = 'none';
  
  initPrompt.addEventListener('click', () => {
    // Initialize or resume the Web Audio Context
    if(typeof audioCtx === 'undefined' || !audioCtx) {
      if (typeof initAudio === 'function') initAudio();
    }
    if(typeof audioCtx !== 'undefined' && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (typeof sounds !== 'undefined' && sounds.initClick) sounds.initClick();
    
    // Fade out the initial prompt layer
    gsap.to(initPrompt, { opacity: 0, duration: 0.3, onComplete: () => {
      initPrompt.style.display = 'none';
      
      // Step 2: Trigger the Terminal Boot Sequence
      if (terminal) {
        terminal.style.display = 'block';
        const lines = terminal.querySelectorAll('p');
        
        // Hide all lines initially
        gsap.set(lines, { opacity: 0 });
        let tl = gsap.timeline();
        
        // Sequentially reveal each terminal line instantly to perfectly sync with the sharp click sound
        lines.forEach((line) => {
          tl.add(() => {
            line.style.opacity = '1';
            if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
          }, "+=0.25");
        });
        
        // Step 3: Reveal the center "PRESS ENTER" button after the terminal finishes
        tl.add(() => {
          if (introCenter) {
            gsap.to(introCenter, { opacity: 1, scale: 1, duration: 0.8 });
          }
        }, "+=0.5");
      }
    }});
  });
}

// Step 4: The "PRESS ENTER" / Start Button
// Transitions the user from the Intro Screen to the Grid View
if (btnIntroStart) {
  btnIntroStart.addEventListener('click', () => {
    let tl = gsap.timeline();
    
    // Quick white flash effect to transition scenes
    tl.to('#flash', { opacity: 1, duration: 0.1, onStart: () => {
       if (typeof sounds !== 'undefined' && sounds.systemAccess) sounds.systemAccess();
    }})
      .to('#flash', { opacity: 0, duration: 0.5 });
      
    // Execute the layout swap behind the flash
    tl.add(() => {
      if(introScreen) introScreen.style.display = 'none';
      if(gamedevSection) gamedevSection.style.display = 'grid';
      
      // Save state so refreshing the page skips the intro sequence
      sessionStorage.setItem('gd_page', 'grid');
      
      // Initialize and animate the grid cards
      if (typeof triggerReveal === 'function') triggerReveal();
    });
  });
}

