import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import PlayAgain from './PlayAgain';

interface GameOverProps {
  position?: any;
  onComplete?: () => void;
  onPlayAgain: () => void;
  winnerText: string;
}

const GameOver: React.FC<GameOverProps> = ({ onPlayAgain, winnerText }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAME OVER</Text>
      <Text style={styles.winner}>{winnerText}</Text>
      <PlayAgain onPress={onPlayAgain} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 1, // Reduce distanța între elemente (gap nu e standard, dar RN 0.71+ îl suportă)
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.brown.darkBrown,
    textAlign: 'center',
  },
  winner: {
    fontSize: 35,
    color: Colors.brown.darkBrown,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default GameOver;

