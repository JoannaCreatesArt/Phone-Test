import { format, subDays, isWithinInterval, startOfDay, endOfDay, parseISO } from 'date-fns'
import { useStore, calcStreak } from '../store/useStore'

function Bar({ label, value, max, sub }: { label: string; value: number; max: number; sub: string }) {
  const pct = max === 0 ? 0 : Math.min(100, (value / max) * 100)
  return (
    <div className="bar-row">
      <div className="bar-labels">
        <span>{label}</span>
        <span style={{ color: 'var(--stone-400)' }}>{sub}</span>
      </div>
      <div className="bar-track">
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function StatsView() {
  const { tasks, habits, focusSessions } = useStore()

  const last7 = Array.from({ length: 7 }, (_, i) => subDays(new Date(), 6 - i))

  const tasksPerDay = last7.map((day) => ({
    label: format(day, 'EEE'),
    count: tasks.filter((t) => {
      if (!t.completedAt) return false
      const d = parseISO(t.completedAt)
      return isWithinInterval(d, { start: startOfDay(day), end: endOfDay(day) })
    }).length
  }))

  const focusPerDay = last7.map((day) => ({
    label: format(day, 'EEE'),
    minutes: focusSessions
      .filter((s) => {
        const d = parseISO(s.completedAt)
        return isWithinInterval(d, { start: startOfDay(day), end: endOfDay(day) })
      })
      .reduce((sum, s) => sum + s.minutes, 0)
  }))

  const totalCompleted = tasks.filter((t) => t.completed).length
  const totalFocus     = focusSessions.reduce((sum, s) => sum + s.minutes, 0)
  const bestStreak     = habits.length > 0
    ? Math.max(...habits.map((h) => calcStreak(h.completedDates)))
    : 0

  const maxTask  = Math.max(...tasksPerDay.map((d) => d.count), 1)
  const maxFocus = Math.max(...focusPerDay.map((d) => d.minutes), 1)
  const maxStreak = Math.max(...habits.map((h) => calcStreak(h.completedDates)), 1)

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Stats</h1>
        <p className="page-subtitle">Your productivity at a glance</p>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-label">Tasks Completed</div>
          <div className="stat-card-value">{totalCompleted}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Focus Time</div>
          <div className="stat-card-value">
            {Math.floor(totalFocus / 60)}
            <span className="stat-card-unit">h {totalFocus % 60}m</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Habits Tracked</div>
          <div className="stat-card-value">{habits.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Best Streak</div>
          <div className="stat-card-value">
            {bestStreak}
            <span className="stat-card-unit">days</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Tasks Completed — Last 7 Days</div>
          {tasksPerDay.map((d) => (
            <Bar key={d.label} label={d.label} value={d.count} max={maxTask} sub={`${d.count}`} />
          ))}
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Focus Minutes — Last 7 Days</div>
          {focusPerDay.map((d) => (
            <Bar key={d.label} label={d.label} value={d.minutes} max={maxFocus} sub={`${d.minutes} min`} />
          ))}
        </div>
      </div>

      {habits.length > 0 && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: 16 }}>Habit Streaks</div>
          {habits.map((h) => {
            const s = calcStreak(h.completedDates)
            return (
              <Bar
                key={h.id}
                label={`${h.icon} ${h.name}`}
                value={s}
                max={maxStreak}
                sub={s > 0 ? `${s} day streak` : 'No streak'}
              />
            )
          })}
        </div>
      )}

      {habits.length === 0 && totalCompleted === 0 && focusSessions.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <div className="empty-state-text">Start completing tasks and habits to see your stats!</div>
        </div>
      )}
    </div>
  )
}
