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
  const tooltipText = `Click to ${isRunning ? 'pause' : 'play'}`;
  const accentColor = mode === 'work' ? 'var(--accent-focus)' : 'var(--accent-break)';

  return (
    <div className="timer-section">
      <div 
        className={`time-display-wrapper shutter-hover ${isHovered ? 'active' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ '--accent-current': accentColor }}
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
                <div className="time-display mode-title">
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
          </div>
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
