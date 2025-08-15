import React from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import Colors from '../constants/Colors';
import PlayAgain from './PlayAgain';
// Folosim același background ca în GameLevelSelection / GamePage
import { styles as sharedStyles, backgroundImage } from '@/utils/Styles';


interface GameOverProps {
  position?: any;
  onComplete?: () => void;
  onPlayAgain: () => void;
  winnerText: string;
}

const GameOver: React.FC<GameOverProps> = ({ onPlayAgain, winnerText }) => {
  return (
    <ImageBackground source={backgroundImage} style={sharedStyles.backgroundImage} resizeMode="cover">
      <View style={localStyles.container}>
        <Text style={localStyles.title}>GAME OVER</Text>
        <Text style={localStyles.winner}>{winnerText}</Text>
        <PlayAgain onPress={onPlayAgain} />
      </View>
    </ImageBackground>
  );
};

// Stiluri locale specifice componentului GameOver
const localStyles = StyleSheet.create({
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

