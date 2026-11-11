import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { listenNotifications, markNotificationsRead } from '../services/notificationService';
import { formatDateTime } from '../utils/format';

export default function NotificationsScreen({ navigation }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    const unsub = listenNotifications(setList);
    return () => unsub();
  }, []);

  const unreadIds = list.filter((n) => !n.read).map((n) => n.id);

  const markAll = () => {
    if (unreadIds.length > 0) markNotificationsRead(unreadIds);
  };

  const open = (item) => {
    if (!item.read) markNotificationsRead([item.id]);
    navigation.navigate('Chat', { convId: item.convId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.count}>{unreadIds.length} chưa đọc</Text>
        <Pressable onPress={markAll} disabled={unreadIds.length === 0}>
          <Text style={[styles.markAll, unreadIds.length === 0 && styles.disabled]}>
            Đánh dấu tất cả đã đọc
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có thông báo nào.</Text>}
        renderItem={({ item }) => (
          <Pressable
            style={[styles.item, !item.read && styles.unreadItem]}
            onPress={() => open(item)}
          >
            {/* Chấm xanh chỉ hiện với thông báo chưa đọc */}
            <View style={[styles.dot, item.read && styles.dotRead]} />
            <View style={styles.body}>
              <Text style={[styles.text, !item.read && styles.bold]}>{item.text}</Text>
              <Text style={styles.time}>{formatDateTime(item.createdAt)}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  count: { color: '#6b7280' },
  markAll: { color: '#2563eb', fontWeight: '600' },
  disabled: { color: '#9ca3af' },
  empty: { textAlign: 'center', marginTop: 40, color: '#6b7280' },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  unreadItem: { backgroundColor: '#eff6ff' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#2563eb', marginRight: 10 },
  dotRead: { backgroundColor: 'transparent' },
  body: { flex: 1 },
  text: { fontSize: 15, color: '#374151' },
  bold: { fontWeight: '700', color: '#111827' },
  time: { fontSize: 12, color: '#9ca3af', marginTop: 4 },
});