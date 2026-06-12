import { useStore } from '../store/useStore'
import type { View } from '../App'

interface NavItem {
  id: View
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',   label: 'Home',         icon: '🏠' },
  { id: 'quests', label: 'Quest Board',  icon: '⚔️' },
  { id: 'tasks',  label: 'Tasks',        icon: '✅' },
  { id: 'habits', label: 'Habits',       icon: '🔥' },
  { id: 'timer',  label: 'Focus Timer',  icon: '⏱️' },
  { id: 'stats',  label: 'Stats',        icon: '📊' }
]

interface Props {
  active: View
  onNavigate: (v: View) => void
  onSettings: () => void
  onShare: () => void
}

export default function Sidebar({ active, onNavigate, onSettings, onShare }: Props) {
  const apiKey = useStore((s) => s.apiKey)

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-icon">🐝</span>
        <span className="sidebar-logo-text">Bee Productive</span>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={`nav-item${active === item.id ? ' active' : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item nav-item--footer" onClick={onShare}>
          <span className="nav-item-icon">📤</span>
          Share Progress
        </button>
        <button className="nav-item nav-item--footer" onClick={onSettings}>
          <span className="nav-item-icon">⚙️</span>
          Settings
          {apiKey && <span className="sidebar-api-dot" title="Claude connected" />}
        </button>
      </div>
    </aside>
  )
}
