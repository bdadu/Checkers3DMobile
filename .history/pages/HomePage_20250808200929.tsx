import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HomePage: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to 3D Checkers!</Text>
      {/* Adaugă aici componentele sau butoanele pentru navigare */}
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#493628',
    marginBottom: 24,
  },
});

export default HomePage;
