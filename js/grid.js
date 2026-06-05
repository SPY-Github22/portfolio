// Grid & Overlay Logic

function scrambleText(element, text, duration = 800) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
  const steps = duration / 30;
  let step = 0;
  
  const interval = setInterval(() => {
    let result = '';
    for(let i=0; i<text.length; i++) {
      if(text[i] === ' ') result += ' ';
      else if(step > steps * (i / text.length)) result += text[i];
      else result += chars[Math.floor(Math.random() * chars.length)];
    }
    element.innerText = result;
    step++;
    if(step > steps) {
      clearInterval(interval);
      element.innerText = text;
    }
  }, 30);
}

function openProject(id) {
  if (typeof projects === 'undefined') return;
  const p = projects.find(pr => pr.id === id);
  if(!p) return;
  const overlay = document.getElementById('overlay');
  const ovTitle = document.getElementById('ovTitle');
  
  if(ovTitle) ovTitle.innerText = p.title;
  
  if(overlay) {
    overlay.classList.add('active');
    gsap.to(overlay, { opacity: 1, duration: 0.3 });
  }
}

const btnClose = document.getElementById('btnClose');
if(btnClose) {
  btnClose.addEventListener('click', () => {
    const overlay = document.getElementById('overlay');
    if(overlay) {
      gsap.to(overlay, { opacity: 0, duration: 0.3, onComplete: () => overlay.classList.remove('active') });
    }
  });
}

function renderCards(filter = 'ALL') {
  const cardsContainer = document.getElementById('cardsContainer');
  if(!cardsContainer || typeof projects === 'undefined') return;
  cardsContainer.innerHTML = '';
  
  const filtered = filter === 'ALL' ? projects : projects.filter(p => p.engine.toUpperCase().includes(filter) || p.tech.some(t => t.toUpperCase() === filter));
  
  filtered.forEach((p, idx) => {
    const card = document.createElement('div');
    card.className = 'gd-card sr-hide';
    card.style.transitionDelay = (idx * 0.1) + 's';
    let bgCss = '';
    if (p.palette && p.palette.length === 4) {
      bgCss = `radial-gradient(ellipse 40% 30% at 70% 25%, rgba(255,255,255,0.07) 0%, transparent 60%), radial-gradient(ellipse at 50% 80%, ${p.palette[2]} 0%, transparent 55%), radial-gradient(ellipse at 75% 25%, ${p.palette[3]}33 0%, transparent 48%), linear-gradient(160deg, ${p.palette[1]} 0%, ${p.palette[0]} 100%)`;
      card.style.setProperty('--card-accent', p.palette[2]);
    }
    
    card.innerHTML = `
      <div class="gd-card-art" data-id="${p.id}" style="background: ${bgCss}"></div>
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
    card.addEventListener('mouseenter', () => { 
      card.classList.add('hovered');
      document.body.classList.add('cursor-card'); 
      if(typeof sounds !== 'undefined' && sounds.cardHoverStart) sounds.cardHoverStart(); 
    });
    card.addEventListener('mouseleave', () => { 
      card.classList.remove('hovered');
      document.body.classList.remove('cursor-card'); 
      if(typeof sounds !== 'undefined' && sounds.cardHoverEnd) sounds.cardHoverEnd(); 
    });
    card.addEventListener('click', (e) => { 
      if(e.target.closest('.gd-launch-btn')) return; // handled separately if needed
      if(typeof sounds !== 'undefined' && sounds.uiClick) sounds.uiClick(); 
      openProject(p.id); 
    });
    
    cardsContainer.appendChild(card);
  });
}

function triggerReveal() {
  renderCards('ALL');
  const elements = document.querySelectorAll('.sr-hide');
  elements.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = '1';
      el.classList.remove('sr-hide');
    }, i * 50);
  });
}
