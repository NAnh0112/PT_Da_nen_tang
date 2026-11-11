import React from 'react';
import { View, Text, Image, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { formatTime } from '../utils/format';

export default function MessageBubble({
  msg, isMine, showName, statusText,
  onLongPress, onPressImage, onPressLocation, onRetry,
}) {
  const counts = {};
  Object.values(msg.reactions || {}).forEach((emoji) => {
    counts[emoji] = (counts[emoji] || 0) + 1;
  });

  const uploading = msg.status === 'uploading';
  const failed = msg.status === 'error';
  const color = isMine ? '#fff' : '#111';

  return (
    <View style={[styles.row, isMine ? styles.right : styles.left]}>
      {showName && <Text style={styles.name}>{msg.senderName}</Text>}

      <Pressable
        onLongPress={onLongPress}
        delayLongPress={350}
        style={[styles.bubble, isMine ? styles.mine : styles.theirs]}
      >
        {msg.recalled ? (
          <Text style={styles.recalled}>Tin nhắn đã được thu hồi</Text>
        ) : msg.type === 'image' ? (
          <Pressable onPress={() => onPressImage(msg.imageUrl)} disabled={uploading || failed}>
            <Image source={{ uri: msg.imageUrl || msg.localUri }} style={styles.image} />
            {uploading && (
              <View style={styles.overlay}>
                <ActivityIndicator color="#fff" />
              </View>
            )}
            {failed && (
              <Pressable onPress={onRetry} style={styles.overlay}>
                <Text style={styles.retry}>⚠️ Tải lên lỗi · Thử lại</Text>
              </Pressable>
            )}
          </Pressable>
        ) : msg.type === 'location' ? (
          <Pressable onPress={onPressLocation}>
            <Text style={[styles.text, { color }]}>📍 Vị trí</Text>
            <Text style={[styles.link, { color }]}>Mở trên Google Maps</Text>
          </Pressable>
        ) : (
          <Text style={[styles.text, { color }]}>{msg.text}</Text>
        )}

        <Text style={[styles.time, { color: isMine ? '#dbeafe' : '#6b7280' }]}>
          {formatTime(msg.createdAt)}
        </Text>
      </Pressable>

      {Object.keys(counts).length > 0 && (
        <View style={styles.reactions}>
          {Object.entries(counts).map(([emoji, n]) => (
            <Text key={emoji} style={styles.chip}>
              {emoji}{n > 1 ? ` ${n}` : ''}
            </Text>
          ))}
        </View>
      )}

      {!!statusText && <Text style={styles.status}>{statusText}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { marginVertical: 4, maxWidth: '80%' },
  left: { alignSelf: 'flex-start' },
  right: { alignSelf: 'flex-end', alignItems: 'flex-end' },
  name: { fontSize: 12, color: '#6b7280', marginLeft: 8, marginBottom: 2 },
  bubble: { padding: 10, borderRadius: 14 },
  mine: { backgroundColor: '#2563eb' },
  theirs: { backgroundColor: '#e5e7eb' },
  text: { fontSize: 15 },
  recalled: { fontStyle: 'italic', color: '#6b7280' },
  image: { width: 200, height: 200, borderRadius: 10 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retry: { color: '#fff', fontWeight: '600' },
  link: { textDecorationLine: 'underline', marginTop: 2 },
  time: { fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  reactions: { flexDirection: 'row', gap: 4, marginTop: -8, marginLeft: 6 },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    fontSize: 12,
  },
  status: { fontSize: 11, color: '#6b7280', marginTop: 2 },
});