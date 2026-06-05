const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let ringX = mouseX;
let ringY = mouseY;

if (cursorDot && cursorRing) {
  window.addEventListener('mousemove', e => {
    if (cursorDot.style.opacity !== '1') {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  function renderCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);
  
  document.body.addEventListener('mousemove', (e) => {
    if (e.target.closest('.gd-hoverable') || e.target.closest('button') || e.target.closest('a')) {
      cursorRing.classList.add('hover');
    } else {
      cursorRing.classList.remove('hover');
    }
  });
  
  document.body.addEventListener('mousedown', () => cursorRing.classList.add('cursor-clicked'));
  document.body.addEventListener('mouseup', () => cursorRing.classList.remove('cursor-clicked'));
}
