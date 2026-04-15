import { useEffect } from 'react';
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
    if (musicStation) {
      const url = STATION_URLS[musicStation];
      if (isRunning) {
        play(url);
      } else {
        stop();
      }
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
        workDuration={workDuration}
        breakDuration={breakDuration}
        onWorkChange={setWorkTime}
        onBreakChange={setBreakTime}
        musicStation={musicStation}
        onMusicChange={setMusicStation}
      />
    </div>
  );
}

export default App;
