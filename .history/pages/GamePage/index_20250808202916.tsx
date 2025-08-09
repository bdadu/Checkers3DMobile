import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const GamePage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Page</Text>
      {/* Aici va fi tabla de joc și logica de joc */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#493628',
    marginBottom: 16,
  },
});

export default GamePage;
