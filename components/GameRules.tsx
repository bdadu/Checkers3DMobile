import CustomButton from '@/components/CustomButton';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Colors from '../constants/Colors';
import Modal from './Modal';

export default function GameRulesButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <>
      <View style={{ width: 200, alignItems: 'center', marginTop: 1 }}>
        <CustomButton
          label="Game Rules"
          handleClick={handleOpen}
          backgroundColor={Colors.brown.darkBrown}
          width={160}
        />
      </View>
      <Modal visible={isOpen} onClose={handleClose}>
        <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>How to Play</Text>
          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.subtitle}>🎯 Objective</Text>
            <Text style={styles.paragraph}>
              Capture all opponent pieces. The game ends when a side reaches the opponent’s starting total of pieces for the chosen difficulty
              <Text >  Easy 28  </Text>
              <Text >  Medium 32  </Text>
              <Text >  Hard 36  </Text>
              points.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>♟️ Board & Pieces</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• 3 stacked 8×8 layers (planes/boards).</Text>
              <Text style={styles.listItem}>• You play only on the dark squares.</Text>
              <Text style={styles.listItem}>• Two sides: Dark (D) and Light (L). Dark moves first.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>🧩 Initial Setup (by difficulty)</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Hard: All 3 layers with the full standard setup.</Text>
              <Text style={styles.listSubItem}>— Dark on rows 0–2; Light on rows 5–7 on every layer (36 pieces per side total).</Text>
              <Text style={styles.listItem}>• Medium: Mixed layers.</Text>
              <Text style={styles.listSubItem}>— Layer 0: full (D: 0–2, L: 5–7)</Text>
              <Text style={styles.listSubItem}>— Layer 1: partial (D: 0–1, L: 6–7)</Text>
              <Text style={styles.listSubItem}>— Layer 2: full (D: 0–2, L: 5–7)</Text>
              <Text style={styles.listItem}>• Easy: Two full layers and one minimal.</Text>
              <Text style={styles.listSubItem}>— Layer 0: full (D: 0–2, L: 5–7)</Text>
              <Text style={styles.listSubItem}>— Layer 1: minimal (D: row 0, L: row 7)</Text>
              <Text style={styles.listSubItem}>— Layer 2: full (D: 0–2, L: 5–7)</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>🔁 Turn Order</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Turns alternate: Dark (player) → Light (bot).</Text>
              <Text style={styles.listItem}>• After the player moves, the bot moves automatically after a short delay.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>🕹️ Movement</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Men move one diagonal step forward per turn.</Text>
              <Text style={styles.listSubItem}>— Dark moves forward along negative Z; Light along positive Z.</Text>
              <Text style={styles.listSubItem}>— A move can be on the same layer or to a neighboring one (up/down 1 level).</Text>
              <Text style={styles.listItem}>• You cannot move onto light squares or occupied squares (unless capturing).</Text>
              <Text style={styles.listItem}>• You cannot move the bot’s pieces.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>⚔️ Capturing</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Jump diagonally over exactly one adjacent opponent piece, landing on the empty square immediately beyond.</Text>
              <Text style={styles.listItem}>• Jumps can be on the same layer or across layers (changing 1–2 levels if the path is valid).</Text>
              <Text style={styles.listItem}>• Captures are NOT mandatory.</Text>
              <Text style={styles.listItem}>• Multi-capture chains in a single turn are not implemented (one capture per turn).</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>👑 Promotion (Queen)</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• A man reaching the opponent’s back rank becomes a Queen.</Text>
              <Text style={styles.listItem}>• Queens move both forward and backward, still one diagonal step per turn (no long-range moves).</Text>
              <Text style={styles.listItem}>• Queens capture the same way, including across layers when positions allow.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>🏁 End Conditions</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Game Over when a side reaches: Easy 28, Medium 32, Hard 36 capture points.</Text>
              <Text style={styles.listItem}>• The end screen shows the result based on capture scores.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>🎮 Controls</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Tap a piece to select it, then tap a valid dark square to move.</Text>
              <Text style={styles.listItem}>• Invalid moves are ignored.</Text>
              <Text style={styles.listItem}>• Rotate/zoom the 3D board with gestures — this doesn’t affect the rules.</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.subtitle}>🧭 3D Variant Notes</Text>
            <View style={styles.list}>
              <Text style={styles.listItem}>• Moves and captures may traverse between stacked layers.</Text>
              <Text style={styles.listSubItem}>— Simple move: same layer or one neighboring layer.</Text>
              <Text style={styles.listSubItem}>— Capture: may cross up to two layers if the path is valid.</Text>
              <Text style={styles.listItem}>• Positions snap to square centers with a small tolerance for 3D coordinates.</Text>
            </View>
          </View>
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
    alignItems: 'stretch',
    padding: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    alignSelf: 'center',
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  divider: {
    height: 2,
    backgroundColor: Colors.beige.lightBeige2,
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
    color: Colors.beige.lightBeige2,
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
    paddingLeft: 4,
  },
  listItem: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 4,
    lineHeight: 22,
  },
  listSubItem: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 3,
    paddingLeft: 12,
    opacity: 0.9,
    lineHeight: 21,
  },
  badge: {
    color: Colors.brown.darkBrown,
    backgroundColor: Colors.beige.lightBeige2,
    borderRadius: 6,
    overflow: 'hidden',
    marginHorizontal: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
    fontWeight: '700',
  },
});