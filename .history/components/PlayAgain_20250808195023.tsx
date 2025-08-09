import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface PlayAgainProps {
  onPress: () => void;
}

export default function PlayAgain({ onPress }: PlayAgainProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>Play Again</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#AB886D',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
