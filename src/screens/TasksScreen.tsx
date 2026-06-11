import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { TaskItem } from '../components/TaskItem';
import { useStore } from '../store/useStore';
import { colors, fonts, radius, shadow } from '../theme/beeTheme';

const CATEGORIES = ['General', 'Work', 'Personal', 'Health', 'Creative'];

export function TasksScreen() {
  const { tasks, addTask } = useStore();
  const [text, setText] = useState('');
  const [cat, setCat] = useState('General');
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all');

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addTask(trimmed, cat);
    setText('');
  };

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'done') return t.completed;
    return true;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Tasks 📋</Text>
          <Text style={styles.count}>{tasks.filter(t => !t.completed).length} remaining</Text>
        </View>

        {/* Add task */}
        <View style={[styles.addCard, shadow.sm]}>
          <TextInput
            style={styles.input}
            placeholder="What needs doing? 🐝"
            placeholderTextColor={colors.muted}
            value={text}
            onChangeText={setText}
            onSubmitEditing={submit}
            returnKeyType="done"
          />
          <View style={styles.cats}>
            {CATEGORIES.map(c => (
              <TouchableOpacity
                key={c}
                style={[styles.catChip, cat === c && styles.catChipActive]}
                onPress={() => setCat(c)}
              >
                <Text style={[styles.catTxt, cat === c && styles.catTxtActive]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.addBtn} onPress={submit}>
            <Text style={styles.addBtnTxt}>Add Task</Text>
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
        <View style={styles.filters}>
          {(['all', 'active', 'done'] as const).map(f => (
            <TouchableOpacity key={f} style={[styles.tab, filter === f && styles.tabActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.tabTxt, filter === f && styles.tabTxtActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filtered}
          keyExtractor={t => t.id}
          renderItem={({ item }) => <TaskItem task={item} />}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 4 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyTxt}>No tasks here — the hive is clean! 🍯</Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: fonts.xl, fontWeight: '700', color: colors.black },
  count: { fontSize: fonts.sm, color: colors.muted },
  addCard: { backgroundColor: colors.cardBg, borderRadius: radius.lg, margin: 16, padding: 16, gap: 10 },
  input: { fontSize: fonts.base, color: colors.black, borderBottomWidth: 1.5, borderBottomColor: colors.combDark, paddingVertical: 6 },
  cats: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  catChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.round, borderWidth: 1.5, borderColor: colors.combDark },
  catChipActive: { backgroundColor: colors.honey, borderColor: colors.honeyDark },
  catTxt: { fontSize: fonts.sm, color: colors.muted },
  catTxtActive: { color: colors.black, fontWeight: '600' },
  addBtn: { backgroundColor: colors.honey, borderRadius: radius.md, paddingVertical: 10, alignItems: 'center' },
  addBtnTxt: { fontWeight: '700', fontSize: fonts.base, color: colors.black },
  filters: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 4, gap: 8 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: radius.md, alignItems: 'center', backgroundColor: colors.cardBg },
  tabActive: { backgroundColor: colors.honey },
  tabTxt: { fontSize: fonts.sm, color: colors.muted, fontWeight: '600' },
  tabTxtActive: { color: colors.black },
  empty: { alignItems: 'center', paddingTop: 40 },
  emptyTxt: { color: colors.muted, fontSize: fonts.md },
});
