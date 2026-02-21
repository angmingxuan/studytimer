import { useState, useEffect, useCallback, useRef } from 'react'
import Timer from './components/Timer'
import Stats from './components/Stats'
import Settings from './components/Settings'

const STORAGE_KEYS = {
  sessions: 'study_timer_sessions',
  settings: 'study_timer_settings',
}

const DEFAULT_SETTINGS = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

function getModeSeconds(mode, settings) {
  if (mode === 'focus') return settings.focusMinutes * 60
  if (mode === 'short') return settings.shortBreakMinutes * 60
  return settings.longBreakMinutes * 60
}

export default function App() {
  const [settings, setSettings] = useState(() =>
    loadFromStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  )
  const [sessions, setSessions] = useState(() =>
    loadFromStorage(STORAGE_KEYS.sessions, [])
  )

  const [mode, setMode] = useState('focus')
  const [timeLeft, setTimeLeft] = useState(() => settings.focusMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState('timer')

  const focusSessionCount = useRef(
    sessions.filter(s => s.mode === 'focus').length
  )

  const intervalRef = useRef(null)

  // Persist settings
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.settings, settings)
  }, [settings])

  // Persist sessions
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.sessions, sessions)
  }, [sessions])

  const handleModeChange = useCallback((newMode) => {
    setIsRunning(false)
    clearInterval(intervalRef.current)
    setMode(newMode)
    setTimeLeft(getModeSeconds(newMode, settings))
  }, [settings])

  const handleReset = useCallback(() => {
    setIsRunning(false)
    clearInterval(intervalRef.current)
    setTimeLeft(getModeSeconds(mode, settings))
  }, [mode, settings])

  const recordSession = useCallback((finishedMode) => {
    const durationMinutes = Math.round(getModeSeconds(finishedMode, settings) / 60)
    const newSession = {
      mode: finishedMode,
      duration: durationMinutes,
      timestamp: Date.now(),
    }
    setSessions(prev => [...prev, newSession])

    if (finishedMode === 'focus') {
      focusSessionCount.current += 1
      const isLongBreak =
        focusSessionCount.current % settings.sessionsBeforeLongBreak === 0
      const nextMode = isLongBreak ? 'long' : 'short'
      setMode(nextMode)
      setTimeLeft(getModeSeconds(nextMode, settings))
    } else {
      setMode('focus')
      setTimeLeft(getModeSeconds('focus', settings))
    }
  }, [settings])

  // Countdown effect
  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current)
      return
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          setIsRunning(false)
          // Use a short timeout to let state settle before recording
          setTimeout(() => recordSession(mode), 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(intervalRef.current)
  }, [isRunning, mode, recordSession])

  // When settings change, reset timeLeft for the current mode
  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings)
    setIsRunning(false)
    clearInterval(intervalRef.current)
    setTimeLeft(getModeSeconds(mode, newSettings))
  }

  const handleClearHistory = () => {
    setSessions([])
    focusSessionCount.current = 0
  }

  const totalFocusMinutes = sessions
    .filter(s => s.mode === 'focus')
    .reduce((acc, s) => acc + s.duration, 0)

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Study Timer</h1>
        <nav className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'timer' ? 'active' : ''}`}
            onClick={() => setActiveTab('timer')}
          >
            ⏱ Timer
          </button>
          <button
            className={`nav-tab ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Stats
          </button>
          <button
            className={`nav-tab ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            ⚙️ Settings
          </button>
        </nav>
      </header>

      <main className="app-main">
        {activeTab === 'timer' && (
          <Timer
            mode={mode}
            timeLeft={timeLeft}
            isRunning={isRunning}
            onStart={() => setIsRunning(true)}
            onPause={() => setIsRunning(false)}
            onReset={handleReset}
            onModeChange={handleModeChange}
          />
        )}
        {activeTab === 'stats' && (
          <Stats sessions={sessions} totalFocusMinutes={totalFocusMinutes} />
        )}
        {activeTab === 'settings' && (
          <Settings
            settings={settings}
            onChange={handleSettingsChange}
            onClearHistory={handleClearHistory}
          />
        )}
      </main>
    </div>
  )
}
