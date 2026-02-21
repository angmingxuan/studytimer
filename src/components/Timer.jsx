import { useEffect, useRef } from 'react'

const MODE_LABELS = {
  focus: '🎯 Focus',
  short: '☕ Short Break',
  long: '🌙 Long Break',
}

export default function Timer({ mode, timeLeft, isRunning, onStart, onPause, onReset, onModeChange }) {
  const circleRef = useRef(null)

  const totalSeconds = (() => {
    if (mode === 'focus') return 25 * 60
    if (mode === 'short') return 5 * 60
    return 15 * 60
  })()

  useEffect(() => {
    if (!circleRef.current) return
    const radius = circleRef.current.r.baseVal.value
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (timeLeft / totalSeconds) * circumference
    circleRef.current.style.strokeDasharray = `${circumference}`
    circleRef.current.style.strokeDashoffset = `${offset}`
  }, [timeLeft, totalSeconds])

  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const seconds = String(timeLeft % 60).padStart(2, '0')

  return (
    <div className="timer-wrapper">
      <div className="mode-tabs">
        {Object.entries(MODE_LABELS).map(([key, label]) => (
          <button
            key={key}
            className={`mode-tab ${mode === key ? 'active' : ''}`}
            onClick={() => onModeChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="circle-container">
        <svg className="progress-ring" viewBox="0 0 200 200">
          <circle className="progress-ring__bg" cx="100" cy="100" r="88" />
          <circle
            ref={circleRef}
            className={`progress-ring__fg mode-${mode}`}
            cx="100"
            cy="100"
            r="88"
            transform="rotate(-90 100 100)"
          />
        </svg>
        <div className="time-display">
          <span className="time-text">{minutes}:{seconds}</span>
          <span className="mode-label">{MODE_LABELS[mode]}</span>
        </div>
      </div>

      <div className="controls">
        {isRunning ? (
          <button className="btn btn-pause" onClick={onPause}>⏸ Pause</button>
        ) : (
          <button className="btn btn-start" onClick={onStart}>▶ Start</button>
        )}
        <button className="btn btn-reset" onClick={onReset}>↺ Reset</button>
      </div>
    </div>
  )
}
