import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { listenUserChats } from '../services/chatService';
import { previewOf, formatTime } from '../utils/format';

export default function HomeScreen({ navigation }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsub = listenUserChats(setChats);
    return () => unsub();
  }, []);

  return (
    <FlatList
      style={styles.container}
      data={chats}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <Text style={styles.empty}>Chưa có cuộc trò chuyện nào. Vào Danh bạ để bắt đầu.</Text>
      }
      renderItem={({ item }) => (
        <Pressable style={styles.item} onPress={() => navigation.navigate('Chat', { convId: item.id })}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.type === 'group' ? '👥' : (item.title || '?')[0]}
            </Text>
          </View>
          <View style={styles.middle}>
            <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.last} numberOfLines={1}>
              {previewOf(item.lastType, item.lastMessage)}
            </Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.time}>{formatTime(item.updatedAt)}</Text>
            {item.unread > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.unread}</Text>
              </View>
            )}
          </View>
        </Pressable>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  empty: { textAlign: 'center', marginTop: 40, color: '#6b7280', padding: 20 },
  item: { flexDirection: 'row', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#dbeafe', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#1d4ed8' },
  middle: { flex: 1 },
  title: { fontSize: 16, fontWeight: '600' },
  last: { color: '#6b7280', marginTop: 2 },
  right: { alignItems: 'flex-end', marginLeft: 8 },
  time: { fontSize: 12, color: '#9ca3af' },
  badge: { backgroundColor: '#ef4444', borderRadius: 10, minWidth: 20, paddingHorizontal: 6, marginTop: 4, alignItems: 'center' },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});