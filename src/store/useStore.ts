import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  createdAt: string;
  completedAt?: string;
}

export interface Habit {
  id: string;
  title: string;
  emoji: string;
  streak: number;
  completedDates: string[];
  color: string;
}

export interface FocusSession {
  id: string;
  duration: number; // minutes
  date: string;
  label: string;
}

interface AppState {
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
  pomodoroMinutes: number;
  insightMessage: string;

  // Task actions
  addTask: (title: string, category?: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;

  // Habit actions
  addHabit: (title: string, emoji: string, color: string) => void;
  toggleHabitToday: (id: string) => void;
  deleteHabit: (id: string) => void;

  // Focus actions
  addFocusSession: (duration: number, label: string) => void;

  // Pomodoro
  setPomodoroMinutes: (mins: number) => void;

  // Insight
  setInsightMessage: (msg: string) => void;

  // Persistence
  loadFromStorage: () => Promise<void>;
  saveToStorage: () => Promise<void>;
}

const today = () => new Date().toISOString().split('T')[0];
const uid = () => Math.random().toString(36).slice(2, 10);

export const useStore = create<AppState>((set, get) => ({
  tasks: [],
  habits: [],
  focusSessions: [],
  pomodoroMinutes: 25,
  insightMessage: "Ready to make some honey today? 🐝",

  addTask: (title, category = 'General') => {
    const task: Task = { id: uid(), title, completed: false, category, createdAt: new Date().toISOString() };
    set(s => ({ tasks: [task, ...s.tasks] }));
    get().saveToStorage();
  },

  toggleTask: (id) => {
    set(s => ({
      tasks: s.tasks.map(t =>
        t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined } : t
      ),
    }));
    get().saveToStorage();
  },

  deleteTask: (id) => {
    set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    get().saveToStorage();
  },

  addHabit: (title, emoji, color) => {
    const habit: Habit = { id: uid(), title, emoji, streak: 0, completedDates: [], color };
    set(s => ({ habits: [...s.habits, habit] }));
    get().saveToStorage();
  },

  toggleHabitToday: (id) => {
    const todayStr = today();
    set(s => ({
      habits: s.habits.map(h => {
        if (h.id !== id) return h;
        const alreadyDone = h.completedDates.includes(todayStr);
        const completedDates = alreadyDone
          ? h.completedDates.filter(d => d !== todayStr)
          : [...h.completedDates, todayStr];
        const streak = calculateStreak(completedDates);
        return { ...h, completedDates, streak };
      }),
    }));
    get().saveToStorage();
  },

  deleteHabit: (id) => {
    set(s => ({ habits: s.habits.filter(h => h.id !== id) }));
    get().saveToStorage();
  },

  addFocusSession: (duration, label) => {
    const session: FocusSession = { id: uid(), duration, date: new Date().toISOString(), label };
    set(s => ({ focusSessions: [session, ...s.focusSessions] }));
    get().saveToStorage();
  },

  setPomodoroMinutes: (mins) => {
    set({ pomodoroMinutes: mins });
    get().saveToStorage();
  },

  setInsightMessage: (msg) => set({ insightMessage: msg }),

  loadFromStorage: async () => {
    try {
      const raw = await AsyncStorage.getItem('beeproductive_state');
      if (raw) {
        const parsed = JSON.parse(raw);
        set(parsed);
      }
    } catch (_) {}
  },

  saveToStorage: async () => {
    try {
      const { tasks, habits, focusSessions, pomodoroMinutes } = get();
      await AsyncStorage.setItem('beeproductive_state', JSON.stringify({ tasks, habits, focusSessions, pomodoroMinutes }));
    } catch (_) {}
  },
}));

function calculateStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const sorted = [...dates].sort((a, b) => b.localeCompare(a));
  let streak = 0;
  let cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  for (const d of sorted) {
    const dateStr = cursor.toISOString().split('T')[0];
    if (d === dateStr) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}
