let audio = null;
let fadeInterval = null;

export const STATION_URLS = {
  'groove-salad': 'https://ice1.somafm.com/groovesalad-256-mp3',
};

export function play(url, onFadeComplete) {
  stop();
  audio = new Audio(url);
  audio.loop = true;
  audio.volume = 0;
  audio.play().catch(() => {});

  const steps = 30;
  let currentStep = 0;

  fadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = currentStep / steps;
    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      onFadeComplete?.();
    }
  }, 100);
}

export function fadeOut(onFadeComplete) {
  if (!audio || audio.paused) {
    onFadeComplete?.();
    return;
  }

  const startVolume = audio.volume;
  const steps = 30;
  let currentStep = 0;

  clearInterval(fadeInterval);
  fadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = Math.max(0, startVolume * (1 - currentStep / steps));
    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      audio.pause();
      onFadeComplete?.();
    }
  }, 100);
}

export function fadeIn(durationSteps = 30, onFadeComplete) {
  if (!audio) {
    onFadeComplete?.();
    return;
  }

  if (audio.volume === 0 && audio.paused) {
    audio.play().catch(() => {});
  }

  const startVolume = audio.volume;
  const steps = durationSteps;
  let currentStep = 0;

  clearInterval(fadeInterval);
  fadeInterval = setInterval(() => {
    currentStep++;
    audio.volume = Math.min(1, startVolume + (1 - startVolume) * (currentStep / steps));
    if (currentStep >= steps) {
      clearInterval(fadeInterval);
      fadeInterval = null;
      onFadeComplete?.();
    }
  }, 100);
}

export function stop() {
  clearInterval(fadeInterval);
  fadeInterval = null;
  if (audio) {
    audio.pause();
    audio.src = '';
    audio = null;
  }
}

export function isPlaying() {
  return audio && !audio.paused;
}
