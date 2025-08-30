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
          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.subtitle}>📜 Welcome</Text>
            <Text style={styles.paragraph}>Welcome to our 3D Checkers Game app.</Text>
            <Text style={styles.paragraph}>By downloading or using this app, you agree to the following terms:</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>📌 Key Terms</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>1. The app is provided "as is", without warranty of any kind.</Text>
              <Text style={styles.listItem}>2. All intellectual property (graphics, gameplay, design, code and logic) belongs to Bogdan Dadu.</Text>
              <Text style={styles.listItem}>3. The app is for personal, non-commercial use only.</Text>
              <Text style={styles.listItem}>4. You may not attempt to copy, modify, distribute or reverse-engineer the app.</Text>
              <Text style={styles.listItem}>5. Payments made through App Store or Google Play are final and non-refundable, except as required by applicable law.</Text>
              <Text style={styles.listItem}>6. We reserve the right to update these Terms at any time.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>🧾 Acknowledgement</Text>
            <Text style={styles.paragraph}>If you do not agree with these terms, please uninstall the app.</Text>
            <Text style={styles.paragraph}>For questions, contact: bogdandadugames@gmail.com</Text>
            <Text style={styles.date}>© 2025 Bogdan Dadu. All rights reserved.</Text>
          </View>
        </ScrollView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    marginVertical: 8,
    textAlign: 'center',
  },
  modalContent: {
    alignItems: 'stretch',
    padding: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.beige?.lightBeige2 ?? '#FFE0B5',
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.beige?.lightBeige2 ?? '#FFE0B5',
    opacity: 0.7,
    width: 140,
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 8,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  paragraph: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 6,
    textAlign: 'left',
    lineHeight: 22,
  },
  list: {
    alignSelf: 'stretch',
    marginBottom: 2,
  },
  listItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'left',
    lineHeight: 22,
  },
  date: {
    color: '#fff',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'left',
    opacity: 0.9,
  },
});
