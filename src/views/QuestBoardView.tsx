import { useState } from 'react'
import { useStore, type QuestCategoryId } from '../store/useStore'
import Bramble from '../components/Bramble'

interface CategoryConfig {
  id: QuestCategoryId
  icon: string
  name: string
  sub: string
  color: string
  bg: string
  accent: string
  placeholder: string
}

const CATEGORIES: CategoryConfig[] = [
  {
    id: 'armor',
    icon: '🛡️',
    name: 'Put on Armor',
    sub: 'Small tasks to ease into the day',
    color: '#92400E',
    bg: '#FFFBEB',
    accent: '#F59E0B',
    placeholder: 'Add an armor task...'
  },
  {
    id: 'dragon',
    icon: '🐉',
    name: 'Face the Dragon',
    sub: 'Your hardest, most arduous quest',
    color: '#991B1B',
    bg: '#FFF5F5',
    accent: '#EF4444',
    placeholder: 'Name the dragon...'
  },
  {
    id: 'health',
    icon: '💚',
    name: 'Replenish your Health',
    sub: 'Lightweight self-care for body and spirit',
    color: '#166534',
    bg: '#F0FDF4',
    accent: '#22C55E',
    placeholder: 'Add a health quest...'
  },
  {
    id: 'joy',
    icon: '⭐',
    name: 'Choose your Joy',
    sub: 'Things to look forward to today',
    color: '#5B21B6',
    bg: '#F5F3FF',
    accent: '#8B5CF6',
    placeholder: 'Add something joyful...'
  },
  {
    id: 'tomorrow',
    icon: '📜',
    name: 'Prepare for Tomorrow',
    sub: 'Upcoming tasks and things to carry forward',
    color: '#1E40AF',
    bg: '#EFF6FF',
    accent: '#3B82F6',
    placeholder: 'Add to the scroll...'
  }
]

type InputState = Record<QuestCategoryId, string>

export default function QuestBoardView() {
  const { quests, addQuest, toggleQuest, deleteQuest } = useStore()
  const [inputs, setInputs] = useState<InputState>({
    armor: '', dragon: '', health: '', joy: '', tomorrow: ''
  })

  function setInput(cat: QuestCategoryId, val: string) {
    setInputs((prev) => ({ ...prev, [cat]: val }))
  }

  function handleAdd(cat: QuestCategoryId) {
    const title = inputs[cat].trim()
    if (!title) return
    addQuest(title, cat)
    setInput(cat, '')
  }

  const totalQuests = quests.length
  const doneQuests  = quests.filter((q) => q.completed).length
  const allDone     = totalQuests > 0 && doneQuests === totalQuests

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Quest Board</h1>
        <p className="page-subtitle">
          Plan your day like a legendary adventurer
          {totalQuests > 0 && ` · ${doneQuests} of ${totalQuests} quests complete`}
        </p>
      </div>

      {allDone && (
        <div style={{ marginBottom: 24 }}>
          <Bramble mood="cheering" size={72} />
        </div>
      )}

      <div className="quest-grid">
        {CATEGORIES.map((cat, i) => {
          const catQuests = quests.filter((q) => q.category === cat.id)
          const done      = catQuests.filter((q) => q.completed).length
          const isFull    = i === 4

          return (
            <div
              key={cat.id}
              className={`quest-card${isFull ? ' quest-card--full' : ''}`}
              style={{
                '--cat-color':  cat.color,
                '--cat-bg':     cat.bg,
                '--cat-accent': cat.accent
              } as React.CSSProperties}
            >
              {/* ── Header ── */}
              <div className="quest-card-header">
                <span className="quest-card-icon">{cat.icon}</span>
                <div style={{ flex: 1 }}>
                  <div className="quest-card-name">{cat.name}</div>
                  <div className="quest-card-sub">{cat.sub}</div>
                </div>
                {catQuests.length > 0 && (
                  <span className="quest-count-badge">
                    {done}/{catQuests.length}
                  </span>
                )}
              </div>

              {/* ── Quest list ── */}
              {catQuests.length > 0 && (
                <div className={`quest-list${isFull ? ' quest-list--wide' : ''}`}>
                  {catQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className={`quest-item${quest.completed ? ' quest-item--done' : ''}`}
                    >
                      <div
                        className={`quest-check${quest.completed ? ' quest-check--done' : ''}`}
                        onClick={() => toggleQuest(quest.id)}
                      />
                      <span className="quest-item-title">{quest.title}</span>
                      <button
                        className="btn-icon"
                        onClick={() => deleteQuest(quest.id)}
                        style={{ opacity: 0, transition: 'opacity 0.1s' }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '1')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.opacity = '0')}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Add input ── */}
              <div className="quest-add-row">
                <input
                  className="quest-input"
                  placeholder={cat.placeholder}
                  value={inputs[cat.id]}
                  onChange={(e) => setInput(cat.id, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAdd(cat.id)}
                />
                <button
                  className="quest-add-btn"
                  onClick={() => handleAdd(cat.id)}
                  aria-label="Add quest"
                >
                  +
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
