import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface GameOverProps {
  winner: string;
  onPlayAgain: () => void;
}

export default function GameOver({ winner, onPlayAgain }: GameOverProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.winner}>Winner: {winner}</Text>
      <TouchableOpacity style={styles.button} onPress={onPlayAgain}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#854836',
  },
  winner: {
    fontSize: 20,
    marginBottom: 20,
    color: '#493628',
  },
  button: {
    backgroundColor: '#854836',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
