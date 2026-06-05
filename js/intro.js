// Intro Screen Logic
const btnIntroStart = document.getElementById('btnIntroStart');
const introScreen = document.getElementById('intro-screen');
const gamedevSection = document.getElementById('gamedev');
const terminal = document.getElementById('introTerminal');
const introCenter = document.getElementById('introCenter');
const initPrompt = document.getElementById('initPrompt');

if (initPrompt) {
  initPrompt.style.cursor = 'none';
  initPrompt.addEventListener('click', () => {
    if(typeof audioCtx === 'undefined' || !audioCtx) {
      if (typeof initAudio === 'function') initAudio();
    }
    if(typeof audioCtx !== 'undefined' && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
    
    gsap.to(initPrompt, { opacity: 0, duration: 0.3, onComplete: () => {
      initPrompt.style.display = 'none';
      
      if (terminal) {
        terminal.style.display = 'block';
        const lines = terminal.querySelectorAll('p');
        gsap.set(lines, { opacity: 0 });
        let tl = gsap.timeline();
        lines.forEach((line, i) => {
          tl.to(line, { opacity: 1, duration: 0.1, delay: 0.3, onStart: () => {
             if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
          }});
        });
        
        tl.add(() => {
          if (introCenter) {
            gsap.to(introCenter, { opacity: 1, scale: 1, duration: 0.8 });
          }
        }, "+=0.5");
      }
    }});
  });
}

if (btnIntroStart) {
  btnIntroStart.addEventListener('click', () => {
    if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
    let tl = gsap.timeline();
    tl.to('#flash', { opacity: 1, duration: 0.1, onStart: () => {
       if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
    }})
      .to('#flash', { opacity: 0, duration: 0.5 });
      
    tl.add(() => {
      if(introScreen) introScreen.style.display = 'none';
      if(gamedevSection) gamedevSection.style.display = 'grid';
      sessionStorage.setItem('gd_page', 'grid');
      
      if (typeof triggerReveal === 'function') triggerReveal();
    });
  });
}
