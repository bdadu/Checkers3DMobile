import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';

export default function TermsAndConditionButton() {
  const handlePress = () => {
    Linking.openURL('https://www.example.com/terms-and-conditions');
  };
  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.text}>Terms & Conditions</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#D6C0B3',
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#493628',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
