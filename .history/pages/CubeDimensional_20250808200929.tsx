import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CubeDimensional: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cube Dimensional</Text>
      {/* Aici poți adăuga logica sau vizualizarea pentru cubul 3D */}
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

export default CubeDimensional;
