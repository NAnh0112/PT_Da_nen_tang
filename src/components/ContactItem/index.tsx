import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../Avatar';
import { styles } from './style';
import { ContactItemProps } from './type';
export default function ContactItem({ item, onPress }: ContactItemProps) {
  return <TouchableOpacity style={styles.row} onPress={onPress}><Avatar emoji={item.avatar} online={item.online} /><View style={styles.body}><Text style={styles.name}>{item.name}</Text><Text style={styles.status}>{item.online ? 'Đang trực tuyến' : 'Ngoại tuyến'}</Text></View><Text style={styles.arrow}>›</Text></TouchableOpacity>;
}
