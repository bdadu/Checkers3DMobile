import React from 'react';
import { StyleSheet, View } from 'react-native';
import BackButton from './BackButton';
import CustomButton from './CustomButton';

interface GameLevelSelectionProps {
  onSelectLevel: (level: 'Easy' | 'Medium' | 'Hard') => void;
  onBack: () => void;
}

const GameLevelSelection: React.FC<GameLevelSelectionProps> = ({ onSelectLevel, onBack }) => {
  return (
    <View style={styles.container}>
      <CustomButton
        label="Easy"
        handleClick={() => onSelectLevel('Easy')}
        backgroundColor="#493628"
        width={160}
      />
      <CustomButton
        label="Medium"
        handleClick={() => onSelectLevel('Medium')}
        backgroundColor="#493628"
        width={160}
      />
      <CustomButton
        label="Hard"
        handleClick={() => onSelectLevel('Hard')}
        backgroundColor="#493628"
        width={160}
      />
      <BackButton onPress={onBack ? onBack : () => {}} style={styles.backButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  backButton: {
    position: 'absolute',
    bottom: 40,
    left: 40,
  },
});

export default GameLevelSelection;
