import React, { useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

const initialNotifications = [
  { id: '1', content: 'Bạn có thể tìm bạn bè trong tab Danh bạ.', time: 'Hôm nay', read: false },
  { id: '2', content: 'Tin nhắn mới sẽ xuất hiện ngay trên màn hình Home.', time: 'Hôm qua', read: true },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAsRead = id => setNotifications(items =>
    items.map(item => item.id === id ? { ...item, read: true } : item),
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable onPress={() => markAsRead(item.id)} style={[styles.card, !item.read && styles.unread]}>
            <View style={styles.row}>
              <Text style={styles.content}>{item.content}</Text>
              {!item.read && <View style={styles.dot} />}
            </View>
            <Text style={styles.time}>{item.time} · {item.read ? 'Đã đọc' : 'Chưa đọc'}</Text>
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 12 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#e2e8f0' },
  unread: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  row: { flexDirection: 'row', alignItems: 'center' },
  content: { flex: 1, color: '#1e293b', fontSize: 15, lineHeight: 21 },
  dot: { width: 9, height: 9, borderRadius: 5, backgroundColor: '#228be6', marginLeft: 8 },
  time: { color: '#64748b', fontSize: 12, marginTop: 7 },
});
