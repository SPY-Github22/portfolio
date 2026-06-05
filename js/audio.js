// Audio Setup
let audioCtx;
const sounds = {
  synth: null,
  uiClick: () => {
    if(!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
  },
  cardHoverStart: () => {
    if(!audioCtx) return;
    if(sounds.synth) sounds.synth.stop();
    sounds.synth = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    sounds.synth.type = 'triangle';
    sounds.synth.frequency.setValueAtTime(110, audioCtx.currentTime);
    gain.gain.setValueAtTime(0, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 0.1);
    sounds.synth.connect(gain);
    gain.connect(audioCtx.destination);
    sounds.synth.start();
  },
  cardHoverEnd: () => {
    if(sounds.synth) {
      sounds.synth.stop();
      sounds.synth = null;
    }
  },
  fireBurn: (duration) => {
    if(!audioCtx) return;
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = buffer;
    const biquadFilter = audioCtx.createBiquadFilter();
    biquadFilter.type = 'lowpass';
    biquadFilter.frequency.value = 1000;
    
    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + duration);
    
    noiseSource.connect(biquadFilter);
    biquadFilter.connect(gain);
    gain.connect(audioCtx.destination);
    noiseSource.start();
  }
};

function initAudio() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}
