import { useEffect, useState } from 'react';
import { Timer } from './components/Timer';
import { useTimer } from './hooks/useTimer';
import { playAlarm } from './utils/alarm';
import { play, stop, fadeOut, fadeIn, STATION_URLS } from './utils/musicPlayer';
import './App.css';

function App() {
  const {
    timeLeft,
    timeLeftSeconds,
    isRunning,
    mode,
    workDuration,
    breakDuration,
    currentDuration,
    start,
    pause,
    setWorkTime,
    setBreakTime,
    switchMode,
    musicStation,
    setMusicStation,
  } = useTimer();

  const [isMusicLoading, setIsMusicLoading] = useState(false);

  useEffect(() => {
    if (timeLeftSeconds === 0 && !isRunning) {
      playAlarm();
      if (Notification.permission === 'granted') {
        new Notification('Patata', {
          body: mode === 'work' ? 'Time for a break' : 'Ready to focus?',
        });
      }
      switchMode();
      setTimeout(() => start(), 100);
    }
  }, [timeLeftSeconds, isRunning, mode, switchMode, start]);

  useEffect(() => {
    const color = mode === 'work' ? '%2306d6a0' : '%23ffd166';
    const favicon = document.querySelector("link[rel='icon']");
    if (favicon) {
      favicon.href = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='40' fill='${color}'/></svg>`;
    }
  }, [mode]);

  useEffect(() => {
    if (musicStation && isRunning) {
      setIsMusicLoading(true);
      const timeout = setTimeout(() => setIsMusicLoading(false), 3000);
      play(STATION_URLS[musicStation], null, () => {
        clearTimeout(timeout);
        setIsMusicLoading(false);
      });
    } else if (!musicStation || !isRunning) {
      stop();
      setIsMusicLoading(false);
    }
  }, [isRunning, musicStation]);

  useEffect(() => {
    if (musicStation && timeLeftSeconds === 5) {
      fadeOut();
    }
  }, [timeLeftSeconds, musicStation]);

  useEffect(() => {
    if (musicStation && timeLeftSeconds === 0 && isRunning) {
      fadeIn(50);
    }
  }, [timeLeftSeconds, isRunning, musicStation]);

  const toggleTimer = () => {
    if (isRunning) {
      pause();
    } else {
      if (Notification.permission === 'default') {
        Notification.requestPermission();
      }
      start();
    }
  };

  return (
    <div className="app">
      <Timer 
        timeLeft={timeLeft} 
        mode={mode} 
        isRunning={isRunning}
        currentDuration={currentDuration}
        timeLeftSeconds={timeLeftSeconds}
        onToggle={toggleTimer}
        onSwitchMode={switchMode}
        onStart={start}
        workDuration={workDuration}
        breakDuration={breakDuration}
        onWorkChange={setWorkTime}
        onBreakChange={setBreakTime}
        musicStation={musicStation}
        onMusicChange={setMusicStation}
        isMusicLoading={isMusicLoading}
      />
    </div>
  );
}

export default App;
