import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const backgroundImage = require('../assets/images/backgroundCover.png');
export const textCheckers = require('../assets/images/title.png');

export const styles = StyleSheet.create({
  homeGrid: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    
  },

  gameGrid: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'stretch',
    width: '100%',
    position: 'relative',
  },

 
  backgroundImage: {
    flex: 1,

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
    alignItems: 'center',

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
    width: 280,          
    height: 90,
    borderRadius: 10,
    marginBottom: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  gameOver: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    gap: 1, 
  },
  
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: Colors.brown.darkBrown,
    textAlign: 'center',
  },
  
  winner: {
    fontSize: 35,
    color: Colors.brown.darkBrown,
    marginVertical: 10,
    textAlign: 'center',
    fontWeight: '600',
  },

});