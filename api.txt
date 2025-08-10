// api.js
export let ESP_IP = localStorage.getItem('espIP') || '192.168.1.114';

async function callESP(path) {
  try {
    // Use backticks and include the full url
    const res = await fetch(`http://${ESP_IP}${path}`, { mode: 'cors' });
    if (!res.ok) console.warn('ESP responded with', res.status);
    return res;
  } catch (e) {
    console.error('ESP call failed:', e);
    throw e;
  }
}

export function setPower(on) {
  return callESP(`/power?v=${on ? 1 : 0}`);
}

export function setFlash(on) {
  return callESP(`/flash?v=${on ? 1 : 0}`);
}

export function setBrightness(value) {
  // value expected 0..100
  return callESP(`/brightness?v=${value}`);
}

export function setFlashTiming(onMs, offMs) {
  return callESP(`/flashtime?on=${onMs}&off=${offMs}`);
}

export function saveEspIp(ip) {
  ESP_IP = ip;
  localStorage.setItem('espIP', ip);
}
