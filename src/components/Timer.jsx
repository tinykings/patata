import { useState } from 'react';

const STATION_LABELS = {
  '9128': '9128',
  'drone-zone': 'Drone Zone',
  'groove-salad': 'Groove Salad',
  'kiosk-radio': 'Kiosk Radio',
  'le-mellotron': 'Le Mellotron',
  'nightwave-plaza': 'Nightwave Plaza',
  'nts-la': 'NTS LA',
  'nts-london': 'NTS London',
  'radio-paradise': 'Radio Paradise',
  'radiomeuh': 'Radiomeuh',
  'soho-radio': 'Soho Radio',
  'space-station': 'Space Station',
  'subcity-radio': 'Subcity Radio',
  'the-lot-radio': 'The Lot Radio',
};

export function Timer({ 
  timeLeft, 
  mode, 
  isRunning, 
  currentDuration, 
  timeLeftSeconds, 
  onToggle,
  onSwitchMode,
  onStart,
  workDuration,
  breakDuration,
  onWorkChange,
  onBreakChange,
  musicStation,
  onMusicChange,
  isMusicLoading
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [justClicked, setJustClicked] = useState(false);

  const handleToggle = () => {
    setJustClicked(true);
    setTimeout(() => setJustClicked(false), 200);
    onToggle();
  };
  
  // Calculate progress: 0 when starting, 100 when finished
  const progress = currentDuration > 0 
    ? ((currentDuration - timeLeftSeconds) / currentDuration) * 100 
    : 0;

  const displayLabel = mode === 'work' ? 'Focus' : 'Break';
  const tooltipText = `CLICK TO ${isRunning ? 'PAUSE' : 'PLAY'}`;
  const accentColor = mode === 'work' ? 'var(--accent-focus)' : 'var(--accent-break)';

  return (
    <div className="timer-section">
      <div 
        className={`time-display-wrapper shutter-hover ${isHovered ? 'active' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ '--accent-current': accentColor }}
        title={displayLabel.toUpperCase()}
      >
        <div 
          className={`shutter-container ${justClicked ? 'click-pulse' : ''}`} 
          onClick={handleToggle}
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
                <div className="time-display mode-title" style={{ textTransform: 'uppercase' }}>
                  {displayLabel}
                </div>
              </div>
            </div>          </div>
        </div>
        
        <div className={`hover-content ${isHovered ? 'visible' : ''}`}>
          <div className="mode-switch">
            {mode === 'break' && (
              <button 
                className="mode-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchMode();
                  if (isRunning) onStart();
                }}
                title="Switch to Focus"
              >
                Focus
              </button>
            )}
            {mode === 'work' && (
              <button 
                className="mode-btn mode-btn-break"
                onClick={(e) => {
                  e.stopPropagation();
                  onSwitchMode();
                  if (isRunning) onStart();
                }}
                title="Switch to Break"
              >
                Break
              </button>
            )}
          </div>
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
            <div className="divider" />
            <div className="setting-input">
              <label>Music</label>
              <select 
                value={musicStation || ''} 
                onChange={(e) => onMusicChange(e.target.value || null)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">None</option>
                <option value="9128">9128</option>
                <option value="drone-zone">Drone Zone</option>
                <option value="groove-salad">Groove Salad</option>
                <option value="kiosk-radio">Kiosk Radio</option>
                <option value="le-mellotron">Le Mellotron</option>
                <option value="nightwave-plaza">Nightwave Plaza</option>
                <option value="nts-la">NTS LA</option>
                <option value="nts-london">NTS London</option>
                <option value="radio-paradise">Radio Paradise</option>
                <option value="radiomeuh">Radiomeuh</option>
                <option value="soho-radio">Soho Radio</option>
                <option value="space-station">Space Station</option>
                <option value="subcity-radio">Subcity Radio</option>
                <option value="the-lot-radio">The Lot Radio</option>
              </select>
            </div>
            <a 
              className="tinykings-link" 
              href="https://github.com/tinykings/patata" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="timer-mode-label" style={{ color: accentColor }}>
          {displayLabel}
        </div>
        {musicStation && isRunning && (
          <div className="music-station-display">
            {isMusicLoading ? 'loading...' : STATION_LABELS[musicStation]}
          </div>
        )}
      </div>
    </div>
  );
}
