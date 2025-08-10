import React, { useState } from 'react';
import { Image, ImageBackground, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import GameLevelSelection from '../../components/GameLevelSelection';
import TermsAndConditionButton from '../../components/TermsAndConditionButton';
import PrivacyPolicyButton from '../../components/PrivacyPolicyButton';
import GamePage from '../GamePage/gamePage';
import { styles, backgroundImage, textCheckers } from '../../utils/Styles'; // ← folosește fișierul tău Styles
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

export default function HomePage() {
  const [showGameLevelSelection, setShowGameLevelSelection] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<'Easy' | 'Medium' | 'Hard' | null>(null);

  const handlePlayClick = () => setShowGameLevelSelection(true);

  const handleSelectLevel = (level: 'Easy' | 'Medium' | 'Hard') => {
    setSelectedLevel(level);
    setShowGameLevelSelection(false);
  };

  // Dacă avem un nivel selectat, intrăm în GamePage cu acel nivel (fără să mai ceară încă o dată)
  if (selectedLevel) {
    return <GamePage initialLevel={selectedLevel} />;
  }

  // Ecranul cu alegerea nivelului
  if (showGameLevelSelection) {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
          <GameLevelSelection
            onSelectLevel={handleSelectLevel}
            onBack={() => setShowGameLevelSelection(false)} // ← FIX pentru BackButton
          />
        </ImageBackground>
      </View>
    );
  }

  // Home (logo + butoane)
  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
      <View style={styles.homeGrid}>
        <Image source={textCheckers} style={styles.textCheckers} resizeMode="contain" />
        <View style={{ width: 200, alignItems: 'center', marginTop: 24 }}>
          <CustomButton
            label="PLAY"
            handleClick={handlePlayClick}
            backgroundColor="#493628"
            width={160}
          />
        </View>
        <View style={{ position: 'absolute', bottom: 40, width: '100%', flexDirection: 'row', justifyContent: 'space-around' }}>
          <TermsAndConditionButton />
          <PrivacyPolicyButton />
        </View>
      </View>
    </ImageBackground>
  );
}