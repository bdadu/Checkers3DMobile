import React from 'react';
import { Image, ImageBackground, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import TermsAndConditionButton from '../../components/TermsAndConditionButton';
import PrivacyPolicyButton from '../../components/PrivacyPolicyButton';
import { styles, backgroundImage, textCheckers } from '../../utils/Styles';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@app';


type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomePage() {
  const navigation = useNavigation<Nav>();
  const handlePlayClick = () => navigation.navigate('GameLevelSelection');

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.homeGrid}>
        <Image source={textCheckers} style={styles.textCheckers} resizeMode="contain" />
        <View style={{ width: 200, alignItems: 'center', marginTop: 24 }}>
          <CustomButton label="PLAY" handleClick={handlePlayClick} backgroundColor="#493628" width={160} />
        </View>
        <View style={{ position: 'absolute', bottom: 40, width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
          <TermsAndConditionButton />
          <PrivacyPolicyButton />
        </View>
      </View>
    </ImageBackground>
  );
}