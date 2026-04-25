import { useState, useEffect, useRef, useCallback } from 'react';

const DEFAULT_WORK_TIME = 25 * 60;
const DEFAULT_BREAK_TIME = 5 * 60;

function readDuration(key, fallback) {
  const saved = localStorage.getItem(key);
  const parsed = saved ? Number.parseInt(saved, 10) : Number.NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function normalizeMinutes(value) {
  const minutes = typeof value === 'string' ? Number.parseInt(value, 10) : value;
  if (!Number.isFinite(minutes) || minutes < 1) {
    return null;
  }

  return minutes;
}

export function useTimer() {
  const [mode, setMode] = useState('work');
  const [isRunning, setIsRunning] = useState(false);
  
  const [workDuration, setWorkDuration] = useState(() => {
    return readDuration('patata-work-duration', DEFAULT_WORK_TIME);
  });
  
  const [breakDuration, setBreakDuration] = useState(() => {
    return readDuration('patata-break-duration', DEFAULT_BREAK_TIME);
  });

  const [musicStation, setMusicStation] = useState(() => {
    const saved = localStorage.getItem('patata-music-station');
    return saved || null;
  });

  const [timeLeft, setTimeLeft] = useState(workDuration);
  const intervalRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('patata-work-duration', workDuration.toString());
  }, [workDuration]);

  useEffect(() => {
    localStorage.setItem('patata-break-duration', breakDuration.toString());
  }, [breakDuration]);

  useEffect(() => {
    localStorage.setItem('patata-music-station', musicStation || '');
  }, [musicStation]);

  useEffect(() => {
    if (!isRunning) {
      return undefined;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsRunning(false);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [isRunning]);

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
    const normalizedMinutes = normalizeMinutes(minutes);
    if (normalizedMinutes === null) return;

    const seconds = normalizedMinutes * 60;
    setWorkDuration(seconds);
    if (mode === 'work' && !isRunning) {
      setTimeLeft(seconds);
    }
  }, [mode, isRunning]);

  const setBreakTime = useCallback((minutes) => {
    const normalizedMinutes = normalizeMinutes(minutes);
    if (normalizedMinutes === null) return;

    const seconds = normalizedMinutes * 60;
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
    musicStation,
    setMusicStation,
  };
}
