// main.js
import { setPower, setFlash, setBrightness, setFlashTiming, saveEspIp } from './api.js';

// Put UI logic inside DOMContentLoaded so elements exist
document.addEventListener('DOMContentLoaded', () => {
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

  // Helpers (exposed globally because index.html uses onclick attributes)
  window.showModal = function (id) { document.getElementById(id).classList.add('active'); };
  window.closeModal = function (id) {
    document.getElementById(id).classList.remove('active');
    flashError.style.display = 'none';
  };

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

  // Action Handlers (exposed globally)
  window.togglePower = async function () {
    const prev = powerOn;
    powerOn = !powerOn;
    if (!powerOn && flashOn) flashOn = false;
    updateUI();
    try {
      await setPower(powerOn);
    } catch (e) {
      // revert on error
      console.error('setPower failed', e);
      powerOn = prev;
      updateUI();
    }
  };

  window.toggleFlash = async function () {
    if (!powerOn) return;
    const prev = flashOn;
    flashOn = !flashOn;
    updateUI();
    try {
      await setFlash(flashOn);
    } catch (e) {
      console.error('setFlash failed', e);
      flashOn = prev;
      updateUI();
    }
  };

  // Flash Settings modal
  window.showFlashSettings = function () {
    const saved = JSON.parse(localStorage.getItem('flashSettings') || '{}');
    onTimeInput.value = saved.onTime ?? 500;
    offTimeInput.value = saved.offTime ?? 500;
    flashError.style.display = 'none';
    showModal('flashSettingsModal');
  };

  flashSaveBtn.addEventListener('click', async () => {
    const onTime = parseInt(onTimeInput.value, 10);
    const offTime = parseInt(offTimeInput.value, 10);
    if (isNaN(onTime) || isNaN(offTime) || onTime < 10 || offTime < 10) {
      flashError.style.display = 'block';
      return;
    }
    // Save locally and push to ESP
    localStorage.setItem('flashSettings', JSON.stringify({ onTime, offTime }));
    try {
      await setFlashTiming(onTime, offTime);
    } catch (e) {
      console.error('setFlashTiming failed', e);
      // We still keep the setting locally
    }
    closeModal('flashSettingsModal');
  });

  // Slider logic (brightness)
  (function () {
    let value = Number(localStorage.getItem('brightness')) || 50;
    let dragging = false;
    let lastSent = Math.round(value);

    function updateSliderUI() {
      sliderThumb.style.left = value + '%';
      sliderThumb.setAttribute('aria-valuenow', Math.round(value));
      percentageLabel.textContent = Math.round(value) + '%';
      percentageLabel.style.left = value + '%';
    }

    function onDown(e) {
      e.preventDefault();
      dragging = true;
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    }

    function onMove(e) {
      if (!dragging) return;
      const rect = brightnessContainer.getBoundingClientRect();
      let v = ((e.clientX - rect.left) / rect.width) * 100;
      value = Math.min(Math.max(v, 0), 100);
      updateSliderUI();
    }

    async function onUp() {
      if (!dragging) return;
      dragging = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      const rounded = Math.round(value);
      localStorage.setItem('brightness', rounded);
      if (rounded !== lastSent) {
        try {
          await setBrightness(rounded);
          lastSent = rounded;
        } catch (e) {
          console.error('setBrightness failed', e);
        }
      }
    }

    sliderThumb.addEventListener('pointerdown', onDown);
    brightnessContainer.addEventListener('pointerdown', onDown);
    updateSliderUI();
  })();

  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      ['infoModal', 'flashSettingsModal'].forEach((id) => {
        document.getElementById(id).classList.remove('active');
      });
    }
  });

  // Allow saving ESP IP via developer console easily:
  window.saveEspIp = (ip) => {
    saveEspIp(ip);
    console.log('Saved ESP IP:', ip);
  };

  // Initial UI render
  updateUI();
});
