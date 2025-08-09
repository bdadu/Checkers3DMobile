import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import Modal from './Modal';

export default function PrivacyPolicyButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <TouchableOpacity onPress={handleOpen} activeOpacity={0.7}>
        <Text style={styles.link}>Privacy Policy</Text>
      </TouchableOpacity>
      <Modal visible={isOpen} onClose={handleClose}>
        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Privacy Policy</Text>
          <Text style={styles.paragraph}>
            This app is designed with your privacy in mind. We do not collect, store, or share any personal information.
            We respect your privacy. This app does NOT collect, store, or share any personal data.
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>1. No personal information is requested, processed or stored.</Text>
            <Text style={styles.listItem}>2. We do not track your activity in the app or use any third-party analytics.</Text>
            <Text style={styles.listItem}>
              3. Payments are handled securely through the App Store / Google Play and are subject to their terms.
            </Text>
            <Text style={styles.listItem}>4. We do not access your contacts, location, camera, or microphone.</Text>
            <Text style={styles.listItem}>5. The app works entirely offline and does not send any data to external servers.</Text>
          </View>
          <Text style={styles.paragraph}>
            If you have any concerns or questions about your privacy, please contact us at: [your_email@example.com]
          </Text>
          <Text style={styles.date}>Last updated: July 15, 2025</Text>
        </ScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    color: Colors.brown.darkBrown,
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginVertical: 8,
    textAlign: 'center',
  },
  modalContent: {
    alignItems: 'center',
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  paragraph: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'justify',
  },
  list: {
    alignSelf: 'stretch',
    marginBottom: 10,
  },
  listItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'left',
  },
  date: {
    color: '#fff',
    fontSize: 14,
    marginTop: 10,
    textAlign: 'center',
  },
});
