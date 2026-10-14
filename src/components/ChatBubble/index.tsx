import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './style';
import { ChatBubbleProps } from './type';
export default function ChatBubble({ text, time, mine }: ChatBubbleProps) {
  return <View style={[styles.row, mine && styles.mine]}><View style={[styles.bubble, mine && styles.myBubble]}><Text style={[styles.text, mine && styles.myText]}>{text}</Text><Text style={[styles.time, mine && styles.myTime]}>{time}</Text></View></View>;
}
