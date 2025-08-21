import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/Colors';
import Modal from './Modal';

export default function TermsAndConditionButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <TouchableOpacity onPress={handleOpen} activeOpacity={0.7}>
        <Text style={styles.link}>Terms & Conditions</Text>
      </TouchableOpacity>
      <Modal visible={isOpen} onClose={handleClose}>
        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Terms of Use</Text>
          <Text style={styles.paragraph}>
            Welcome to our 3D Checkers Game app.\nBy downloading or using this app, you agree to the following terms:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>1. The app is provided &quot;as is&quot;, without warranty of any kind.</Text>
            <Text style={styles.listItem}>2. All intellectual property (graphics, gameplay, design, and logic) belongs to [Your Name or Studio Name].</Text>
            <Text style={styles.listItem}>3. The app is for personal, non-commercial use only.</Text>
            <Text style={styles.listItem}>4. You may not attempt to copy, modify, distribute or reverse-engineer the app.</Text>
            <Text style={styles.listItem}>5. Payments made through App Store or Google Play are final and non-refundable, except as required by applicable law.</Text>
            <Text style={styles.listItem}>6. We reserve the right to update these Terms at any time.</Text>
          </View>
          <Text style={styles.paragraph}>If you do not agree with these terms, please uninstall the app.</Text>
          <Text style={styles.paragraph}>For questions, contact: [your_email@example.com]</Text>
          <Text style={styles.date}>© 2025 [Your Name or Studio Name]. All rights reserved.</Text>
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
