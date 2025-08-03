// main.js
import { setPower, setFlash, setBrightness, saveEspIp } from './api.js';

// State
let powerOn = true;
let flashOn = false;

// Elements
const powerBtn = document.getElementById('powerBtn');
const flashBtn = document.getElementById('flashBtn');
const flashSettingsBtn = document.getElementById('flashSettingsBtn');
const bottomControls = document.getElementById('bottomControls');
const brightnessContainer = document.getElementById('brightnessSliderContainer');
const sliderThumb = document.getElementById('sliderThumb');
const percentageLabel = document.getElementById('percentageLabel');

const infoModal = document.getElementById('infoModal');
const flashSettingsModal = document.getElementById('flashSettingsModal');
const flashError = document.getElementById('flashError');
const flashSaveBtn = document.getElementById('flashSaveBtn');
const onTimeInput = document.getElementById('onTimeInput');
const offTimeInput = document.getElementById('offTimeInput');

// Helpers
function showModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { 
  document.getElementById(id).classList.remove('active');
  flashError.style.display = 'none';
}

// UI Update
function updateUI() {
  powerBtn.classList.toggle('active', powerOn);
  powerBtn.setAttribute('aria-pressed', powerOn);
  flashBtn.classList.toggle('active', flashOn);
  flashBtn.setAttribute('aria-pressed', flashOn);
  flashSettingsBtn.hidden = !(flashOn && powerOn);
  if (powerOn) bottomControls.classList.add('visible');
  else bottomControls.classList.remove('visible');
  brightnessContainer.style.display = (flashOn ? 'none' : 'block');
}

// Action Handlers
async function togglePower() {
  powerOn = !powerOn;
  if (!powerOn && flashOn) flashOn = false;
  updateUI();
  await setPower(powerOn);
}
async function toggleFlash() {
  if (!powerOn) return;
  flashOn = !flashOn;
  updateUI();
  await setFlash(flashOn);
}

// Flash Settings
flashSaveBtn.addEventListener('click', () => {
  const onTime = parseInt(onTimeInput.value,10);
  const offTime = parseInt(offTimeInput.value,10);
  if (isNaN(onTime)||isNaN(offTime)||onTime<10||offTime<10) {
    flashError.style.display='block'; return;
  }
  localStorage.setItem('flashSettings', JSON.stringify({onTime,offTime}));
  closeModal('flashSettingsModal');
});

// Slider Logic
;(function(){
  let value = Number(localStorage.getItem('brightness')) || 50;
  let dragging = false, lastLog = value;
  function updateSlider() {
    sliderThumb.style.left = value + '%';
    sliderThumb.setAttribute('aria-valuenow', Math.round(value));
    percentageLabel.textContent = Math.round(value) + '%';
    percentageLabel.style.left = value + '%';
  }
  function onDown(e) {
    e.preventDefault(); dragging = true;
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }
  function onMove(e) {
    if (!dragging) return;
    const rect = brightnessContainer.getBoundingClientRect();
    let v = ((e.clientX - rect.left)/rect.width)*100;
    value = Math.min(Math.max(v,0),100);
    updateSlider();
    const r = Math.round(value);
    if (r!==lastLog) { console.log('Slider:',r); lastLog=r; }
  }
  async function onUp() {
    if (!dragging) return;
    dragging = false;
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    localStorage.setItem('brightness', Math.round(value));
    await setBrightness(Math.round(value));
  }
  sliderThumb.addEventListener('pointerdown', onDown);
  brightnessContainer.addEventListener('pointerdown', onDown);
  updateSlider();
})();

// Info modal & Escape
document.addEventListener('keydown', e=>{
  if (e.key==='Escape') ['infoModal','flashSettingsModal'].forEach(id=>{
    document.getElementById(id).classList.toggle('active',false);
  });
});

// Initial UI
updateUI();
