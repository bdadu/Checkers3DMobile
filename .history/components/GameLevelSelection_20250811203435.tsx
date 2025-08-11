import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/App';
import BackButton from './BackButton';
import CustomButton from './CustomButton';

export default function GameLevelSelection() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <CustomButton
        label="Easy"
        handleClick={() => navigation.replace('Game', { initialLevel: 'Easy' })}
        backgroundColor="#493628"
        width={160}
      />
      <CustomButton
        label="Medium"
        handleClick={() => navigation.replace('Game', { initialLevel: 'Medium' })}
        backgroundColor="#493628"
        width={160}
      />
      <CustomButton
        label="Hard"
        handleClick={() => navigation.replace('Game', { initialLevel: 'Hard' })}
        backgroundColor="#493628"
        width={160}
      />

      <BackButton onPress={() => navigation.goBack()} style={styles.backButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: 'transparent' },
  backButton: { position: 'absolute', bottom: 40, left: 40 },
});