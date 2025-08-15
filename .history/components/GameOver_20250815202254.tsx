import React from 'react';
import { Text, View } from 'react-native';
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



export default GameOver;

