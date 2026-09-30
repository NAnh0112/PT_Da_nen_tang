import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const stats = [
  { id: '1', so: '8', tieuDe: 'Tổng số môn học', icon: '📖', bg: '#EDF3FF', iconBg: '#3B76F6' },
  { id: '2', so: '12', tieuDe: 'Số bài tập', icon: '📋', bg: '#FFF6E9', iconBg: '#FF9400' },
  { id: '3', so: '3', tieuDe: 'Môn đã hoàn thành', icon: '✓', bg: '#EBF9F1', iconBg: '#27AE60' },
];

export default function ThongKe() {
  return (
    <View style={styles.container}>
      {stats.map(item => (
        <View key={item.id} style={[styles.card, { backgroundColor: item.bg }]}>
          <View style={[styles.iconCircle, { backgroundColor: item.iconBg }]}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
          <Text style={styles.soLuong}>{item.so}</Text>
          <Text style={styles.tieuDe}>{item.tieuDe}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
    gap: 10,
  },
  card: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    minHeight: 125,
    justifyContent: 'space-between',
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  soLuong: {
    fontSize: 22,
    fontWeight: '800',
    color: '#101828',
    marginTop: 6,
  },
  tieuDe: {
    fontSize: 11,
    fontWeight: '500',
    color: '#667085',
    lineHeight: 15,
  },
});