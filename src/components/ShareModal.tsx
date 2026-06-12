import { useState } from 'react'
import { format } from 'date-fns'
import { useStore, calcStreak, type Task, type Habit, type FocusSession, type Quest } from '../store/useStore'

interface Props {
  onClose: () => void
}

function buildSummary(
  tasks: Task[],
  habits: Habit[],
  focusSessions: FocusSession[],
  quests: Quest[]
): string {
  const todayDate = new Date().toDateString()
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const todayTasks = tasks.filter((t) => new Date(t.createdAt).toDateString() === todayDate)
  const completedTasks = todayTasks.filter((t) => t.completed)
  const pendingTasks = tasks.filter((t) => !t.completed)

  const todayFocus = focusSessions
    .filter((s) => new Date(s.completedAt).toDateString() === todayDate)
    .reduce((sum, s) => sum + s.minutes, 0)

  const habitsDoneToday = habits.filter((h) => h.completedDates.includes(todayStr))
  const habitsPending = habits.filter((h) => !h.completedDates.includes(todayStr))

  const activeQuests = quests.filter((q) => !q.completed)
  const doneQuests = quests.filter((q) => q.completed)

  const lines: string[] = [
    `# Bee Productive — Progress Report`,
    `Date: ${format(new Date(), 'EEEE, MMMM d, yyyy')}`,
    ``,
    `## Tasks`,
    `- Completed today: ${completedTasks.length} / ${todayTasks.length}`,
    ...completedTasks.map((t) => `  ✅ ${t.title}`),
    pendingTasks.length > 0 ? `- Still pending: ${pendingTasks.length}` : '',
    ...pendingTasks.slice(0, 5).map((t) => `  ◻️ [${t.priority}] ${t.title}`),
    pendingTasks.length > 5 ? `  ... and ${pendingTasks.length - 5} more` : '',
    ``,
    `## Habits`,
    `- Done today: ${habitsDoneToday.length} / ${habits.length}`,
    ...habitsDoneToday.map((h) => `  ${h.icon} ${h.name} (streak: ${calcStreak(h.completedDates)} days)`),
    habitsPending.length > 0 ? `- Not yet done: ${habitsPending.map((h) => h.name).join(', ')}` : '',
    ``,
    `## Focus Sessions`,
    `- Focus time today: ${todayFocus} minutes`,
    `- Total sessions ever: ${focusSessions.length}`,
    ``,
    `## Quest Board`,
    `- Active quests: ${activeQuests.length}`,
    ...activeQuests.map((q) => `  ◻️ [${q.category}] ${q.title}`),
    doneQuests.length > 0 ? `- Completed quests: ${doneQuests.length}` : '',
    ...doneQuests.map((q) => `  ✅ [${q.category}] ${q.title}`),
  ].filter((l) => l !== undefined)

  return lines.join('\n')
}

export default function ShareModal({ onClose }: Props) {
  const { tasks, habits, focusSessions, quests, apiKey } = useStore()
  const [copied, setCopied] = useState(false)
  const [aiSummary, setAiSummary] = useState('')
  const [loadingAi, setLoadingAi] = useState(false)

  const summary = buildSummary(tasks, habits, focusSessions, quests)

  function handleCopy() {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  async function handleAiInsight() {
    if (!apiKey) return
    setLoadingAi(true)
    setAiSummary('')
    try {
      const text = await window.api.callClaude(
        apiKey,
        `Here is my productivity data:\n\n${summary}\n\nGive me 2-3 sentences of friendly, specific encouragement and one actionable tip based on this data.`,
        'You are Bramble, a cheerful bee productivity assistant. Be warm, specific, and concise. No lists or bullet points — just flowing sentences.'
      )
      setAiSummary(text)
    } catch {
      setAiSummary('Bzz... could not reach Claude right now. Check your API key in Settings.')
    } finally {
      setLoadingAi(false)
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal--wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Share with Claude</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <p className="settings-desc">
            Here's a snapshot of your progress. Copy it into any Claude conversation for personalised coaching.
          </p>

          {apiKey && (
            <div style={{ marginBottom: 16 }}>
              <button
                className="btn btn-primary"
                onClick={handleAiInsight}
                disabled={loadingAi}
              >
                {loadingAi ? 'Bzzzzt...' : '✨ Get Bramble\'s AI Insight'}
              </button>
              {aiSummary && (
                <div className="ai-insight-box">
                  <div className="ai-insight-bee">🐝</div>
                  <p>{aiSummary}</p>
                </div>
              )}
            </div>
          )}

          <div className="share-actions">
            <button className="btn btn-secondary" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>

          <pre className="share-preview">{summary}</pre>
        </div>
      </div>
    </div>
  )
}
