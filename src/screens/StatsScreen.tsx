import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { useStore } from '../store/useStore';
import { colors, fonts, radius, shadow } from '../theme/beeTheme';
import { subDays, format, parseISO, isSameDay } from 'date-fns';

const { width } = Dimensions.get('window');
const BAR_MAX_H = 120;

export function StatsScreen() {
  const { tasks, focusSessions, habits } = useStore();
  const [range, setRange] = useState<7 | 14 | 30>(7);

  const days = Array.from({ length: range }, (_, i) => subDays(new Date(), range - 1 - i));

  const tasksByDay = days.map(d =>
    tasks.filter(t => t.completedAt && isSameDay(parseISO(t.completedAt), d)).length
  );
  const focusByDay = days.map(d =>
    focusSessions.filter(s => isSameDay(parseISO(s.date), d)).reduce((sum, s) => sum + s.duration, 0)
  );

  const maxTasks = Math.max(...tasksByDay, 1);
  const maxFocus = Math.max(...focusByDay, 1);

  const totalTasks = tasks.filter(t => t.completed).length;
  const totalFocus = focusSessions.reduce((s, f) => s + f.duration, 0);
  const totalHabits = habits.reduce((s, h) => s + h.completedDates.length, 0);
  const bestStreak = habits.length ? Math.max(...habits.map(h => h.streak)) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.screenTitle}>Your Hive Stats 📊</Text>

        {/* Summary cards */}
        <View style={styles.grid}>
          {[
            { label: 'Tasks Completed', value: totalTasks, icon: '✅' },
            { label: 'Focus Minutes', value: totalFocus, icon: '⏱' },
            { label: 'Habits Logged', value: totalHabits, icon: '🌟' },
            { label: 'Best Streak', value: `${bestStreak}d`, icon: '🔥' },
          ].map(s => (
            <View key={s.label} style={[styles.statCard, shadow.sm]}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statVal}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Range picker */}
        <View style={styles.rangeRow}>
          {([7, 14, 30] as const).map(r => (
            <TouchableOpacity key={r} style={[styles.rangeChip, range === r && styles.rangeChipActive]} onPress={() => setRange(r)}>
              <Text style={[styles.rangeTxt, range === r && styles.rangeTxtActive]}>{r}d</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tasks bar chart */}
        <View style={[styles.chartCard, shadow.sm]}>
          <Text style={styles.chartTitle}>Tasks Completed</Text>
          <View style={styles.barRow}>
            {tasksByDay.map((v, i) => (
              <View key={i} style={styles.barWrap}>
                <View style={[styles.bar, { height: (v / maxTasks) * BAR_MAX_H, backgroundColor: colors.honey }]} />
                <Text style={styles.barLabel}>{format(days[i], range <= 7 ? 'EEE' : 'dd')}</Text>
                {v > 0 && <Text style={styles.barVal}>{v}</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Focus bar chart */}
        <View style={[styles.chartCard, shadow.sm]}>
          <Text style={styles.chartTitle}>Focus Minutes</Text>
          <View style={styles.barRow}>
            {focusByDay.map((v, i) => (
              <View key={i} style={styles.barWrap}>
                <View style={[styles.bar, { height: (v / maxFocus) * BAR_MAX_H, backgroundColor: colors.amber }]} />
                <Text style={styles.barLabel}>{format(days[i], range <= 7 ? 'EEE' : 'dd')}</Text>
                {v > 0 && <Text style={styles.barVal}>{v}</Text>}
              </View>
            ))}
          </View>
        </View>

        {/* Habit streaks */}
        {habits.length > 0 && (
          <View style={[styles.chartCard, shadow.sm]}>
            <Text style={styles.chartTitle}>Habit Streaks</Text>
            {habits.map(h => (
              <View key={h.id} style={styles.habitRow}>
                <Text style={{ fontSize: 20 }}>{h.emoji}</Text>
                <Text style={styles.habitName}>{h.title}</Text>
                <View style={styles.streakBar}>
                  <View style={[styles.streakFill, { width: `${Math.min((h.streak / 30) * 100, 100)}%`, backgroundColor: h.color }]} />
                </View>
                <Text style={styles.streakNum}>🔥 {h.streak}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 40 },
  screenTitle: { fontSize: fonts.xl, fontWeight: '700', color: colors.black, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, gap: 8, marginBottom: 12 },
  statCard: { backgroundColor: colors.cardBg, borderRadius: radius.lg, padding: 16, alignItems: 'center', width: '47%', marginHorizontal: '1.5%' },
  statIcon: { fontSize: 24, marginBottom: 4 },
  statVal: { fontSize: fonts.xxl, fontWeight: '800', color: colors.black },
  statLabel: { fontSize: fonts.sm, color: colors.muted, marginTop: 2, textAlign: 'center' },
  rangeRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  rangeChip: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: radius.round, borderWidth: 1.5, borderColor: colors.combDark, backgroundColor: colors.cardBg },
  rangeChipActive: { backgroundColor: colors.honey, borderColor: colors.honeyDark },
  rangeTxt: { fontSize: fonts.sm, color: colors.muted, fontWeight: '600' },
  rangeTxtActive: { color: colors.black },
  chartCard: { backgroundColor: colors.cardBg, borderRadius: radius.lg, margin: 16, marginTop: 0, marginBottom: 12, padding: 16 },
  chartTitle: { fontSize: fonts.lg, fontWeight: '700', color: colors.black, marginBottom: 16 },
  barRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 4, height: BAR_MAX_H + 30 },
  barWrap: { flex: 1, alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  bar: { width: '80%', borderRadius: 4, minHeight: 2 },
  barLabel: { fontSize: 10, color: colors.muted },
  barVal: { fontSize: 9, color: colors.muted, position: 'absolute', top: 0 },
  habitRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  habitName: { fontSize: fonts.sm, color: colors.black, width: 80 },
  streakBar: { flex: 1, height: 10, backgroundColor: colors.comb, borderRadius: 5, overflow: 'hidden' },
  streakFill: { height: '100%', borderRadius: 5 },
  streakNum: { fontSize: fonts.sm, color: colors.muted, width: 36 },
});
