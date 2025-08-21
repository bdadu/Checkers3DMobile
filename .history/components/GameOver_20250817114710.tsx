import React from 'react';
import { Text, View } from 'react-native';
import PlayAgain from './PlayAgain';
import { styles, backgroundImage } from '@/utils/Styles';
import { ImageBackground } from 'react-native';


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

