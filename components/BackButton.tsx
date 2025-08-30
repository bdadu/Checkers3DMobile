import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity,StyleProp, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';

interface BackButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>; 
}

const BackButton: React.FC<BackButtonProps> = ({ onPress, style }) => (
  <TouchableOpacity
    style={[styles.base, style]} 
    onPress={onPress}
    accessibilityLabel="Back"
    activeOpacity={0.7}
  >
    <Ionicons name="arrow-back-circle" size={40} color={Colors.gray.lightGray} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  base: {
    borderRadius: 20,
  },
});

export default BackButton;
