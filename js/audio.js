/**
 * Global audio context instance.
 * Must be initialized after a user interaction to comply with modern browser autoplay policies.
 * @type {AudioContext}
 */
let audioCtx;

/**
 * An object containing methods to synthesize and play various UI sound effects
 * using the Web Audio API.
 */
const sounds = {
  /**
   * Global mute flag controlled by the Sound toggle button.
   */
  isMuted: false,

  /**
   * Reference to a continuous synthesizer node, if one is used.
   * @type {OscillatorNode|null}
   */
  synth: null,

  /**
   * Plays a short, descending sine wave 'blip' used for general UI clicks.
   * Modulates frequency from 880Hz down to 440Hz over 100ms.
   */
  uiClick: () => {
    if(!audioCtx || sounds.isMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    
    // Pitch modulation: High to low for a satisfying click
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
    
    // Volume envelope: Quick decay
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  },

  /**
   * Plays a very soft, high-pitched 'blip' used when hovering over project cards.
   * Lower volume and tighter frequency ramp compared to the main click.
   */
  cardHoverStart: () => {
    if(!audioCtx || sounds.isMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    
    // Pitch modulation
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
    
    // Very subtle volume envelope
    gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  },

  /**
   * Stub for handling the end of a card hover event.
   * Intentionally empty as the hover sound is transient (no continuous drone to stop).
   */
  cardHoverEnd: () => {
    // Intentionally empty: no continuous drone to stop
  },

  /**
   * Plays a double-beep or deep power-on sound when the user first clicks to initialize.
   */
  initClick: () => {
    if(!audioCtx || sounds.isMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'square';
    
    // Low pitched hum/thud
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.2);
  },

  /**
   * Plays a soft, metallic tick when hovering over filter buttons.
   */
  filterHover: () => {
    if(!audioCtx || sounds.isMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.05);
    
    gain.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.05);
  },

  /**
   * Plays a sharp, higher-pitched click when a filter button is selected.
   */
  filterClick: () => {
    if(!audioCtx || sounds.isMuted) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    
    osc.frequency.setValueAtTime(1600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  },

  /**
   * Plays a resonant chord swell to simulate 'system access granted'
   * Used when transitioning from the intro terminal into the main grid.
   */
  systemAccess: () => {
    if(!audioCtx || sounds.isMuted) return;
    // A nice futuristic C major 7th chord swell
    const freqs = [261.63, 329.63, 392.00, 493.88]; // C4, E4, G4, B4
    const duration = 1.2;
    
    freqs.forEach(freq => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      // Quick swell in, long resonant fade out
      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.06, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    });
  },

  /**
   * Generates a burst of filtered white noise to simulate a "fire" or "burn" sound.
   * Used when emitting fire particles on the timeline.
   * @param {number} duration - The duration of the burn sound in seconds.
   */
  fireBurn: (duration) => {
    if(!audioCtx || sounds.isMuted) return;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Generate white noise by filling the buffer with random values between -1 and 1
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    
    // Apply a lowpass filter to muffle the harsh white noise, simulating a low rumble/burn
    const biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = 'lowpass';
    biquadFilter.frequency.value = 1000;
    
    // Volume envelope: linear fade out over the duration
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
    
    // Audio graph: Source -> Filter -> Gain -> Destination
    noiseSource.connect(biquadFilter);
    biquadFilter.connect(gain);
    gain.connect(audioCtx.destination);
    noiseSource.start();
  }
};

/**
 * Initializes the Web Audio Context.
 * Must be called in response to a user gesture (e.g., a click event) 
 * to bypass browser restrictions on autoplaying audio.
 */
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Pre-initialize the audio context so it's ready (in a suspended state) 
// before the first click, preventing a stutter.
initAudio();
