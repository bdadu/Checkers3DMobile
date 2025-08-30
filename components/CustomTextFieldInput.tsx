import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

interface CustomTextFieldInputProps extends TextInputProps {
  label?: string;
  required?: boolean;
  error?: string;
}

const CustomTextFieldInput: React.FC<CustomTextFieldInputProps> = ({ label, required, error, style, ...props }) => {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}{required && <Text style={{ color: 'red' }}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[styles.input, style]}
        {...props}
        placeholderTextColor="#493628"
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 4,
    color: '#493628',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#AB886D',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#D6C0B3',
    fontSize: 16,
    color: '#493628',
  },
  error: {
    color: 'red',
    marginTop: 4,
    fontSize: 12,
  },
});

export default CustomTextFieldInput;