import { backgroundImage, styles } from '@/utils/Styles';
import React from 'react';
import { ImageBackground, Text, View } from 'react-native';
import PlayAgain from './PlayAgain';


interface GameOverProps {
  position?: any;
  onComplete?: () => void;
  onPlayAgain: () => void;
  winnerText: string;
}

const GameOver: React.FC<GameOverProps> = ({ onPlayAgain, winnerText }) => {
  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
    <View style={styles.gameOver}>
      <Text style={styles.title}>GAME OVER</Text>
      <Text style={styles.winner}>{winnerText}</Text>
      <PlayAgain onPress={onPlayAgain} />
    </View>
    </ImageBackground>
  );
};



export default GameOver;

