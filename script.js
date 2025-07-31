const themes = [
  { name: "Electric Blue & Dark Gray", bg: "#0F0F0F", fg: "#0000FF" },
  { name: "Baby Blue & Dark Gray",    bg: "#0F0F0F", fg: "#B3E6FF" },
  { name: "Bubblegum Pink & White",    bg: "#FFFFFF", fg: "#FF66B3" },
  { name: "Forest Green & Dark Gray",  bg: "#0F0F0F", fg: "#008000" },
  { name: "Gold & Dark Gray",          bg: "#0F0F0F", fg: "#FFFF00" },
  { name: "Cherry & Dark Gray",        bg: "#0F0F0F", fg: "#FF0000" },
  { name: "Soft Lilac & White",        bg: "#FFFFFF", fg: "#CCB3FF" },
  { name: "Custom",                    bg: "#0000FF", fg: "#FFFFFF", custom: true }
];

let state = {
  isOn: false,
  brightness: 35,
  flashMode: false,
  flashOn: 100,
  flashOff: 100,
  selectedTheme: themes[0]
};

const root = document.documentElement;
const powerBtn = document.getElementById("power-btn");
const controls = document.getElementById("controls");
const brightnessInput = document.getElementById("brightness");
const brightnessLabel = document.getElementById("brightness-label");
const minusBtn = document.getElementById("minus-bright");
const plusBtn = document.getElementById("plus-bright");
const flashToggle = document.getElementById("flash-toggle");
const flashSettingsBtn = document.getElementById("flash-settings-btn");
const flashModal = document.getElementById("flash-modal");
const flashOnInput = document.getElementById("flash-on");
const flashOffInput = document.getElementById("flash-off");
const flashApply = document.getElementById("flash-apply");
const flashCancel = document.getElementById("flash-cancel");
const flashError = document.getElementById("flash-error");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const themeSelect = document.getElementById("theme-select");
const customColors = document.getElementById("custom-colors");
const customPrimary = document.getElementById("custom-primary");
const customSecondary = document.getElementById("custom-secondary");
const colorError = document.getElementById("color-error");
const closeSettings = document.getElementById("settings-close");
const notification = document.getElementById("notification");

function applyTheme() {
  const t = state.selectedTheme;
  root.style.setProperty('--bg', t.bg);
  root.style.setProperty('--fg', t.fg);
}

function showNotification(msg) {
  notification.textContent = msg;
  notification.classList.remove('hidden');
  setTimeout(() => {
    notification.classList.add('hidden');
  }, 4000);
}

powerBtn.addEventListener('click', () => {
  state.isOn = !state.isOn;
  controls.classList.toggle('hidden', !state.isOn);
});

function updateBrightness() {
  const pct = Math.round((state.brightness / 35) * 100);
  brightnessLabel.textContent = pct + '%';
}

minusBtn.addEventListener('click', () => {
  state.brightness = Math.max(0, state.brightness - 1);
  brightnessInput.value = state.brightness;
  updateBrightness();
});
plusBtn.addEventListener('click', () => {
  state.brightness = Math.min(35, state.brightness + 1);
  brightnessInput.value = state.brightness;
  updateBrightness();
});
brightnessInput.addEventListener('input', () => {
  state.brightness = Number(brightnessInput.value);
  updateBrightness();
});

flashToggle.addEventListener('click', () => {
  state.flashMode = !state.flashMode;
  flashToggle.style.background = state.flashMode ? state.selectedTheme.fg : '';
  flashToggle.style.color = state.flashMode ? state.selectedTheme.bg : '';
  flashSettingsBtn.style.display = state.flashMode ? 'inline' : 'none';
});
flashSettingsBtn.addEventListener('click', () => flashModal.classList.remove('hidden'));
flashCancel.addEventListener('click', () => flashModal.classList.add('hidden'));
flashApply.addEventListener('click', () => {
  const on = Number(flashOnInput.value), off = Number(flashOffInput.value);
  if (isNaN(on) || isNaN(off) || on < 10 || on > 10000 || off < 10 || off > 10000) {
    flashError.classList.remove('hidden');
    showNotification("Enter valid numbers.");
  } else {
    state.flashOn = on; state.flashOff = off;
    flashError.classList.add('hidden');
    flashModal.classList.add('hidden');
  }
});

themes.forEach((t, i) => {
  const opt = document.createElement('option');
  opt.value = i;
  opt.text = t.name;
  themeSelect.add(opt);
});
themeSelect.addEventListener('change', e => {
  state.selectedTheme = themes[e.target.value];
  customColors.classList.toggle('hidden', !state.selectedTheme.custom);
  applyTheme();
});
customPrimary.addEventListener('input', () => {
  const fg = customPrimary.value, bg = customSecondary.value;
  state.selectedTheme.bg = fg;
  state.selectedTheme.fg = bg;
  root.style.setProperty('--bg', fg);
  root.style.setProperty('--fg', bg);
});
customSecondary.addEventListener('input', () => {
  const fg = customPrimary.value, bg = customSecondary.value;
  state.selectedTheme.bg = fg;
  state.selectedTheme.fg = bg;
  root.style.setProperty('--bg', fg);
  root.style.setProperty('--fg', bg);
});

closeSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
settingsBtn.addEventListener('click', () => settingsModal.classList.remove('hidden'));

applyTheme();
updateBrightness();
