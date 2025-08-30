import { useState } from 'react';
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
          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.subtitle}>🔒 Our Principles</Text>
            <Text style={styles.paragraph}>
              This app is designed with your privacy in mind. We do not collect, store, or share any personal information.
              We respect your privacy. This app does NOT collect, store, or share any personal data.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>📌 What We Do (and Don’t) Collect</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>1. No personal information is requested, processed or stored.</Text>
              <Text style={styles.listItem}>2. We do not track your activity in the app or use any third-party analytics.</Text>
              <Text style={styles.listItem}>3. Payments are handled securely through the App Store / Google Play and are subject to their terms.</Text>
              <Text style={styles.listItem}>4. We do not access your contacts, location, camera, or microphone.</Text>
              <Text style={styles.listItem}>5. The app works entirely offline and does not send any data to external servers.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>✉️ Contact</Text>
            <Text style={styles.paragraph}>If you have any concerns or questions about your privacy, please contact us at: bogdandadugames@gmail.com</Text>
            <Text style={styles.date}>Last updated: July 15, 2025</Text>
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
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.beige?.lightBeige2 ?? '#FFE0B5',
    marginBottom: 6,
    letterSpacing: 0.3,
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
