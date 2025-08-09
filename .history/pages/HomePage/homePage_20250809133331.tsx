import React, { useState } from 'react';
import { Image, ImageBackground, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import GameLevelSelection from '../../components/GameLevelSelection';
import PrivacyPolicyButton from '../../components/PrivacyPolicyButton';
import TermsAndConditionButton from '../../components/TermsAndConditionButton';
import GamePage from '../GamePage/gamePage';
import { styles, backgroundImage, textCheckers } from '../../utils/Styles'; 
// schimbă calea dacă fișierul tău de stiluri are alt nume

export default function HomePage() {
  const [showGameLevelSelection, setShowGameLevelSelection] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handlePlayClick = () => {
    setShowGameLevelSelection(true);
  };

  const handleSelectLevel = (level: string) => {
    setSelectedLevel(level);
    setShowGameLevelSelection(false);
  };

  if (showGameLevelSelection) {
    return <GameLevelSelection onSelectLevel={handleSelectLevel} />;
  }

  if (selectedLevel) {
    return <GamePage />;
  }

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage} resizeMode="cover">
    <View style={styles.homeGrid}>
      <Image source={textCheckers} style={styles.textCheckers} />

      {/* exemplu buton “Start again” cu stilul convertit */}
      <TouchableOpacity style={styles.startAgainButton} onPress={() => { /* ... */ }}>
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>Pla</Text>
      </TouchableOpacity>
    </View>
  </ImageBackground>
    // <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
    //   <View style={styles.logoContainer}>
    //     <Image source={textCheckers} style={styles.textCheckers} />
    //   </View>

    //   <View style={styles.buttonContainer}>
    //     <CustomButton
    //       label="PLAY"
    //       handleClick={handlePlayClick}
    //       backgroundColor="#493628"
    //       width={160}
    //     />
    //   </View>

    //   <View style={styles.bottomButtons}>
    //     <TermsAndConditionButton />
    //     <PrivacyPolicyButton />
    //   </View>
    // </ImageBackground>
  );
}