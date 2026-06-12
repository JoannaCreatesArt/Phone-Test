import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format, subDays } from 'date-fns'

export type Priority = 'low' | 'medium' | 'high'

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: Priority
  createdAt: string
  completedAt?: string
}

export interface Habit {
  id: string
  name: string
  icon: string
  completedDates: string[]
  createdAt: string
}

export interface FocusSession {
  id: string
  minutes: number
  completedAt: string
}

interface Store {
  tasks: Task[]
  habits: Habit[]
  focusSessions: FocusSession[]
  addTask: (title: string, priority: Priority) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  addHabit: (name: string, icon: string) => void
  toggleHabitToday: (id: string) => void
  deleteHabit: (id: string) => void
  addFocusSession: (minutes: number) => void
}

function uid(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function todayStr(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function calcStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0
  const today = todayStr()
  const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd')
  const unique = [...new Set(completedDates)].sort().reverse()

  if (unique[0] !== today && unique[0] !== yesterday) return 0

  let streak = 0
  let cursor = unique[0] === today ? new Date() : subDays(new Date(), 1)

  for (const d of unique) {
    if (d === format(cursor, 'yyyy-MM-dd')) {
      streak++
      cursor = subDays(cursor, 1)
    } else {
      break
    }
  }

  return streak
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      tasks: [],
      habits: [],
      focusSessions: [],

      addTask: (title, priority) =>
        set((s) => ({
          tasks: [
            ...s.tasks,
            { id: uid(), title, completed: false, priority, createdAt: new Date().toISOString() }
          ]
        })),

      toggleTask: (id) =>
        set((s) => ({
          tasks: s.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed: !t.completed,
                  completedAt: !t.completed ? new Date().toISOString() : undefined
                }
              : t
          )
        })),

      deleteTask: (id) => set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) })),

      addHabit: (name, icon) =>
        set((s) => ({
          habits: [
            ...s.habits,
            { id: uid(), name, icon, completedDates: [], createdAt: new Date().toISOString() }
          ]
        })),

      toggleHabitToday: (id) =>
        set((s) => ({
          habits: s.habits.map((h) => {
            if (h.id !== id) return h
            const t = todayStr()
            const has = h.completedDates.includes(t)
            return {
              ...h,
              completedDates: has ? h.completedDates.filter((d) => d !== t) : [...h.completedDates, t]
            }
          })
        })),

      deleteHabit: (id) => set((s) => ({ habits: s.habits.filter((h) => h.id !== id) })),

      addFocusSession: (minutes) =>
        set((s) => ({
          focusSessions: [
            ...s.focusSessions,
            { id: uid(), minutes, completedAt: new Date().toISOString() }
          ]
        }))
    }),
    { name: 'bee-productive-store' }
  )
)
