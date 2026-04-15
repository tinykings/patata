import { useState } from 'react';

export function Timer({ 
  timeLeft, 
  mode, 
  isRunning, 
  currentDuration, 
  timeLeftSeconds, 
  onToggle,
  workDuration,
  breakDuration,
  onWorkChange,
  onBreakChange
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate progress: 0 when starting, 100 when finished
  const progress = currentDuration > 0 
    ? ((currentDuration - timeLeftSeconds) / currentDuration) * 100 
    : 0;

  const displayLabel = mode === 'work' ? 'Focus' : 'Break';
  const tooltipText = `Click to ${isRunning ? 'pause' : 'play'}`;

  return (
    <div className="timer-section">
      <div 
        className={`time-display-wrapper shutter-hover ${isHovered ? 'active' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="shutter-container" 
          onClick={onToggle}
          title={tooltipText}
        >
          <div className="shutter-inner-mask">
            {/* Numbers View */}
            <div className="shutter-view view-numbers">
              <div 
                className="time-display" 
                style={{ '--progress': `${progress}%` }}
              >
                {timeLeft}
              </div>
            </div>

            {/* Title View */}
            <div className="shutter-view view-title">
              <div className="mode-title-container">
                <div className="mini-timer">{timeLeft}</div>
                <div className="time-display mode-title">
                  {displayLabel}
                </div>
              </div>
            </div>          </div>
        </div>
        
        <div className={`hover-content ${isHovered ? 'visible' : ''}`}>
          <div className="inline-settings">
            <div className="setting-input">
              <label>Focus</label>
              <input 
                type="number" 
                value={workDuration} 
                onChange={(e) => onWorkChange(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                min="1"
              />
            </div>
            <div className="divider" />
            <div className="setting-input">
              <label>Break</label>
              <input 
                type="number" 
                value={breakDuration} 
                onChange={(e) => onBreakChange(Number(e.target.value))}
                onClick={(e) => e.stopPropagation()}
                min="1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
