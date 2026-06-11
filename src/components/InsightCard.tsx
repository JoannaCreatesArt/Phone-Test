import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BeeCharacter } from './BeeCharacter';
import { useStore } from '../store/useStore';
import { fetchBeeInsight } from '../services/claudeService';
import { colors, fonts, radius, shadow } from '../theme/beeTheme';

export function InsightCard() {
  const { tasks, habits, focusSessions, insightMessage, setInsightMessage } = useStore();
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const msg = await fetchBeeInsight({ tasks, habits, focusSessions });
    setInsightMessage(msg);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [tasks.length, focusSessions.length]);

  return (
    <LinearGradient colors={[colors.honey, colors.amber]} style={[styles.card, shadow.md]}>
      <BeeCharacter size={60} mood="happy" />
      <View style={styles.textWrap}>
        {loading
          ? <ActivityIndicator color={colors.black} />
          : <Text style={styles.msg}>{insightMessage}</Text>
        }
      </View>
      <TouchableOpacity onPress={refresh} style={styles.refreshBtn}>
        <Text style={styles.refreshTxt}>✨</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    gap: 12,
  },
  textWrap: { flex: 1 },
  msg: { color: colors.black, fontSize: fonts.md, lineHeight: 20, fontWeight: '500' },
  refreshBtn: { padding: 4 },
  refreshTxt: { fontSize: 20 },
});
