import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Task, useStore } from '../store/useStore';
import { colors, fonts, radius, shadow } from '../theme/beeTheme';

interface Props { task: Task; }

export function TaskItem({ task }: Props) {
  const { toggleTask, deleteTask } = useStore();

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleTask(task.id);
  };

  return (
    <View style={[styles.row, shadow.sm]}>
      <TouchableOpacity style={[styles.check, task.completed && styles.checkDone]} onPress={handleToggle}>
        {task.completed && <Text style={styles.tick}>✓</Text>}
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.title, task.completed && styles.titleDone]}>{task.title}</Text>
        <Text style={styles.cat}>{task.category}</Text>
      </View>
      <TouchableOpacity onPress={() => deleteTask(task.id)} style={styles.del}>
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
  check: {
    width: 24, height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.honey,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkDone: { backgroundColor: colors.honey, borderColor: colors.honeyDark },
  tick: { color: colors.black, fontWeight: '700', fontSize: fonts.sm },
  info: { flex: 1 },
  title: { fontSize: fonts.base, color: colors.black, fontWeight: '500' },
  titleDone: { textDecorationLine: 'line-through', color: colors.muted },
  cat: { fontSize: fonts.sm, color: colors.muted, marginTop: 2 },
  del: { padding: 4 },
  delTxt: { fontSize: 22, color: colors.muted, lineHeight: 24 },
});
