let audio = null;
let fadeInterval = null;

export const STATION_URLS = {
  '9128': 'http://streams.radio.co:80/s0aa1e6f4a/listen',
  'drone-zone': 'https://ice1.somafm.com/dronezone-256-mp3',
  'groove-salad': 'https://ice1.somafm.com/groovesalad-256-mp3',
  'kiosk-radio': 'https://kioskradiobxl.out.airtime.pro/kioskradiobxl_b',
  'le-mellotron': 'https://listen.radioking.com/radio/477719/stream/534044',
  'nightwave-plaza': 'http://radio.plaza.one/ogg',
  'nts-la': 'http://stream-relay-geo.ntslive.net/stream2',
  'nts-london': 'http://stream-relay-geo.ntslive.net/stream',
  'radio-paradise': 'http://stream.radioparadise.com/mp3-192',
  'radiomeuh': 'https://radiomeuh.ice.infomaniak.ch/radiomeuh-128.mp3',
  'soho-radio': 'https://sohoradiomusic.doughunt.co.uk:8010/320mp3',
  'space-station': 'http://ice2.somafm.com/spacestation-128-aac',
  'subcity-radio': 'https://stream.subcity.org/listen',
  'the-lot-radio': 'https://mdw-prod-catalyst-0.lp-playback.studio/hls/video+85c28sa2o8wppm58/index.m3u8?video=false',
};

export function play(url, onFadeComplete, onPlaying) {
  stop();
  audio = new Audio(url);
  audio.loop = true;
  audio.volume = 0;
  audio.addEventListener('playing', () => onPlaying?.(), { once: true });
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
