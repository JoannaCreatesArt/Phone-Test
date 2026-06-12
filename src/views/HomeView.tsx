import { format } from 'date-fns'
import { useStore, calcStreak } from '../store/useStore'
import Bramble from '../components/Bramble'
import type { View } from '../App'

interface Props {
  onNavigate: (v: View) => void
}

export default function HomeView({ onNavigate }: Props) {
  const { tasks, habits, focusSessions } = useStore()

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const todayDate = new Date().toDateString()

  const todayTasks = tasks.filter((t) => new Date(t.createdAt).toDateString() === todayDate)
  const completedToday = todayTasks.filter((t) => t.completed).length
  const habitsDoneToday = habits.filter((h) => h.completedDates.includes(todayStr)).length
  const todayFocus = focusSessions
    .filter((s) => new Date(s.completedAt).toDateString() === todayDate)
    .reduce((sum, s) => sum + s.minutes, 0)
  const bestStreak = habits.length > 0
    ? Math.max(...habits.map((h) => calcStreak(h.completedDates)))
    : 0

  function mood(): 'happy' | 'cheering' | 'focused' | 'idle' {
    if (bestStreak >= 7) return 'cheering'
    if (completedToday >= 3) return 'happy'
    if (todayFocus >= 25) return 'focused'
    return 'idle'
  }

  function greeting(): string {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{greeting()}</h1>
        <p className="page-subtitle">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
      </div>

      <div style={{ marginBottom: 28 }}>
        <Bramble mood={mood()} size={84} />
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-label">Tasks Today</div>
          <div className="stat-card-value">
            {completedToday}
            <span className="stat-card-unit">/ {todayTasks.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Habits Done</div>
          <div className="stat-card-value">
            {habitsDoneToday}
            <span className="stat-card-unit">/ {habits.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Focus Time</div>
          <div className="stat-card-value">
            {todayFocus}
            <span className="stat-card-unit">min</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Best Streak</div>
          <div className="stat-card-value">
            {bestStreak}
            <span className="stat-card-unit">days</span>
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">Quick Access</div>
        <div className="quick-grid">
          {[
            {
              id: 'tasks' as View,
              icon: '✅',
              title: 'Tasks',
              desc: `${tasks.filter((t) => !t.completed).length} remaining`
            },
            {
              id: 'habits' as View,
              icon: '🔥',
              title: 'Habits',
              desc: `${habitsDoneToday} of ${habits.length} done today`
            },
            {
              id: 'timer' as View,
              icon: '⏱️',
              title: 'Focus Timer',
              desc: 'Start a Pomodoro session'
            },
            {
              id: 'stats' as View,
              icon: '📊',
              title: 'Stats',
              desc: 'View your progress'
            }
          ].map((card) => (
            <button key={card.id} className="quick-card" onClick={() => onNavigate(card.id)}>
              <div className="quick-card-icon">{card.icon}</div>
              <div className="quick-card-title">{card.title}</div>
              <div className="quick-card-desc">{card.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
