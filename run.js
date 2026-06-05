const fs = require('fs');
const js = fs.readFileSync('js/main.js', 'utf8');
const m = `
const document = {
  getElementById: () => ({style:{}, addEventListener:()=>{}, classList:{add:()=>{}, remove:()=>{}}}),
  addEventListener: () => {},
  body: { classList: {add:()=>{}, remove:()=>{}} }
};
const window = {
  innerWidth: 1000, innerHeight: 1000,
  addEventListener: () => {},
  location: { hash: '' },
  sessionStorage: { getItem: () => null, setItem: () => {} },
  AudioContext: class { createOscillator(){return {frequency:{setValueAtTime:()=>{}},start:()=>{},stop:()=>{}};} createGain(){return {gain:{setValueAtTime:()=>{}, exponentialRampToValueAtTime:()=>{}}};} },
  webkitAudioContext: class {}
};
const navigator = { userAgent: '' };
const gsap = { set: () => {}, to: () => {} };
const ScrollTrigger = { create: () => {} };
const projects = [];
const milestones = [];

` + js;

try {
  eval(m);
  console.log('OK');
} catch(e) {
  console.error('ERROR:', e.stack);
}
