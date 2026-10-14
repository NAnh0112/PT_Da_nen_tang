import React, { useState } from 'react';
import { FlatList, Text } from 'react-native';
import NotificationItem from '../../components/NotificationItem';
import ScreenHeader from '../../components/ScreenHeader';
import { initialNotifications } from '../../data/mockData';
import { styles } from './style';
export default function NotificationsScreen() {
  const [items, setItems] = useState(initialNotifications);
  const markRead = (id: string) => setItems(current => current.map(item => item.id === id ? { ...item, read: true } : item));
  return <FlatList style={styles.container} contentContainerStyle={styles.list} data={items} keyExtractor={item => item.id} ListHeaderComponent={<ScreenHeader title="Thông báo" subtitle="Cập nhật mới nhất dành cho bạn" />} renderItem={({ item }) => <NotificationItem item={item} onRead={() => markRead(item.id)} />} ListEmptyComponent={<Text style={styles.empty}>Chưa có thông báo</Text>} />;
}
