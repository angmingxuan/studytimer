export default function Settings({ settings, onChange, onClearHistory }) {
  const handleChange = (key, value) => {
    const num = parseInt(value, 10)
    if (!isNaN(num) && num > 0) {
      onChange({ ...settings, [key]: num })
    }
  }

  return (
    <div className="settings-panel">
      <h2>⚙️ Settings</h2>

      <div className="settings-group">
        <label>
          🎯 Focus Duration (min)
          <input
            type="number"
            min="1"
            max="120"
            value={settings.focusMinutes}
            onChange={e => handleChange('focusMinutes', e.target.value)}
          />
        </label>
        <label>
          ☕ Short Break (min)
          <input
            type="number"
            min="1"
            max="30"
            value={settings.shortBreakMinutes}
            onChange={e => handleChange('shortBreakMinutes', e.target.value)}
          />
        </label>
        <label>
          🌙 Long Break (min)
          <input
            type="number"
            min="1"
            max="60"
            value={settings.longBreakMinutes}
            onChange={e => handleChange('longBreakMinutes', e.target.value)}
          />
        </label>
        <label>
          🔁 Sessions Before Long Break
          <input
            type="number"
            min="1"
            max="10"
            value={settings.sessionsBeforeLongBreak}
            onChange={e => handleChange('sessionsBeforeLongBreak', e.target.value)}
          />
        </label>
      </div>

      <div className="settings-actions">
        <button className="btn btn-danger" onClick={onClearHistory}>
          🗑 Clear Session History
        </button>
      </div>
    </div>
  )
}
