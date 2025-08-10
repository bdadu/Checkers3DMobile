import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const backgroundImage = require('../assets/images/backgroundCover.webp'); // vezi nota WebP mai jos
export const textCheckers = require('../assets/images/title.png');

export const styles = StyleSheet.create({
  homeGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // ❌ NU: backgroundImage: backgroundImage
  },

  gameGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // ❌ NU: backgroundImage: backgroundImage
  },

  // Acest stil se aplică pe <ImageBackground />
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  startAgainButton: {
    zIndex: 1000,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: Colors.brown.brown,
    borderRadius: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  gameLevelSelectionGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  textCheckers: {
    width: "40%",
    height: "auto",
    borderRadius: 10,
    marginBottom: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }
  });