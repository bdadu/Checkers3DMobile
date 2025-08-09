import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface GameLevelSelectionProps {
  levels: string[];
  onSelect: (level: string) => void;
  selectedLevel: string;
}

export default function GameLevelSelection({ levels, onSelect, selectedLevel }: GameLevelSelectionProps) {
  return (
    <View style={styles.container}>
      {levels.map(level => (
        <TouchableOpacity
          key={level}
          style={[styles.button, selectedLevel === level && styles.selected]}
          onPress={() => onSelect(level)}
        >
          <Text style={styles.text}>{level}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  button: {
    backgroundColor: '#D6C0B3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginHorizontal: 8,
  },
  selected: {
    backgroundColor: '#854836',
  },
  text: {
    color: '#493628',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
