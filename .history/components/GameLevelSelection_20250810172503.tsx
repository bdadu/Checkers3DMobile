import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from 'navigation/types';
import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import CustomButton from './CustomButton';
import BackButton from './BackButton';
import { styles, backgroundImage } from '@/utils/Styles';


type Nav = NativeStackNavigationProp<RootStackParamList, 'GameLevelSelection'>;

const GameLevelSelection: React.FC = () => {
  const navigation = useNavigation<Nav>();

  return (
     <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
    <View style={styles.gameLevelSelectionGrid}>
      <CustomButton label="Easy"   handleClick={() => navigation.navigate('Game', { initialLevel: 'Easy' })}   backgroundColor="#493628" width={160} />
      <CustomButton label="Medium" handleClick={() => navigation.navigate('Game', { initialLevel: 'Medium' })} backgroundColor="#493628" width={160} />
      <CustomButton label="Hard"   handleClick={() => navigation.navigate('Game', { initialLevel: 'Hard' })}   backgroundColor="#493628" width={160} />
      <BackButton onPress={() => navigation.goBack()}  />
    </View>
    </ImageBackground>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//     backgroundColor: 'transparent',
//   },
//   backButton: {
//     position: 'absolute',
//     bottom: 40,
//     left: 40,
  // },
// });

export default GameLevelSelection;
