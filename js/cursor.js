/**
 * Custom Cursor System
 * Replaces the default browser cursor with a dot and a trailing animated ring.
 */

const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

// Initialize positions to the center of the screen
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// The trailing ring uses separate coordinates for interpolation
let ringX = mouseX;
let ringY = mouseY;

if (cursorDot && cursorRing) {
  
  /**
   * Primary mousemove listener.
   * Tracks the raw mouse coordinates and instantly snaps the center dot to the mouse.
   * Also ensures the cursor elements fade in when the user first moves the mouse.
   */
  window.addEventListener('mousemove', e => {
    // Fade in custom cursor upon first movement
    if (cursorDot.style.opacity !== '1') {
      cursorDot.style.opacity = '1';
      cursorRing.style.opacity = '1';
    }
    
    // Update raw coordinates
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Snap the center dot instantly
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  });
  
  /**
   * Animation loop for the trailing cursor ring.
   * Uses linear interpolation (lerp) to smoothly drag the ring towards the center dot.
   */
  function renderCursor() {
    // Lerp factor 0.15: The ring travels 15% of the distance to the mouse every frame
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    // Apply interpolated positions
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    
    // Continuously loop
    requestAnimationFrame(renderCursor);
  }
  
  // Kick off the rendering loop
  requestAnimationFrame(renderCursor);
  
  /**
   * Interaction hover detection.
   * Adds a 'hover' class to the cursor ring if the mouse is over clickable elements,
   * triggering CSS transitions (e.g., expanding the ring, changing color).
   */
  document.body.addEventListener('mousemove', (e) => {
    // Check if the event target or its ancestors are interactive elements
    if (e.target.closest('.gd-hoverable') || e.target.closest('button') || e.target.closest('a')) {
      cursorRing.classList.add('hover');
    } else {
      cursorRing.classList.remove('hover');
    }
  });
  
  /**
   * Mouse click visual feedback.
   * Briefly adds a 'cursor-clicked' class to trigger CSS pulse animations.
   */
  document.body.addEventListener('mousedown', () => cursorRing.classList.add('cursor-clicked'));
  document.body.addEventListener('mouseup', () => cursorRing.classList.remove('cursor-clicked'));
}

