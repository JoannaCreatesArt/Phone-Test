import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'
import Bramble from '../components/Bramble'

type Mode = 'work' | 'short-break' | 'long-break'

const DURATIONS: Record<Mode, number> = {
  work: 25,
  'short-break': 5,
  'long-break': 15
}

const LABELS: Record<Mode, string> = {
  work: 'Focus',
  'short-break': 'Short Break',
  'long-break': 'Long Break'
}

export default function TimerView() {
  const { addFocusSession } = useStore()
  const [mode, setMode]       = useState<Mode>('work')
  const [seconds, setSeconds] = useState(DURATIONS.work * 60)
  const [running, setRunning] = useState(false)
  const [sessions, setSessions] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const total = DURATIONS[mode] * 60

  useEffect(() => {
    setSeconds(DURATIONS[mode] * 60)
    setRunning(false)
  }, [mode])

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(timerRef.current!)
            setRunning(false)
            if (mode === 'work') {
              addFocusSession(DURATIONS.work)
              setSessions((n) => n + 1)
            }
            return 0
          }
          return s - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [running, mode, addFocusSession])

  function reset() {
    setRunning(false)
    setSeconds(DURATIONS[mode] * 60)
  }

  const mins = String(Math.floor(seconds / 60)).padStart(2, '0')
  const secs = String(seconds % 60).padStart(2, '0')
  const progress = 1 - seconds / total

  const r = 108
  const circ = 2 * Math.PI * r

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Focus Timer</h1>
        <p className="page-subtitle">
          {sessions > 0
            ? `${sessions} session${sessions > 1 ? 's' : ''} completed today · ${sessions * 25} min focused`
            : 'Pomodoro technique'}
        </p>
      </div>

      <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28, padding: '44px 48px' }}>
        {/* Mode selector */}
        <div style={{ display: 'flex', gap: 8 }}>
          {(['work', 'short-break', 'long-break'] as Mode[]).map((m) => (
            <button
              key={m}
              className={`btn${mode === m ? ' btn-primary' : ' btn-ghost'}`}
              onClick={() => setMode(m)}
            >
              {LABELS[m]}
            </button>
          ))}
        </div>

        {/* Ring */}
        <div className="timer-ring">
          <svg width="240" height="240" viewBox="0 0 240 240">
            <circle cx="120" cy="120" r={r} fill="none" stroke="var(--stone-100)" strokeWidth="10" />
            <circle
              cx="120" cy="120" r={r}
              fill="none"
              stroke={mode === 'work' ? 'var(--amber-500)' : '#86EFAC'}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.6s linear' }}
            />
          </svg>
          <div className="timer-display">
            <div className="timer-time">{mins}:{secs}</div>
            <div className="timer-label">{LABELS[mode]}</div>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button className="btn btn-ghost" onClick={reset}>Reset</button>
          <button
            className="btn btn-primary btn-large"
            onClick={() => setRunning((r) => !r)}
          >
            {running ? 'Pause' : seconds === total ? 'Start' : 'Resume'}
          </button>
        </div>

        {/* Bramble cheers when timer is running */}
        {running && (
          <Bramble mood="focused" size={64} />
        )}
        {!running && sessions > 0 && (
          <Bramble mood="happy" size={64} />
        )}
      </div>
    </div>
  )
}
