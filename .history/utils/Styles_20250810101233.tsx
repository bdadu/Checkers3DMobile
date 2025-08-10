import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

// Import corect pentru imagini în React Native
export const backgroundImage = require('../assets/images/backgroundCover.webp');
export const textCheckers = require('../assets/images/title.png');

// Pentru fundal cu imagine folosește <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
// Pentru textCheckers folosește <Image source={textCheckers} style={styles.textCheckers} />

export const styles = StyleSheet.create({
  // echivalent pentru homeGridStyled
  homeGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  // echivalent pentru gameGridStyled
  gameGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // stilul care se aplică pe <ImageBackground />
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // echivalent pentru textCheckers ca <Image />
  textCheckers: {
    width: 200,
    height: 60,
    resizeMode: 'contain',
    alignSelf: 'center',
  },

  // echivalent pentru startAgainStyleButton (fără :hover/:active/cursor/border)
  startAgainButton: {
    position: 'absolute',
    top: 210,
    left: 120,
    zIndex: 1000,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.brown.brown,
    borderRadius: 5,
    // “shadow” pe iOS + “elevation” pe Android
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },

  // echivalent pentru gameLevelSelectionGridStyled
  gameLevelSelectionGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});
