import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './style';
import { NotificationItemProps } from './type';
export default function NotificationItem({ item, onRead }: NotificationItemProps) {
  return <View style={[styles.row, !item.read && styles.unread]}><View style={styles.icon}><Text style={styles.iconText}>{item.title === 'Hệ thống' ? '⚙' : '●'}</Text></View><View style={styles.body}><Text style={styles.title}>{item.title}</Text><Text style={styles.message}>{item.message}</Text><Text style={styles.time}>{item.time}</Text>{!item.read && <TouchableOpacity onPress={onRead}><Text style={styles.button}>Đánh dấu đã đọc</Text></TouchableOpacity>}</View></View>;
}
