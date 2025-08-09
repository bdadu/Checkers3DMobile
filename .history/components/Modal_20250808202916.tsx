import React from 'react';
import { Modal as RNModal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  visible: boolean;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, visible }) => {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {children}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: Colors.brown.darkBrown,
    color: 'white',
    padding: 20,
    borderRadius: 5,
    alignItems: 'center',
    width: 300,
    maxHeight: '80%',
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeText: {
    color: Colors.brown.darkBrown,
    fontWeight: 'bold',
  },
});

export default Modal;
