// api.js
export let ESP_IP = localStorage.getItem('espIP') || '192.168.1.114';

async function callESP(path) {
  try {
    const res = await fetch(`http://${ESP_IP}${path}`);
    if (!res.ok) console.warn('ESP responded with', res.status);
  } catch (e) {
    console.error('ESP call failed:', e);
  }
}

export function setPower(on) {
  return callESP(`/power?v=${on ? 1 : 0}`);
}

export function setFlash(on) {
  return callESP(`/flash?v=${on ? 1 : 0}`);
}

export function setBrightness(value) {
  return callESP(`/brightness?v=${value}`);
}

export function saveEspIp(ip) {
  ESP_IP = ip;
  localStorage.setItem('espIP', ip);
}
