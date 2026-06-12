import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store/useStore'

interface Props {
  mood?: 'happy' | 'focused' | 'cheering' | 'idle'
  size?: number
  context?: string
}

const SPEECH: Record<NonNullable<Props['mood']>, string[]> = {
  happy:    ["You're on a roll!", "Keep it up!", "Bzzzzt! Great work!"],
  focused:  ["Stay focused!", "You've got this!", "Bzz... in the zone."],
  cheering: ["Amazing streak!", "Habit champion!", "Honey-tier productivity!"],
  idle:     ["What shall we do today?", "Ready when you are!", "Bzzzt! Let's get busy."]
}

const SYSTEM = `You are Bramble, a cheerful and encouraging bee productivity assistant.
Speak in short, punchy one-liners (max 12 words). Be warm, playful, and motivating.
Occasionally use light bee puns. Never use hashtags or markdown.`

function pick(arr: string[]): string {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function Bramble({ mood = 'idle', size = 80, context }: Props) {
  const apiKey = useStore((s) => s.apiKey)
  const [quote, setQuote] = useState(() => pick(SPEECH[mood]))
  const [loading, setLoading] = useState(false)
  const fetchedRef = useRef(false)

  useEffect(() => {
    setQuote(pick(SPEECH[mood]))
    fetchedRef.current = false
  }, [mood])

  useEffect(() => {
    if (!apiKey || fetchedRef.current) return
    fetchedRef.current = true
    setLoading(true)
    const prompt = context
      ? `You are in ${mood} mood. Context: ${context}. Say something encouraging.`
      : `You are in ${mood} mood. Say something encouraging and motivating.`

    window.api.callClaude(apiKey, prompt, SYSTEM)
      .then((text) => setQuote(text))
      .catch(() => { /* keep fallback quote */ })
      .finally(() => setLoading(false))
  }, [apiKey, mood, context])

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {/* Bramble SVG */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
      >
        {/* Body */}
        <ellipse cx="40" cy="48" rx="22" ry="20" fill="#F59E0B" />
        <rect x="20" y="44" width="40" height="7" rx="2" fill="#1C1917" opacity="0.18" />
        <rect x="20" y="54" width="40" height="5" rx="2" fill="#1C1917" opacity="0.13" />
        {/* Head */}
        <circle cx="40" cy="28" r="14" fill="#F59E0B" />
        {/* Eyes */}
        <circle cx="35" cy="27" r="3" fill="#1C1917" />
        <circle cx="45" cy="27" r="3" fill="#1C1917" />
        <circle cx="36" cy="26" r="1" fill="white" />
        <circle cx="46" cy="26" r="1" fill="white" />
        {/* Smile — varies by mood */}
        {mood === 'cheering' ? (
          <path d="M33 32 Q40 40 47 32" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : mood === 'focused' ? (
          <path d="M35 34 Q40 34 45 34" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M35 33 Q40 38 45 33" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}
        {/* Antennae */}
        <line x1="36" y1="15" x2="30" y2="7" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
        <circle cx="29" cy="6" r="2.5" fill="#F59E0B" stroke="#1C1917" strokeWidth="1.5" />
        <line x1="44" y1="15" x2="50" y2="7" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
        <circle cx="51" cy="6" r="2.5" fill="#F59E0B" stroke="#1C1917" strokeWidth="1.5" />
        {/* Wings */}
        <ellipse cx="18" cy="38" rx="10" ry="6" fill="#BFDBFE" opacity="0.7" transform="rotate(-20 18 38)" />
        <ellipse cx="62" cy="38" rx="10" ry="6" fill="#BFDBFE" opacity="0.7" transform="rotate(20 62 38)" />
        {/* Stinger */}
        <path d="M40 67 L37 74 L43 74 Z" fill="#D97706" />
        {/* Legs */}
        <line x1="25" y1="52" x2="14" y2="58" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
        <line x1="55" y1="52" x2="66" y2="58" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
        <line x1="23" y1="46" x2="12" y2="50" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
        <line x1="57" y1="46" x2="68" y2="50" stroke="#1C1917" strokeWidth="2" strokeLinecap="round" />
      </svg>

      {/* Speech bubble */}
      <div style={{
        background: 'white',
        border: '1.5px solid #E7E5E4',
        borderRadius: 12,
        padding: '10px 14px',
        fontSize: 13,
        color: '#44403C',
        fontWeight: 500,
        maxWidth: 220,
        position: 'relative',
        opacity: loading ? 0.6 : 1,
        transition: 'opacity 0.2s'
      }}>
        <span style={{
          position: 'absolute',
          left: -8,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: '6px solid transparent',
          borderBottom: '6px solid transparent',
          borderRight: '8px solid #E7E5E4'
        }} />
        <span style={{
          position: 'absolute',
          left: -6,
          top: '50%',
          transform: 'translateY(-50%)',
          width: 0,
          height: 0,
          borderTop: '5px solid transparent',
          borderBottom: '5px solid transparent',
          borderRight: '7px solid white'
        }} />
        {loading ? <em style={{ fontStyle: 'italic', color: '#A8A29E' }}>Bzzzzt...</em> : <em style={{ fontStyle: 'normal' }}>"{quote}"</em>}
        <div style={{ fontSize: 11, color: '#A8A29E', marginTop: 3 }}>— Bramble{apiKey ? ' ✨' : ''}</div>
      </div>
    </div>
  )
}
