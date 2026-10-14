import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './style';
import { ScreenHeaderProps } from './type';
export default function ScreenHeader({ title, subtitle }: ScreenHeaderProps) {
  return <View style={styles.wrap}><Text style={styles.title}>{title}</Text>{subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}</View>;
}
