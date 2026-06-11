import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { BeeCharacter } from '../components/BeeCharacter';
import { useStore } from '../store/useStore';
import { colors, fonts, radius, shadow } from '../theme/beeTheme';

type Phase = 'work' | 'break' | 'idle';

export function TimerScreen() {
  const { pomodoroMinutes, setPomodoroMinutes, addFocusSession } = useStore();
  const [phase, setPhase] = useState<Phase>('idle');
  const [secondsLeft, setSecondsLeft] = useState(pomodoroMinutes * 60);
  const [label, setLabel] = useState('Focus session');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef<number>(0);

  const totalSeconds = phase === 'break' ? 5 * 60 : pomodoroMinutes * 60;
  const progress = secondsLeft / totalSeconds;

  useEffect(() => {
    if (phase === 'idle') setSecondsLeft(pomodoroMinutes * 60);
  }, [pomodoroMinutes, phase]);

  const start = (p: Phase) => {
    setPhase(p);
    setSecondsLeft(p === 'break' ? 5 * 60 : pomodoroMinutes * 60);
    startedAt.current = Date.now();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const stop = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    if (phase === 'work') {
      const elapsed = Math.floor((Date.now() - startedAt.current) / 60000);
      if (elapsed >= 1) addFocusSession(elapsed, label);
    }
    setPhase('idle');
    setSecondsLeft(pomodoroMinutes * 60);
  };

  useEffect(() => {
    if (phase === 'idle') { if (intervalRef.current) clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          if (phase === 'work') {
            const mins = pomodoroMinutes;
            addFocusSession(mins, label);
            setPhase('break');
            return 5 * 60;
          } else {
            setPhase('idle');
            return pomodoroMinutes * 60;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const isRunning = phase !== 'idle';
  const beeMood = phase === 'work' ? 'working' : phase === 'break' ? 'happy' : 'idle';

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.screenTitle}>Pomodoro Timer ⏱</Text>

      <LinearGradient
        colors={phase === 'work' ? [colors.honey, colors.amber] : phase === 'break' ? ['#A5D6A7', '#66BB6A'] : [colors.comb, colors.combDark]}
        style={[styles.timerCard, shadow.md]}
      >
        <BeeCharacter size={72} mood={beeMood} />
        <Text style={styles.phaseLabel}>
          {phase === 'work' ? '🍯 Focus time' : phase === 'break' ? '🌸 Break time' : '🐝 Ready to buzz?'}
        </Text>
        <Text style={styles.clock}>{mins}:{secs}</Text>

        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </LinearGradient>

      {/* Session label */}
      {!isRunning && (
        <View style={[styles.labelCard, shadow.sm]}>
          <Text style={styles.labelHint}>Session label</Text>
          <TextInput
            style={styles.labelInput}
            value={label}
            onChangeText={setLabel}
            placeholder="What are you working on?"
            placeholderTextColor={colors.muted}
          />
        </View>
      )}

      {/* Duration picker */}
      {!isRunning && (
        <View style={styles.durationRow}>
          {[15, 25, 30, 45, 60].map(m => (
            <TouchableOpacity
              key={m}
              style={[styles.durChip, pomodoroMinutes === m && styles.durChipActive]}
              onPress={() => setPomodoroMinutes(m)}
            >
              <Text style={[styles.durTxt, pomodoroMinutes === m && styles.durTxtActive]}>{m}m</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Controls */}
      <View style={styles.controls}>
        {!isRunning ? (
          <TouchableOpacity style={styles.startBtn} onPress={() => start('work')}>
            <Text style={styles.startBtnTxt}>▶  Start Focus</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopBtn} onPress={stop}>
            <Text style={styles.stopBtnTxt}>■  Stop</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg, alignItems: 'center' },
  screenTitle: { fontSize: fonts.xl, fontWeight: '700', color: colors.black, alignSelf: 'flex-start', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  timerCard: {
    borderRadius: radius.xl,
    padding: 32,
    alignItems: 'center',
    width: '88%',
    marginTop: 8,
    gap: 12,
  },
  phaseLabel: { fontSize: fonts.lg, fontWeight: '600', color: colors.black },
  clock: { fontSize: 72, fontWeight: '800', color: colors.black, letterSpacing: 2 },
  progressTrack: { width: '100%', height: 8, backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: colors.black, borderRadius: 4 },
  labelCard: { backgroundColor: colors.cardBg, borderRadius: radius.md, padding: 14, width: '88%', marginTop: 16 },
  labelHint: { fontSize: fonts.sm, color: colors.muted, marginBottom: 4 },
  labelInput: { fontSize: fonts.base, color: colors.black },
  durationRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
  durChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.round, borderWidth: 1.5, borderColor: colors.combDark, backgroundColor: colors.cardBg },
  durChipActive: { backgroundColor: colors.honey, borderColor: colors.honeyDark },
  durTxt: { fontSize: fonts.sm, color: colors.muted, fontWeight: '600' },
  durTxtActive: { color: colors.black },
  controls: { marginTop: 24, width: '88%' },
  startBtn: { backgroundColor: colors.black, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' },
  startBtnTxt: { color: colors.honey, fontSize: fonts.lg, fontWeight: '700', letterSpacing: 1 },
  stopBtn: { backgroundColor: colors.danger, borderRadius: radius.lg, paddingVertical: 16, alignItems: 'center' },
  stopBtnTxt: { color: colors.white, fontSize: fonts.lg, fontWeight: '700' },
});
