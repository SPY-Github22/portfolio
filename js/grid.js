/**
 * Grid & Overlay Logic
 * Handles the generation of project cards, filtering, interactions (hover/click),
 * text scrambling animations, and the full-screen project overlay.
 */

let currentOverlayProjectId = null;
let currentOverlaySource = 'grid';

/**
 * Creates a "cyberpunk-style" text scrambling animation on a given DOM element.
 * Rapidly cycles through random characters before revealing the target text.
 * 
 * @param {HTMLElement} element - The DOM element whose innerText will be scrambled.
 * @param {string} text - The final text string to resolve to.
 * @param {number} [duration=800] - Total duration of the scramble effect in milliseconds.
 */
function scrambleText(element, text, duration = 800) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const steps = duration / 30; // Number of animation frames (approx 30ms per frame)
  let step = 0;
  
  const interval = setInterval(() => {
    let result = '';
    for(let i = 0; i < text.length; i++) {
      if(text[i] === ' ') {
        result += ' '; // Preserve spaces
      } else if(step > steps * (i / text.length)) {
        result += text[i]; // Resolve characters sequentially from left to right
      } else {
        result += chars[Math.floor(Math.random() * chars.length)]; // Random char
      }
    }
    element.innerText = result;
    step++;
    
    // Clear interval once all steps are completed
    if(step > steps) {
      clearInterval(interval);
      element.innerText = text;
    }
  }, 30);
}

/**
 * Opens the full-screen overlay for a specific project.
 * Populates the overlay's DOM elements with the project's data and triggers a GSAP fade-in.
 * 
 * @param {number} id - The unique ID of the project to open.
 */
function openProject(id, source = 'grid') {
  if (typeof projects === 'undefined') return;
  
  // Find the requested project from the global data array
  const pIndex = projects.findIndex(pr => pr.id === id);
  if (pIndex === -1) return;
  const p = projects[pIndex];
  
  currentOverlayProjectId = id;
  currentOverlaySource = source;
  
  // Overlay DOM element references
  const overlay = document.getElementById('overlay');
  const ovTitle = document.getElementById('ovTitle');
  const ovDesc = document.getElementById('ovDesc');
  const ovBadge = document.getElementById('ovBadge');
  const ovTech = document.getElementById('ovTech');
  const ovIdx = document.getElementById('ovIdx');
  const ovArt = document.getElementById('ovArt');
  const btnPlay = document.getElementById('btnPlay');
  const btnSource = document.getElementById('btnSource');
  const btnPrev = document.getElementById('btnPrev');
  const btnNext = document.getElementById('btnNext');
  
  // Update Prev/Next button states
  if (btnPrev) {
    if (pIndex > 0) {
      btnPrev.style.opacity = '1';
      btnPrev.style.pointerEvents = 'all';
    } else {
      btnPrev.style.opacity = '0.3';
      btnPrev.style.pointerEvents = 'none';
    }
  }
  if (btnNext) {
    if (pIndex < projects.length - 1) {
      btnNext.style.opacity = '1';
      btnNext.style.pointerEvents = 'all';
    } else {
      btnNext.style.opacity = '0.3';
      btnNext.style.pointerEvents = 'none';
    }
  }
  
  // Populate text elements
  if(ovIdx) ovIdx.innerText = `// PROJECT_${p.index}`;
  if(ovTitle) ovTitle.innerText = p.title;
  if(ovDesc) ovDesc.innerText = p.description;
  
  // Configure the status badge (colors vary based on WIP vs SHIPPED)
  if(ovBadge) {
    ovBadge.innerText = p.status;
    ovBadge.style.color = p.status === 'WIP' ? '#ffaa00' : '#4a9eff';
    ovBadge.style.borderColor = p.status === 'WIP' ? 'rgba(255,170,0,0.5)' : 'rgba(74,158,255,0.5)';
  }
  
  // Join technology tags with a middle dot separator
  if(ovTech && p.tech) ovTech.innerText = p.tech.join(' · ');
  
  // Apply the project's custom gradient palette to the overlay art background
  if(ovArt && p.palette) ovArt.style.background = `linear-gradient(135deg, ${p.palette[0]} 0%, ${p.palette[1]} 100%)`;
  
  if(ovArt && p.media && p.media.length > 0) {
    let mediaHtml = '';
    p.media.forEach((m, mIdx) => {
      let activeClass = mIdx === 0 ? 'active' : '';
      if (m.type === 'video') {
        mediaHtml += `<video class="gd-card-media ${activeClass}" src="${m.url}" loop muted autoplay playsinline></video>`;
      } else {
        mediaHtml += `<img class="gd-card-media ${activeClass}" src="${m.url}">`;
      }
    });
    ovArt.innerHTML = mediaHtml;
    if (window.overlayMediaInterval) clearInterval(window.overlayMediaInterval);
    if (p.media.length > 1) {
      window.overlayMediaInterval = setInterval(() => {
        cycleCardMedia(ovArt);
      }, 3500);
    }
  } else if (ovArt) {
    ovArt.innerHTML = '';
  }
  
  // Configure action buttons based on available links
  if(btnPlay) {
    if(p.demoLink) {
      btnPlay.style.display = 'block';
      btnPlay.onclick = () => window.open(p.demoLink, '_blank');
    } else {
      btnPlay.style.display = 'none';
    }
  }
  
  if(btnSource) {
    if(p.sourceLink) {
      btnSource.style.display = 'block';
      btnSource.onclick = () => window.open(p.sourceLink, '_blank');
    } else {
      btnSource.style.display = 'none';
    }
  }
  
  // Trigger overlay animations
  if(overlay) {
    overlay.classList.add('active'); // Enables pointer events
    
    // Select all direct children of the overlay content area for staggered entry
    const children = document.querySelectorAll('#ovContent > *');
    
    // Reset positions
    gsap.set(children, { opacity: 0, y: 18 });
    
    if (currentOverlaySource === 'timeline') {
      // iOS Springboard jump/spread transition
      gsap.set(overlay, { transformOrigin: "50% 50%", opacity: 1, borderRadius: "60px" });
      
      gsap.fromTo(overlay, 
        { scale: 0.05, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.5)" }
      );
      gsap.to(overlay, { borderRadius: "0px", duration: 0.3, delay: 0.3 });
      
      // Deep recess / scale out background (like zooming through an app icon)
      const timelineView = document.getElementById('timeline');
      if(timelineView) {
        gsap.to(timelineView, { scale: 1.5, opacity: 0, duration: 0.6, ease: "power3.inOut" });
      }
    } else {
      // macOS Genie / Jump transition
      gsap.set(overlay, { transformOrigin: "50% 100%", opacity: 1, borderRadius: "40px" });
      
      // The "Jump" and vertical stretch
      gsap.fromTo(overlay, 
        { scaleY: 0.05, y: window.innerHeight * 0.8 }, 
        { scaleY: 1, y: 0, duration: 0.7, ease: "back.out(1.3)" }
      );
      // The horizontal "Unfold/Funnel"
      gsap.fromTo(overlay,
        { scaleX: 0.05 },
        { scaleX: 1, duration: 0.6, ease: "power3.inOut" }
      );
      // Smooth out corners
      gsap.to(overlay, { borderRadius: "0px", duration: 0.3, delay: 0.4 });
      
      // Push the background back
      const gamedev = document.getElementById('gamedev');
      if(gamedev) {
        gsap.to(gamedev, { scale: 0.95, opacity: 0.4, duration: 0.7, ease: "power3.out" });
      }
    }
    
    // Show close button
    const btnClose = document.getElementById('btnClose');
    if(btnClose) {
      btnClose.classList.add('active');
      gsap.fromTo(btnClose, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, delay: 0.4, ease: "back.out(1.5)" });
    }
    
    // Staggered slide-up animation for the content
    gsap.to(children, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08, delay: 0.35, ease: 'power2.out' });
  }
}

// Attach event listener for the overlay's close button
const btnClose = document.getElementById('btnClose');
if(btnClose) {
  btnClose.addEventListener('click', () => {
    const overlay = document.getElementById('overlay');
    if(overlay) {
      if(typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick();
      
      // Hide close button
      if(btnClose) {
        gsap.to(btnClose, { scale: 0, opacity: 0, duration: 0.2 });
      }

      if (currentOverlaySource === 'timeline') {
        // iOS Springboard Close
        gsap.set(overlay, { transformOrigin: "50% 50%" });
        gsap.to(overlay, {
          scale: 0.05,
          opacity: 0,
          borderRadius: "60px",
          duration: 0.5,
          ease: "power3.inOut",
          onComplete: () => {
            overlay.classList.remove('active');
            if(btnClose) btnClose.classList.remove('active');
            gsap.set(overlay, { scale: 1, borderRadius: '0px' });
            if (window.overlayMediaInterval) clearInterval(window.overlayMediaInterval);
            const ovArt = document.getElementById('ovArt');
            if (ovArt) ovArt.innerHTML = '';
          }
        });
        
        const timelineView = document.getElementById('timeline');
        if(timelineView) {
          gsap.to(timelineView, { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" });
        }
      } else {
        // macOS Genie "Suck" close transition
        gsap.set(overlay, { transformOrigin: "50% 100%" });
        
        // Horizontal squash
        gsap.to(overlay, { scaleX: 0.05, duration: 0.5, ease: "power3.inOut" });
        
        // Vertical drop and squash
        gsap.to(overlay, { 
          scaleY: 0.05, 
          y: window.innerHeight * 0.8, 
          opacity: 0,
          borderRadius: '40px', 
          duration: 0.5, 
          ease: 'power3.in',
          onComplete: () => {
            overlay.classList.remove('active');
            if(btnClose) btnClose.classList.remove('active');
            gsap.set(overlay, { scaleX: 1, scaleY: 1, y: 0, borderRadius: '0px' }); // Reset overlay transforms
            if (window.overlayMediaInterval) clearInterval(window.overlayMediaInterval);
            const ovArt = document.getElementById('ovArt');
            if (ovArt) ovArt.innerHTML = '';
          }
        });
        
        // Restore the background
        const gamedev = document.getElementById('gamedev');
        if(gamedev) {
          gsap.to(gamedev, { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out' });
        }
      }
    }
  });
}

// Attach event listeners for the Prev/Next buttons
const globalBtnPrev = document.getElementById('btnPrev');
const globalBtnNext = document.getElementById('btnNext');

if(globalBtnPrev) {
  globalBtnPrev.addEventListener('click', () => {
    if(currentOverlayProjectId === null) return;
    const idx = projects.findIndex(pr => pr.id === currentOverlayProjectId);
    if(idx > 0) {
      if(typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick(); 
      openProject(projects[idx - 1].id, currentOverlaySource);
    }
  });
}

if(globalBtnNext) {
  globalBtnNext.addEventListener('click', () => {
    if(currentOverlayProjectId === null) return;
    const idx = projects.findIndex(pr => pr.id === currentOverlayProjectId);
    if(idx < projects.length - 1) {
      if(typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick(); 
      openProject(projects[idx + 1].id, currentOverlaySource);
    }
  });
}

/**
 * Generates and injects the HTML markup for the project grid cards.
 * Can filter cards based on a provided engine/technology string.
 * 
 * @param {string} [filter='ALL'] - The filter string to match against engine or tech array.
 */
function renderCards(filter = 'ALL') {
  const cardsContainer = document.getElementById('cardsContainer');
  if(!cardsContainer || typeof projects === 'undefined') return;
  
  // Clear any existing cards before rendering
  cardsContainer.innerHTML = '';
  
  // Filter the projects array
  const filtered = filter === 'ALL' 
    ? projects 
    : projects.filter(p => p.engine.toUpperCase().includes(filter) || p.tech.some(t => t.toUpperCase() === filter));
  
  // Create and append a DOM node for each filtered project
  filtered.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'gd-card sr-hide'; // sr-hide keeps it invisible for the initial staggered reveal
    card.style.transitionDelay = (idx * 0.1) + 's';
    
    let bgCss = '';
    let mediaHtml = '';
    if (p.palette && p.palette.length === 4) {
      bgCss = `radial-gradient(ellipse 40% 30% at 70% 25%, rgba(255,255,255,0.07) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, ${p.palette[2]} 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, ${p.palette[3]}33 0%, transparent 48%), linear-gradient(160deg, ${p.palette[1]} 0%, ${p.palette[0]} 100%)`;
      card.style.setProperty('--card-accent', p.palette[2]);
    }
    if (p.media && p.media.length > 0) {
      p.media.forEach((m, mIdx) => {
        let activeClass = mIdx === 0 ? 'active' : '';
        if (m.type === 'video') {
          mediaHtml += `<video class="gd-card-media ${activeClass}" src="${m.url}" loop muted playsinline></video>`;
        } else {
          mediaHtml += `<img class="gd-card-media ${activeClass}" src="${m.url}">`;
        }
      });
    }
    
    card.innerHTML = `
      <div class="gd-card-art" style="background: ${bgCss}">
        ${mediaHtml}
      </div>
      <div class="gd-status-badge ${p.status.toLowerCase().replace(' ', '-')}">${p.status}</div>
      <span class="gd-card-genre">${p.genre}</span>
      <div class="gd-card-scrim">
        <div class="gd-card-title">${p.title.split(' ').join('<br>')}</div>
      </div>
      <div class="gd-reveal">
        <div class="gd-reveal-top">
          <div class="gd-card-tagline">${p.tagline}</div>
          <div class="gd-card-meta">${p.engine} · ${p.year} · ${p.role}</div>
        </div>
        <span class="gd-spine">${p.title}</span>
        <div class="gd-reveal-bottom">
          <button class="gd-launch-btn" data-launch="${p.id}">LAUNCH →</button>
        </div>
      </div>
    `;
    
    // Desktop hover logic: visually expands the card and changes cursor state
    card.addEventListener('mouseenter', () => { 
      clearTimeout(window.resumeCarouselTimeout);
      window.userInteracting = true;
      stopCarousel();
      document.querySelectorAll('.gd-card.expanded').forEach(c => c.classList.remove('expanded'));
      
      card.classList.add('hovered');
      document.body.classList.add('cursor-card'); 
      if(typeof sounds !== 'undefined' && sounds.cardHoverStart) sounds.cardHoverStart(); 
      playCardMedia(card);
    });
    
    card.addEventListener('mouseleave', () => { 
      card.classList.remove('hovered');
      document.body.classList.remove('cursor-card'); 
      if(typeof sounds !== 'undefined' && sounds.cardHoverEnd) sounds.cardHoverEnd(); 
      pauseCardMedia(card);
      
      // Resume carousel after 2 seconds of inactivity
      clearTimeout(window.resumeCarouselTimeout);
      window.resumeCarouselTimeout = setTimeout(() => {
        window.userInteracting = false;
        startCarousel();
      }, 2000);
    });
    
    // Click interaction logic
    card.addEventListener('click', (e) => { 
      // If the user explicitly clicked the launch button, open the full overlay
      if(e.target.closest('.gd-launch-btn')) {
        if(typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick(); 
        openProject(p.id); 
      } else {
        // Otherwise, simply toggle the card's expansion state (useful for touch devices)
        const wasExpanded = card.classList.contains('expanded');
        // Collapse all other expanded cards to maintain focus
        document.querySelectorAll('.gd-card.expanded').forEach(c => c.classList.remove('expanded'));
        if(!wasExpanded) {
          card.classList.add('expanded');
        }
      }
    });
    
    cardsContainer.appendChild(card);
  });
}

/**
 * Triggers the initial grid load sequence.
 * Renders the cards, then sequentially fades in any elements possessing the `.sr-hide` class.
 */
function triggerReveal(filter = 'ALL') {
  renderCards(filter);
  
  // Find all elements marked for staggered reveal
  const elements = document.querySelectorAll('.sr-hide');
  elements.forEach((el, i) => {
    // Stagger the fade-in by 50ms per element
    setTimeout(() => {
      el.style.opacity = '1';
      el.classList.remove('sr-hide');
    }, i * 50);
  });
}

// Bind filter buttons
document.addEventListener('DOMContentLoaded', () => {
  const filterBtns = document.querySelectorAll('.gd-filter-tab');
  filterBtns.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      if(typeof sounds !== 'undefined' && sounds.filterHover) sounds.filterHover();
    });

    btn.addEventListener('click', (e) => {
      // Remove active class from all
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      e.target.classList.add('active');
      
      // Get the filter string and re-render
      const filter = e.target.getAttribute('data-filter');
      triggerReveal(filter);
      
      if(typeof sounds !== 'undefined' && sounds.filterClick) sounds.filterClick();
    });
  });
});

/* --- CAROUSEL LOGIC --- */
window.userInteracting = false;
let carouselInterval = null;
let mediaInterval = null;
let activeCardIndex = 1; // "They are coming"

function playCardMedia(card) {
  const activeMedia = card.querySelector('.gd-card-media.active');
  if (activeMedia && activeMedia.tagName === 'VIDEO') {
    activeMedia.play().catch(e => {});
  }
}

function pauseCardMedia(card) {
  const vids = card.querySelectorAll('video');
  vids.forEach(v => v.pause());
}

function cycleCardMedia(card) {
  const medias = Array.from(card.querySelectorAll('.gd-card-media'));
  if (medias.length <= 1) return;
  let activeIdx = medias.findIndex(m => m.classList.contains('active'));
  medias[activeIdx].classList.remove('active');
  if (medias[activeIdx].tagName === 'VIDEO') medias[activeIdx].pause();
  
  let nextIdx = (activeIdx + 1) % medias.length;
  medias[nextIdx].classList.add('active');
  if (medias[nextIdx].tagName === 'VIDEO') medias[nextIdx].play().catch(e => {});
}

function stopCarousel() {
  clearInterval(carouselInterval);
  clearInterval(mediaInterval);
  document.querySelectorAll('.gd-card').forEach(c => pauseCardMedia(c));
}

function startCarousel() {
  if (window.userInteracting) return;
  stopCarousel();
  
  const cards = document.querySelectorAll('.gd-card');
  if (cards.length === 0) return;
  
  // Set initial
  cards.forEach(c => {
    c.classList.remove('expanded', 'hovered');
    pauseCardMedia(c);
  });
  
  activeCardIndex = activeCardIndex % cards.length;
  let currentCard = cards[activeCardIndex];
  currentCard.classList.add('expanded');
  playCardMedia(currentCard);
  
  // Media rotation inside the active card
  mediaInterval = setInterval(() => {
    cycleCardMedia(cards[activeCardIndex]);
  }, 3500);
  
  // Card rotation
  carouselInterval = setInterval(() => {
    cards[activeCardIndex].classList.remove('expanded');
    pauseCardMedia(cards[activeCardIndex]);
    
    activeCardIndex = (activeCardIndex + 1) % cards.length;
    let nextCard = cards[activeCardIndex];
    nextCard.classList.add('expanded');
    playCardMedia(nextCard);
  }, 10000); // switch card every 10 seconds
}

// Start carousel on initial load after reveal
const oldTriggerReveal = triggerReveal;
window.triggerReveal = function(filter = 'ALL') {
  oldTriggerReveal(filter);
  setTimeout(() => {
    activeCardIndex = filter === 'ALL' ? 1 : 0; // "They are coming" is at index 1
    startCarousel();
  }, 500);
}

