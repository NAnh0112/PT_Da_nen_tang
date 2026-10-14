import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../Avatar';
import { styles } from './style';
import { ConversationItemProps } from './type';
export default function ConversationItem({ item, onPress }: ConversationItemProps) {
  return <TouchableOpacity style={styles.row} onPress={onPress}><Avatar emoji={item.avatar} online={item.online} /><View style={styles.body}><View style={styles.top}><Text style={styles.name}>{item.name}</Text><Text style={styles.time}>{item.time}</Text></View><View style={styles.top}><Text style={styles.message} numberOfLines={1}>{item.message}</Text>{item.unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{item.unread}</Text></View>}</View></View></TouchableOpacity>;
}
