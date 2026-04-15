import { useEffect } from 'react';
import { Timer } from './components/Timer';
import { useTimer } from './hooks/useTimer';
import { playAlarm } from './utils/alarm';
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
      />
    </div>
  );
}

export default App;
