import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './style';
import { BottomNavProps } from './type';
export default function BottomNav({ active, onSelect }: BottomNavProps) {
  return <View style={styles.bar}>{[['⌂', 'Home'], ['♙', 'Danh bạ'], ['♧', 'Thông báo'], ['⚙', 'Cài đặt']].map(([icon, label]) => <TouchableOpacity style={styles.item} key={label} onPress={() => onSelect(label)}><Text style={[styles.icon, active === label && styles.active]}>{icon}</Text><Text style={[styles.label, active === label && styles.active]}>{label}</Text></TouchableOpacity>)}</View>;
}
