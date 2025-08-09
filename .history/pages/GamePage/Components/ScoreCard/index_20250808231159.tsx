import { AnimatePresence, MotiText, MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Colors from '../../../../constants/Colors';

interface ScoreCardProps {
  scoreDark: number;
  scoreLight: number;
  style?: ViewStyle;
}

export default function ScoreCard({ scoreDark, scoreLight, style }: ScoreCardProps) {
  return (
    <MotiView
      style={[styles.card, style]}
      from={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300 }}
    >
      <Text style={styles.title}>SCOREBOARD</Text>

      {/* Player (dot negru) */}
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={[styles.dot, { backgroundColor: '#000' }]} />
          <Text style={styles.label}>Player</Text>
        </View>
        <AnimatedScore key={scoreDark} value={scoreDark} color={Colors.beige.lightBeige} />
      </View>

      {/* Bot (dot alb) */}
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={[styles.dot, { backgroundColor: '#fff' }]} />
          <Text style={styles.label}>Bot</Text>
        </View>
        <AnimatedScore key={scoreLight} value={scoreLight} color={Colors.beige.lightBeige2} />
      </View>
    </MotiView>
  );
}

function AnimatedScore({ value, color }: { value: number; color: string }) {
  return (
    <AnimatePresence>
      <MotiText
        key={value}
        from={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 1 }}
        exit={{ scale: 0.6, opacity: 0 }}
        transition={{ type: 'timing', duration: 300 }}
        style={[styles.score, { color }]}
      >
        {value}
      </MotiText>
    </AnimatePresence>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 220,           // ⬅️ cerut
    height: 100,          // ⬅️ cerut
    backgroundColor: Colors.brown.darkBrown,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    shadowColor: Colors.brown.mediumBrown,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.brown.mediumBrown,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: Colors.white.lightWhite,
    marginBottom: 4,
    textAlign: 'center',
    textShadowColor: Colors.brown.lightBrown,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.beige.lightBeige,
    textShadowColor: Colors.white.lightWhite,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: Colors.white.lightWhite,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
});