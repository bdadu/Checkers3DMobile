import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, ViewStyle } from 'react-native';

interface CustomButtonProps {
  label: string;
  handleClick: (event: GestureResponderEvent) => void;
  backgroundColor?: string;
  hoverColor?: string; // Not used nativ, dar poate fi folosit cu Pressable
  width?: number | string;
  style?: ViewStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  handleClick,
  backgroundColor = '#854836',
  width,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, width },
        style,
      ]}
      onPress={handleClick}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'none',
  },
});

export default CustomButton;

