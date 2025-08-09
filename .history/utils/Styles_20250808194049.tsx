import { StyleSheet } from 'react-native';
import Colors from './Colors';

// Pentru fundal cu imagine folosește <ImageBackground source={require('../images/backgroundCover.webp')} style={styles.backgroundImage}>
// Pentru textCheckers folosește <Image source={require('../images/title.png')} style={styles.textCheckers} />

export const styles = StyleSheet.create({
  homeGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCheckers: {
    width: 200, // ajustează după nevoie
    height: 60, // ajustează după nevoie
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  startAgainButton: {
    position: 'absolute',
    top: 210,
    left: 120,
    zIndex: 1000,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: Colors.brown.brown,
    color: 'white',
    borderRadius: 5,
    fontWeight: 'bold',
    elevation: 4, // shadow pentru Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  gameLevelSelectionGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
});
