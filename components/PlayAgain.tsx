import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomButton from './CustomButton';

interface PlayAgainProps {
  onPress: () => void;
}

const PlayAgain: React.FC<PlayAgainProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <CustomButton
        label="Play Again"
        handleClick={onPress}
        backgroundColor="#493628"
        width={150}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
});

export default PlayAgain;