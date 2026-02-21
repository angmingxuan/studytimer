export default function Stats({ sessions, totalFocusMinutes }) {
  const today = new Date().toLocaleDateString()

  const todaySessions = sessions.filter(s => {
    const d = new Date(s.timestamp).toLocaleDateString()
    return d === today
  })

  const todayMinutes = todaySessions.reduce((acc, s) => acc + s.duration, 0)

  return (
    <div className="stats-panel">
      <h2>📊 Daily Stats</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-value">{todaySessions.length}</span>
          <span className="stat-label">Sessions Today</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{todayMinutes}</span>
          <span className="stat-label">Focus Minutes Today</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{sessions.length}</span>
          <span className="stat-label">Total Sessions</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalFocusMinutes}</span>
          <span className="stat-label">Total Focus Minutes</span>
        </div>
      </div>

      {sessions.length > 0 && (
        <div className="session-history">
          <h3>Recent Sessions</h3>
          <ul>
            {sessions.slice(-5).reverse().map((s, i) => (
              <li key={i} className={`session-item session-${s.mode}`}>
                <span className="session-mode">
                  {s.mode === 'focus' ? '🎯' : s.mode === 'short' ? '☕' : '🌙'} {s.mode}
                </span>
                <span className="session-duration">{s.duration} min</span>
                <span className="session-time">
                  {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
