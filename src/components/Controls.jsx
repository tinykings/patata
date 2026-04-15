export function Controls({ 
  isRunning, 
  onStart, 
  onPause, 
}) {
  return (
    <div className="controls">
      {!isRunning ? (
        <button className="main-btn paused" onClick={onStart}>
          Start
        </button>
      ) : (
        <button className="main-btn running" onClick={onPause}>
          Stop
        </button>
      )}
    </div>
  );
}
