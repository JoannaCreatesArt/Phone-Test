import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/beeTheme';

interface Props {
  size?: number;
  mood?: 'idle' | 'happy' | 'working' | 'celebrating';
}

// Placeholder for animated bee — swap this View for a Lottie or Rive animation later
export function BeeCharacter({ size = 80, mood = 'idle' }: Props) {
  const emoji = {
    idle: '🐝',
    happy: '🐝',
    working: '🐝',
    celebrating: '🐝',
  }[mood];

  return (
    <View style={[styles.container, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={{ fontSize: size * 0.55 }}>{emoji}</Text>
      {/* ANIMATED BEE PLACEHOLDER — replace with Lottie/Rive component */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.combDark,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.honeyDark,
  },
});
