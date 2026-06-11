import React, { useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { InsightCard } from '../components/InsightCard';
import { useStore } from '../store/useStore';
import { colors, fonts, radius, shadow } from '../theme/beeTheme';

export function HomeScreen() {
  const { tasks, habits, focusSessions, loadFromStorage } = useStore();

  useEffect(() => { loadFromStorage(); }, []);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.createdAt.startsWith(todayStr));
  const completedToday = todayTasks.filter(t => t.completed).length;
  const focusToday = focusSessions
    .filter(s => s.date.startsWith(todayStr))
    .reduce((sum, s) => sum + s.duration, 0);
  const habitsToday = habits.filter(h => h.completedDates.includes(todayStr)).length;
  const topStreak = habits.length ? Math.max(...habits.map(h => h.streak)) : 0;

  const stats = [
    { label: 'Tasks Done', value: `${completedToday}/${todayTasks.length}`, icon: '✅' },
    { label: 'Focus Time', value: `${focusToday}m`, icon: '⏱' },
    { label: 'Habits', value: `${habitsToday}/${habits.length}`, icon: '🌟' },
    { label: 'Best Streak', value: `${topStreak}d`, icon: '🔥' },
  ];

  const dayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good {getGreeting()}, busy bee!</Text>
            <Text style={styles.date}>{dayName}, {dateStr}</Text>
          </View>
          <Text style={{ fontSize: 36 }}>🍯</Text>
        </View>

        {/* Stats grid */}
        <View style={styles.grid}>
          {stats.map(s => (
            <View key={s.label} style={[styles.statCard, shadow.sm]}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* BeeBot insight */}
        <Text style={styles.sectionTitle}>BeeBot says…</Text>
        <InsightCard />

        {/* Today's tasks preview */}
        <Text style={styles.sectionTitle}>Today's hive work</Text>
        {todayTasks.length === 0
          ? <View style={[styles.emptyCard, shadow.sm]}><Text style={styles.emptyTxt}>No tasks yet — add one in the Tasks tab! 🐝</Text></View>
          : todayTasks.slice(0, 4).map(t => (
            <View key={t.id} style={[styles.taskRow, shadow.sm]}>
              <Text style={[styles.taskDot, t.completed && styles.taskDotDone]}>
                {t.completed ? '✓' : '○'}
              </Text>
              <Text style={[styles.taskTitle, t.completed && styles.taskDone]}>{t.title}</Text>
            </View>
          ))
        }
        {todayTasks.length > 4 && (
          <Text style={styles.more}>+{todayTasks.length - 4} more in Tasks tab</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 40 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: { fontSize: fonts.xl, fontWeight: '700', color: colors.black },
  date: { fontSize: fonts.md, color: colors.muted, marginTop: 2 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginVertical: 12,
  },
  statCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.lg,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    marginHorizontal: '1.5%',
  },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statValue: { fontSize: fonts.xxl, fontWeight: '800', color: colors.black },
  statLabel: { fontSize: fonts.sm, color: colors.muted, marginTop: 2 },
  sectionTitle: {
    fontSize: fonts.lg,
    fontWeight: '700',
    color: colors.black,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 4,
  },
  emptyCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    padding: 20,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  emptyTxt: { color: colors.muted, fontSize: fonts.md },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 3,
    gap: 10,
  },
  taskDot: { fontSize: fonts.lg, color: colors.honey, fontWeight: '700' },
  taskDotDone: { color: colors.success },
  taskTitle: { fontSize: fonts.base, color: colors.black, flex: 1 },
  taskDone: { textDecorationLine: 'line-through', color: colors.muted },
  more: { textAlign: 'center', color: colors.muted, marginTop: 8, fontSize: fonts.sm },
});
