import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_WORK_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;

export function useTimer() {
  const [mode, setMode] = useState('work');
  const [isRunning, setIsRunning] = useState(false);
  
  // Load initial durations from localStorage or use defaults
  const [workDuration, setWorkDuration] = useState(() => {
    const saved = localStorage.getItem('patata-work-duration');
    return saved ? parseInt(saved, 10) : DEFAULT_WORK_TIME;
  });
  
  const [breakDuration, setBreakDuration] = useState(() => {
    const saved = localStorage.getItem('patata-break-duration');
    return saved ? parseInt(saved, 10) : DEFAULT_BREAK_TIME;
  });

  const [timeLeft, setTimeLeft] = useState(workDuration);
  const intervalRef = useRef(null);

  // Persistence: Save durations to localStorage
  useEffect(() => {
    localStorage.setItem('patata-work-duration', workDuration.toString());
  }, [workDuration]);

  useEffect(() => {
    localStorage.setItem('patata-break-duration', breakDuration.toString());
  }, [breakDuration]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsRunning(false);
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const title = isRunning 
      ? `${mode === 'work' ? 'Focus' : 'Break'} ${formatTime(timeLeft)} - Patata`
      : 'Patata';
    document.title = title;
  }, [timeLeft, isRunning, mode]);

  const switchMode = useCallback(() => {
    const newMode = mode === 'work' ? 'break' : 'work';
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? workDuration : breakDuration);
  }, [mode, workDuration, breakDuration]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? workDuration : breakDuration);
  }, [mode, workDuration, breakDuration]);

  const setWorkTime = useCallback((minutes) => {
    const seconds = minutes * 60;
    setWorkDuration(seconds);
    if (mode === 'work' && !isRunning) {
      setTimeLeft(seconds);
    }
  }, [mode, isRunning]);

  const setBreakTime = useCallback((minutes) => {
    const seconds = minutes * 60;
    setBreakDuration(seconds);
    if (mode === 'break' && !isRunning) {
      setTimeLeft(seconds);
    }
  }, [mode, isRunning]);

  const currentDuration = mode === 'work' ? workDuration : breakDuration;

  return {
    timeLeft: formatTime(timeLeft),
    timeLeftSeconds: timeLeft,
    isRunning,
    mode,
    workDuration: workDuration / 60,
    breakDuration: breakDuration / 60,
    currentDuration,
    start,
    pause,
    reset,
    setWorkTime,
    setBreakTime,
    switchMode,
  };
}
