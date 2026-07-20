let deferredPrompt = null;
let installAvailable = false;
const listeners = new Set();

function notify() {
  for (const fn of listeners) fn(installAvailable);
}

export function initPwa() {
  if (window.matchMedia('(display-mode: standalone)').matches) {
    installAvailable = false;
    return;
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installAvailable = true;
    notify();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installAvailable = false;
    notify();
  });

  if ('serviceWorker' in navigator) {
    const base = import.meta.env.BASE_URL;
    navigator.serviceWorker.register(`${base}sw.js`).catch(() => {});
  }
}

export function onInstallAvailabilityChange(fn) {
  listeners.add(fn);
  fn(installAvailable);
  return () => listeners.delete(fn);
}

export function canInstall() {
  return installAvailable && deferredPrompt !== null;
}

export async function promptInstall() {
  if (!deferredPrompt) return false;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installAvailable = false;
  notify();
  return true;
}
