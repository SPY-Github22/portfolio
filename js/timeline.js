/**
 * Timeline & Scrolljacking Logic
 * Handles the generation of the SVG timeline path, DOM node placement, 
 * scrolljacking for navigation, and the dynamic fire particle effects.
 */

let timelineInitialized = false;

// Global proxy object used by GSAP to smoothly interpolate the 'step' value
let scrubProxy; 

// The current interpolated timeline step (0 to steps.length)
let currentScrubStep; 

// Function reference to apply visual updates based on the current step
let applyStepVisuals;

/**
 * Bootstraps the Timeline view.
 * Dynamically draws the SVG path based on the milestones array, places HTML nodes 
 * along the path, and initializes the scrolljacking event listeners.
 */
function initTimeline() {
  if(timelineInitialized) return;
  timelineInitialized = true;

  const tlNodesContainer = document.getElementById('tlNodes');
  const tlPath = document.getElementById('tlPath');
  const tlPathGhost = document.getElementById('tlPathGhost');
  const tlSvg = document.getElementById('tlSvg');
  const tlContainer = document.getElementById('tlContainer');
  const tlScrollLayer = document.getElementById('tlScrollLayer');
  const timelineSection = document.getElementById('timeline');
  
  if (!tlNodesContainer || !tlPath || typeof milestones === 'undefined') return;
  
  let currentY = 0;
  const pathPoints = []; // Array of SVG path commands (M, L)
  const svgWidth = 600;
  const centerX = svgWidth / 2;
  
  // Array to map physical path length/Y-coordinates to logical 'steps' for the scrolljacker
  const steps = [];
  
  // -- 1. Generate SVG Path and Place DOM Nodes --
  
  // Start Point
  pathPoints.push(`M ${centerX} 0`);
  currentY += 100;
  pathPoints.push(`L ${centerX} ${currentY}`);
  steps.push({ y: 0, length: 0, wrapper: null, type: 'start' });
  
  // Variable to alternate project nodes left (-1) and right (1) of the center line
  let side = -1;
  
  milestones.forEach((item, index) => {
    if(item.type === 'milestone') {
      // Small text-only milestone (stays on the center line)
      currentY += 150;
      pathPoints.push(`L ${centerX} ${currentY}`);
      
      const m = document.createElement('div');
      m.className = `tl-milestone ${side === -1 ? 'left' : 'right'}`;
      m.style.top = `${currentY}px`;
      m.innerHTML = `
        <div class="tl-milestone-dot"></div>
        <div class="tl-milestone-text">${item.year} // ${item.text}</div>
      `;
      tlNodesContainer.appendChild(m);
      gsap.set(m, { opacity: 0, autoAlpha: 0 }); // Hidden initially
      
      steps.push({ y: currentY, wrapper: m, type: 'milestone' });
      
    } else if(item.type === 'project') {
      // Large interactive project node (branches off the center line)
      const p = projects.find(pr => pr.id === item.id);
      if(!p) return;
      
      // Calculate branching path
      const targetX = centerX + (side * 220);
      currentY += 80;
      pathPoints.push(`L ${targetX} ${currentY}`); // Diagonal branch out
      currentY += 170;
      pathPoints.push(`L ${targetX} ${currentY}`); // Straight vertical drop
      
      const wrapper = document.createElement('div');
      wrapper.className = `tl-node-wrapper ${side === -1 ? 'left' : 'right'}`;
      wrapper.style.top = `${currentY}px`;
      wrapper.style.transform = "translateY(-50%)"; // Center vertically on the point
      
      const accentColor = p.palette[2];
      wrapper.innerHTML = `
        <div class="tl-illumination" style="--node-accent: ${accentColor}"></div>
        <div class="tl-connector"></div>
        <div class="tl-node gd-hoverable" style="--node-accent: ${accentColor}">
          <div class="tl-node-header">
            <div class="tl-node-index">${p.index}</div>
            <div class="tl-node-year">${p.year} // ${p.role}</div>
            <div class="tl-node-genre">${p.genre}</div>
          </div>
          <div class="tl-node-title">${p.title}</div>
          <div class="tl-node-desc">${p.description}</div>
          <div class="tl-node-tech">${p.tech.map(t => `<span class="tl-node-tech-tag">${t}</span>`).join('')}</div>
          <div class="tl-node-footer">
            <div class="tl-node-status ${p.status.toLowerCase().replace(' ', '-')}"><span class="tl-node-status-dot"></span>${p.status}</div>
            <div class="tl-node-action">VIEW PROJECT →</div>
          </div>
        </div>
      `;
      tlNodesContainer.appendChild(wrapper);
      
      // Pre-configure initial GSAP state (hidden, slightly offset)
      gsap.set(wrapper, { opacity: 0, autoAlpha: 0, x: side * -50, scale: 0.95 });
      
      // Bind interactions
      const nodeCard = wrapper.querySelector('.tl-node');
      nodeCard.addEventListener('mouseenter', () => { 
        document.body.classList.add('cursor-card'); 
        if (typeof sounds !== 'undefined' && sounds.cardHoverStart) sounds.cardHoverStart(); 
      });
      nodeCard.addEventListener('mouseleave', () => { 
        document.body.classList.remove('cursor-card'); 
        if (typeof sounds !== 'undefined' && sounds.cardHoverEnd) sounds.cardHoverEnd(); 
      });
      nodeCard.addEventListener('click', () => openProject(p.id, 'timeline'));
      
      steps.push({ y: currentY, wrapper: wrapper, type: 'project', title: p.title, side: side });
      
      // Return path to center
      currentY += 80;
      pathPoints.push(`L ${centerX} ${currentY}`);
      
      // Toggle side for the next project node
      side *= -1;
    }
  });
  
  // End Point
  currentY += 150;
  pathPoints.push(`L ${centerX} ${currentY}`);
  steps.push({ y: currentY, wrapper: null, type: 'end' });
  
  // Apply path strings to SVG
  const pathD = pathPoints.join(' ');
  tlPath.setAttribute('d', pathD);
  tlPathGhost.setAttribute('d', pathD);
  tlSvg.setAttribute('height', currentY);
  tlContainer.style.height = `${currentY}px`;
  
  // Setup SVG stroke drawing animation (using dasharray trick)
  const pathLength = tlPath.getTotalLength();
  tlPath.style.strokeDasharray = pathLength;
  tlPath.style.strokeDashoffset = pathLength;
  
  // Calculate the exact SVG path length offset for each logical 'step'
  // This uses a binary search to find the length at which the path hits a specific Y coordinate.
  steps.forEach((step, index) => {
    if (index === steps.length - 1) {
      step.length = pathLength;
      return;
    }
    let low = 0, high = pathLength, best = 0;
    for(let i=0; i<20; i++) {
      let mid = (low + high) / 2;
      let pt = tlPath.getPointAtLength(mid);
      if(pt.y < step.y) { low = mid; }
      else { high = mid; best = mid; }
    }
    step.length = best;
  });

  // -- 2. Fire Particle System --
  
  let lastParticleTime = 0;
  
  /**
   * Emits a single burning particle at the given SVG coordinates.
   * @param {number} x - SVG X coordinate
   * @param {number} y - SVG Y coordinate
   */
  function emitFireParticle(x, y) {
    const now = Date.now();
    // Throttle particle emission to prevent performance degradation
    if (now - lastParticleTime < 50) return;
    lastParticleTime = now;
    
    // Create an SVG circle element
    const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    particle.setAttribute('r', Math.random() * 2 + 1);
    particle.setAttribute('cx', x + (Math.random() * 8 - 4));
    particle.setAttribute('cy', y + (Math.random() * 8 - 4));
    particle.setAttribute('fill', '#ffffff');
    particle.style.filter = 'drop-shadow(0 0 4px #ffaa00)';
    
    const fireTip = document.getElementById('tlFireTip');
    if (fireTip) {
      fireTip.appendChild(particle);
      
      // Animate the particle drifting downwards and fading out
      gsap.to(particle, {
        attr: { cy: y + 20 + Math.random() * 30, cx: x + (Math.random() * 20 - 10) },
        opacity: 0,
        duration: 0.5 + Math.random() * 0.4,
        ease: 'power1.out',
        onComplete: () => particle.remove() // Cleanup DOM
      });
    }
  }

  // -- 3. Scrolljacking Logic --
  
  let maxUnlockedStep = 0;
  let isAnimatingForward = false;
  
  scrubProxy = { s: 0 };
  currentScrubStep = 0;
  
  /**
   * Core render loop for the timeline.
   * Interpolates the path drawing, moves the camera (scroll layer), and triggers node reveals.
   * @param {number} s - The current interpolated step value (e.g. 1.5 means halfway between step 1 and 2)
   */
  applyStepVisuals = function(s) {
    const prevIdx = Math.floor(s);
    const nextIdx = Math.min(steps.length - 1, Math.ceil(s));
    const frac = s - prevIdx; // Fractional progress between the two indices
    
    // Interpolate the physical path length based on the logical step fraction
    const lenPrev = steps[prevIdx].length;
    const lenNext = steps[nextIdx].length;
    const curLen = lenPrev + (lenNext - lenPrev) * frac;
    
    // Draw the SVG line
    tlPath.style.strokeDashoffset = pathLength - curLen;
    const pt = tlPath.getPointAtLength(curLen);
    
    // Move the glowing tip
    const tlDot = document.getElementById('tlDot');
    if (tlDot) {
      tlDot.setAttribute('cx', pt.x);
      tlDot.setAttribute('cy', pt.y);
    }
    
    // Emit particles if actively moving
    if (isAnimatingForward || Math.abs(frac) > 0.05) {
      emitFireParticle(pt.x, pt.y);
    }
    
    // "Camera" tracking: move the container up as the dot goes down, keeping it vertically centered
    const vh = window.innerHeight;
    let camY = pt.y - vh * 0.4;
    if (camY < 0) camY = 0;
    gsap.set(tlScrollLayer, { y: -camY });
    
    // Toggle UI Hints (Journey Label and Scroll Up indicator)
    const btnJourneyLabel = document.getElementById('btnJourneyLabel');
    if (btnJourneyLabel) {
      if (s >= 1.5) {
        if(btnJourneyLabel.style.pointerEvents !== 'all') {
          gsap.to(btnJourneyLabel, { opacity: 1, y: 0, duration: 0.3, onStart: () => btnJourneyLabel.style.pointerEvents = 'all' });
        }
      } else {
        if(btnJourneyLabel.style.pointerEvents !== 'none') {
          gsap.to(btnJourneyLabel, { opacity: 0, y: -20, duration: 0.3, onComplete: () => btnJourneyLabel.style.pointerEvents = 'none' });
        }
      }
    }
    
    const btnTimelineUp = document.getElementById('btnTimelineUp');
    if (btnTimelineUp) {
      if (s >= 2.5) {
        if(btnTimelineUp.style.pointerEvents !== 'all') {
          gsap.to(btnTimelineUp, { opacity: 1, y: 0, duration: 0.3, onStart: () => btnTimelineUp.style.pointerEvents = 'all' });
        }
      } else {
        if(btnTimelineUp.style.pointerEvents !== 'none') {
          gsap.to(btnTimelineUp, { opacity: 0, y: -20, duration: 0.3, onComplete: () => btnTimelineUp.style.pointerEvents = 'none' });
        }
      }
    }
    
    // Trigger node entrance animations
    steps.forEach((step, idx) => {
      if (!step.wrapper) return;
      // Define a node as visible if the dot has crossed its threshold (plus a tiny margin)
      const shouldBeVisible = (idx <= s + 0.1); 
      const isVisible = step.wrapper.classList.contains('revealed');
      
      if (shouldBeVisible && !isVisible) {
        // Reveal!
        step.wrapper.classList.add('revealed');
        step.wrapper.classList.add('lit');
        if (typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
        
        if(step.type === 'milestone') {
           gsap.to(step.wrapper, { opacity: 1, autoAlpha: 1, duration: 0.5 });
        } else if(step.type === 'project') {
           gsap.to(step.wrapper, { opacity: 1, autoAlpha: 1, x: 0, scale: 1, duration: 0.6, ease: "back.out(1.2)" });
           
           // Trigger cyberpunk text scramble on the title
           const titleEl = step.wrapper.querySelector('.tl-node-title');
           if (titleEl) scrambleText(titleEl, step.title, 600);
           
           // Stagger in details
           const children = step.wrapper.querySelectorAll('.tl-node-desc, .tl-node-tech, .tl-node-footer');
           gsap.fromTo(children, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, delay: 0.2 });
        }
      } else if (!shouldBeVisible && isVisible) {
        // Hide! (if user scrolls backward)
        step.wrapper.classList.remove('revealed');
        step.wrapper.classList.remove('lit');
        if(step.type === 'project') {
           gsap.to(step.wrapper, { opacity: 0, autoAlpha: 0, x: step.side * -50, scale: 0.95, duration: 0.4 });
        } else {
           gsap.to(step.wrapper, { opacity: 0, autoAlpha: 0, duration: 0.4 });
        }
      }
    });
  }

  /**
   * Forces the timeline to advance forward, unlocking the next sequence.
   * Computes a dynamic duration based on the physical distance between nodes.
   */
  function advanceToNewStep() {
    if(isAnimatingForward) return;
    if(maxUnlockedStep >= steps.length - 1) return;
    
    isAnimatingForward = true;
    // Jump forward by 2 steps (typically a milestone + a project)
    const targetStep = Math.min(steps.length - 1, maxUnlockedStep + 2);
    
    // Dynamic duration calculation
    const startLen = steps[maxUnlockedStep].length;
    const endLen = steps[targetStep].length;
    const distance = Math.abs(endLen - startLen);
    const duration = Math.max(0.8, Math.min(2.0, distance / 350));
    
    if (typeof sounds !== 'undefined' && sounds.fireBurn) sounds.fireBurn(duration);
    
    // Tween the proxy object
    gsap.to(scrubProxy, {
      s: targetStep,
      duration: duration,
      ease: 'power1.inOut',
      onUpdate: () => {
        currentScrubStep = scrubProxy.s;
        applyStepVisuals(currentScrubStep);
      },
      onComplete: () => {
        maxUnlockedStep = targetStep;
        isAnimatingForward = false;
      }
    });
  }

  /**
   * Event Handler for Mouse Wheel / Trackpad Scroll.
   * Intercepts standard scrolling and maps it to timeline progress.
   */
  function handleWheel(e) {
    if(timelineSection.style.display !== 'block') return;
    if(isAnimatingForward) { e.preventDefault(); return; }
    if(Math.abs(e.deltaY) < 10) return; // Ignore tiny movements
    
    const stepDelta = e.deltaY * 0.003; 
    
    if(e.deltaY > 0 && currentScrubStep >= maxUnlockedStep - 0.05) {
      // Trying to scroll past unlocked territory -> Trigger an advance
      e.preventDefault();
      advanceToNewStep();
    } else {
      // Scrubbing within unlocked territory
      e.preventDefault();
      let targetScrub = currentScrubStep + stepDelta;
      if(targetScrub < 0) targetScrub = 0;
      if(targetScrub > maxUnlockedStep) targetScrub = maxUnlockedStep;
      
      gsap.to(scrubProxy, {
        s: targetScrub,
        duration: 0.15,
        ease: 'power1.out',
        onUpdate: () => {
          currentScrubStep = scrubProxy.s;
          applyStepVisuals(currentScrubStep);
        }
      });
    }
  }
  
  // passive: false is required to call preventDefault() on wheel events
  window.addEventListener('wheel', handleWheel, { passive: false });
  
  /**
   * Event Handler for Keyboard Navigation (Arrows, PageUp/Down, Spacebar)
   */
  window.addEventListener('keydown', (e) => {
    if(timelineSection.style.display !== 'block') return;
    if(isAnimatingForward) { e.preventDefault(); return; }
    
    if(e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault();
      if(currentScrubStep >= maxUnlockedStep - 0.05) advanceToNewStep();
      else {
         gsap.to(scrubProxy, { s: maxUnlockedStep, duration: 0.5, onUpdate: () => { currentScrubStep = scrubProxy.s; applyStepVisuals(currentScrubStep); }});
      }
    }
    if(e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault();
      const targetScrub = Math.max(0, currentScrubStep - 2);
      gsap.to(scrubProxy, { s: targetScrub, duration: 0.5, onUpdate: () => { currentScrubStep = scrubProxy.s; applyStepVisuals(currentScrubStep); }});
    }
  });

  /**
   * Event Handlers for Touch Devices (Swipe to scroll)
   */
  let touchStartY = 0;
  let lastTouchY = 0;
  window.addEventListener('touchstart', e => {
    if(timelineSection.style.display !== 'block') return;
    touchStartY = e.touches[0].clientY;
    lastTouchY = touchStartY;
  }, { passive: false });
  
  window.addEventListener('touchmove', e => {
    if(timelineSection.style.display !== 'block') return;
    e.preventDefault();
    if(isAnimatingForward) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = lastTouchY - currentY;
    lastTouchY = currentY;
    
    const stepDelta = deltaY * 0.005;
    if(deltaY > 0 && currentScrubStep >= maxUnlockedStep - 0.05) {
      advanceToNewStep();
    } else {
      let targetScrub = currentScrubStep + stepDelta;
      if(targetScrub < 0) targetScrub = 0;
      if(targetScrub > maxUnlockedStep) targetScrub = maxUnlockedStep;
      
      // Direct scrub for touch (no easing/lag) to feel more responsive
      scrubProxy.s = targetScrub;
      currentScrubStep = targetScrub;
      applyStepVisuals(currentScrubStep);
    }
  }, { passive: false });
}

