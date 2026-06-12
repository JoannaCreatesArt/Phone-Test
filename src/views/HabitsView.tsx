import { useState } from 'react'
import { format } from 'date-fns'
import { useStore, calcStreak } from '../store/useStore'

const ICONS = ['💪', '📚', '🏃', '💧', '🧘', '✍️', '🎯', '😴', '🥗', '🚴', '🎨', '🎵']

export default function HabitsView() {
  const { habits, addHabit, toggleHabitToday, deleteHabit } = useStore()
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('💪')
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  function handleAdd() {
    const n = name.trim()
    if (!n) return
    addHabit(n, icon)
    setName('')
  }

  const doneCount = habits.filter((h) => h.completedDates.includes(todayStr)).length

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Habits</h1>
        <p className="page-subtitle">{doneCount} of {habits.length} done today</p>
      </div>

      <div className="input-row">
        <input
          className="input"
          placeholder="New habit name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <select className="select" value={icon} onChange={(e) => setIcon(e.target.value)}>
          {ICONS.map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
        <button className="btn btn-primary" onClick={handleAdd}>Add</button>
      </div>

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔥</div>
          <div className="empty-state-text">No habits yet — build your first one!</div>
        </div>
      ) : (
        <div className="list">
          {habits.map((habit) => {
            const done   = habit.completedDates.includes(todayStr)
            const streak = calcStreak(habit.completedDates)
            return (
              <div key={habit.id} className={`list-item${done ? ' completed' : ''}`}>
                <span className="habit-icon">{habit.icon}</span>
                <div
                  className={`checkbox${done ? ' checked' : ''}`}
                  onClick={() => toggleHabitToday(habit.id)}
                />
                <span style={{
                  flex: 1,
                  fontSize: 14,
                  fontWeight: 500,
                  color: done ? 'var(--stone-400)' : undefined
                }}>
                  {habit.name}
                </span>
                {streak > 0 && (
                  <span className="habit-streak">🔥 {streak}d</span>
                )}
                <button className="btn-icon" onClick={() => deleteHabit(habit.id)}>×</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
