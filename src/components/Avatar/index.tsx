import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './style';
import { AvatarProps } from './type';
export default function Avatar({ emoji, online, size = 48 }: AvatarProps) {
  return <View style={styles.wrap}><View style={[styles.avatar, { width: size, height: size }]}><Text style={[styles.emoji, { fontSize: size / 2 }]}>{emoji}</Text></View>{online && <View style={styles.dot} />}</View>;
}
