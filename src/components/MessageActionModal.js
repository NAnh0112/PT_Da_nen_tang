import React from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢'];

export default function MessageActionModal({
  visible, isMine, canCopy, myReaction,
  onClose, onCopy, onRecall, onReact,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.sheet}>
          <View style={styles.emojiRow}>
            {EMOJIS.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => onReact(emoji)}
                style={[styles.emojiBtn, myReaction === emoji && styles.picked]}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </Pressable>
            ))}
          </View>

          {canCopy && (
            <Pressable style={styles.action} onPress={onCopy}>
              <Text style={styles.actionText}>📋 Sao chép</Text>
            </Pressable>
          )}

          {isMine && (
            <Pressable style={styles.action} onPress={onRecall}>
              <Text style={[styles.actionText, styles.danger]}>↩️ Thu hồi</Text>
            </Pressable>
          )}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: { backgroundColor: '#fff', borderRadius: 14, padding: 12 },
  emojiRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 8 },
  emojiBtn: { padding: 6, borderRadius: 20 },
  picked: { backgroundColor: '#dbeafe' },
  emoji: { fontSize: 26 },
  action: { paddingVertical: 14, borderTopWidth: 1, borderColor: '#f0f0f0' },
  actionText: { fontSize: 16 },
  danger: { color: '#dc2626' },
});