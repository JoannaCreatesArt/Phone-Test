import { Task, Habit, FocusSession } from '../store/useStore';

// Set your Anthropic API key in app.json extra or a .env file
// For now, uses an environment variable passed at build time
const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY ?? '';

interface InsightInput {
  tasks: Task[];
  habits: Habit[];
  focusSessions: FocusSession[];
}

export async function fetchBeeInsight(data: InsightInput): Promise<string> {
  if (!API_KEY) {
    return beeInsightFallback(data);
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = data.tasks.filter(t => t.completed && t.completedAt?.startsWith(todayStr)).length;
  const totalToday = data.tasks.filter(t => t.createdAt.startsWith(todayStr)).length;
  const focusMinutesToday = data.focusSessions
    .filter(s => s.date.startsWith(todayStr))
    .reduce((sum, s) => sum + s.duration, 0);
  const habitStreaks = data.habits.map(h => `${h.emoji} ${h.title}: ${h.streak} day streak`).join(', ');

  const prompt = `You are BeeBot, a cheerful productivity coach with a bee theme. Give a short (2-3 sentences max), warm, encouraging insight based on this person's day so far. Use bee/honey metaphors naturally but don't overdo it.

Today's stats:
- Tasks completed: ${completedToday}/${totalToday}
- Focus time: ${focusMinutesToday} minutes
- Habit streaks: ${habitStreaks || 'none yet'}

Respond with just the insight text, no labels or prefixes.`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 120,
        messages: [{ role: 'user', content: prompt }],
      }),
    });
    const json = await res.json();
    return json?.content?.[0]?.text ?? beeInsightFallback(data);
  } catch (_) {
    return beeInsightFallback(data);
  }
}

function beeInsightFallback({ tasks, focusSessions }: InsightInput): string {
  const todayStr = new Date().toISOString().split('T')[0];
  const done = tasks.filter(t => t.completed && t.completedAt?.startsWith(todayStr)).length;
  const focus = focusSessions.filter(s => s.date.startsWith(todayStr)).reduce((s, f) => s + f.duration, 0);

  if (done === 0 && focus === 0) return "Every hive starts quiet — your first buzz is all it takes! 🐝";
  if (done >= 5) return `Incredible! ${done} tasks done — you're absolutely buzzing today! 🍯`;
  if (focus >= 60) return `${focus} minutes of deep focus — that's some serious honeycomb building! 🍯`;
  if (done > 0) return `${done} task${done > 1 ? 's' : ''} done and counting — keep the momentum going! 🐝`;
  return "You've got focus time logged — steady work builds the sweetest results! 🌸";
}
