import React from 'react';
import { TextInput, StyleSheet, View, Text, TextInputProps } from 'react-native';

interface CustomTextFieldInputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export default function CustomTextFieldInput({ label, error, style, ...props }: CustomTextFieldInputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.input, style]} {...props} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    color: '#493628',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#AB886D',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#FFF8E6',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});
