import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Habit, useStore } from '../store/useStore';
import { colors, fonts, radius, shadow } from '../theme/beeTheme';

interface Props { habit: Habit; }

export function HabitItem({ habit }: Props) {
  const { toggleHabitToday, deleteHabit } = useStore();
  const todayStr = new Date().toISOString().split('T')[0];
  const doneToday = habit.completedDates.includes(todayStr);

  const handle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleHabitToday(habit.id);
  };

  return (
    <View style={[styles.row, shadow.sm]}>
      <View style={[styles.dot, { backgroundColor: habit.color }]}>
        <Text style={{ fontSize: 18 }}>{habit.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.title}>{habit.title}</Text>
        <Text style={styles.streak}>🔥 {habit.streak} day streak</Text>
      </View>
      <TouchableOpacity style={[styles.btn, doneToday && styles.btnDone]} onPress={handle}>
        <Text style={[styles.btnTxt, doneToday && styles.btnTxtDone]}>
          {doneToday ? '✓ Done' : 'Mark'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteHabit(habit.id)} style={styles.del}>
        <Text style={styles.delTxt}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dot: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  title: { fontSize: fonts.base, color: colors.black, fontWeight: '500' },
  streak: { fontSize: fonts.sm, color: colors.muted, marginTop: 2 },
  btn: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.round,
    borderWidth: 1.5,
    borderColor: colors.honey,
  },
  btnDone: { backgroundColor: colors.honey, borderColor: colors.honeyDark },
  btnTxt: { fontSize: fonts.sm, color: colors.honeyDark, fontWeight: '600' },
  btnTxtDone: { color: colors.black },
  del: { padding: 4 },
  delTxt: { fontSize: 22, color: colors.muted, lineHeight: 24 },
});
