import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform,
} from 'react-native';
import { HabitItem } from '../components/HabitItem';
import { useStore } from '../store/useStore';
import { colors, fonts, radius, shadow } from '../theme/beeTheme';

const EMOJIS = ['⭐', '💪', '📚', '🏃', '💧', '🧘', '🎨', '🌱'];
const PALETTE = ['#FFD54F', '#81C784', '#64B5F6', '#F06292', '#BA68C8', '#4DB6AC', '#FF8A65', '#A1887F'];

export function HabitsScreen() {
  const { habits, addHabit } = useStore();
  const [title, setTitle] = useState('');
  const [emoji, setEmoji] = useState('⭐');
  const [color, setColor] = useState(PALETTE[0]);
  const [adding, setAdding] = useState(false);

  const submit = () => {
    if (!title.trim()) return;
    addHabit(title.trim(), emoji, color);
    setTitle('');
    setAdding(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Habits 🌟</Text>
          <TouchableOpacity style={styles.newBtn} onPress={() => setAdding(v => !v)}>
            <Text style={styles.newBtnTxt}>{adding ? '✕' : '+ New'}</Text>
          </TouchableOpacity>
        </View>

        {adding && (
          <View style={[styles.addCard, shadow.sm]}>
            <TextInput
              style={styles.input}
              placeholder="Habit name…"
              placeholderTextColor={colors.muted}
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            <Text style={styles.pickLabel}>Pick an emoji</Text>
            <View style={styles.row}>
              {EMOJIS.map(e => (
                <TouchableOpacity key={e} style={[styles.emojiBtn, emoji === e && styles.emojiBtnActive]} onPress={() => setEmoji(e)}>
                  <Text style={{ fontSize: 20 }}>{e}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.pickLabel}>Pick a color</Text>
            <View style={styles.row}>
              {PALETTE.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotActive]}
                  onPress={() => setColor(c)}
                />
              ))}
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={submit}>
              <Text style={styles.addBtnTxt}>Add Habit</Text>
            </TouchableOpacity>
          </View>
        )}

        <FlatList
          data={habits}
          keyExtractor={h => h.id}
          renderItem={({ item }) => <HabitItem habit={item} />}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 4 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 40 }}>🌸</Text>
              <Text style={styles.emptyTxt}>No habits yet — start building your honeycomb!</Text>
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
  newBtn: { backgroundColor: colors.honey, paddingHorizontal: 14, paddingVertical: 6, borderRadius: radius.round },
  newBtnTxt: { fontWeight: '700', color: colors.black, fontSize: fonts.sm },
  addCard: { backgroundColor: colors.cardBg, borderRadius: radius.lg, margin: 16, padding: 16, gap: 10 },
  input: { fontSize: fonts.base, color: colors.black, borderBottomWidth: 1.5, borderBottomColor: colors.combDark, paddingVertical: 6 },
  pickLabel: { fontSize: fonts.sm, color: colors.muted, fontWeight: '600', marginTop: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiBtn: { padding: 6, borderRadius: radius.sm, borderWidth: 2, borderColor: 'transparent' },
  emojiBtnActive: { borderColor: colors.honey, backgroundColor: colors.comb },
  colorDot: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: 'transparent' },
  colorDotActive: { borderColor: colors.black, borderWidth: 3 },
  addBtn: { backgroundColor: colors.honey, borderRadius: radius.md, paddingVertical: 10, alignItems: 'center', marginTop: 4 },
  addBtnTxt: { fontWeight: '700', fontSize: fonts.base, color: colors.black },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyTxt: { color: colors.muted, fontSize: fonts.md, textAlign: 'center', paddingHorizontal: 40 },
});
