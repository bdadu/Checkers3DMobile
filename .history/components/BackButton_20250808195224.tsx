import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BackButtonProps {
  onPress: () => void;
  style?: object;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, style }) => (
  <TouchableOpacity
    style={[styles.button, style]}
    onPress={onPress}
    accessibilityLabel="Back"
    activeOpacity={0.7}
  >
    <Ionicons name="arrow-back-circle" size={40} color="#D6C0B3" style={styles.icon} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 50,
    left: 50,
    zIndex: 1005,
    borderRadius: 20,
  },
  icon: {
    // Efect de hover nu există nativ, dar poți folosi Pressable pentru efecte suplimentare
  },
});

export default BackButton;
