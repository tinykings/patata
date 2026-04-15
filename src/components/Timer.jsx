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
  onBreakChange,
  musicStation,
  onMusicChange
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return {
        icon: 'iOS',
        title: 'Install on iOS',
        steps: [
          'Tap the Share button in Safari',
          'Scroll down and tap "Add to Home Screen"',
          'Tap "Add" to confirm'
        ]
      };
    }
    
    if (/Android/.test(userAgent)) {
      return {
        icon: 'Android',
        title: 'Install on Android',
        steps: [
          'Tap the menu button (three dots)',
          'Tap "Install app" or "Add to Home screen"',
          'Tap "Install" to confirm'
        ]
      };
    }
    
    return {
      icon: 'Desktop',
      title: 'Install on Desktop',
      steps: [
        'Click the install icon in the address bar',
        'Or use Ctrl+Shift+B (Windows/Linux)',
        'Look for the app launcher icon in your dock'
      ]
    };
  };
  
  const instructions = getInstallInstructions();
  
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
            <div className="divider" />
            <div className="setting-input">
              <label>Music</label>
              <select 
                value={musicStation || ''} 
                onChange={(e) => onMusicChange(e.target.value || null)}
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">None</option>
                <option value="groove-salad">Groove Salad</option>
                <option value="drone-zone">Drone Zone</option>
                <option value="nts-london">NTS London</option>
                <option value="nts-la">NTS LA</option>
              </select>
            </div>
          </div>
          
          <div className="install-section">
            <div className="install-header">
              <span className="install-icon">{instructions.icon === 'iOS' ? '🍎' : instructions.icon === 'Android' ? '🤖' : '💻'}</span>
              <span>{instructions.title}</span>
            </div>
            <ul className="install-steps">
              {instructions.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
