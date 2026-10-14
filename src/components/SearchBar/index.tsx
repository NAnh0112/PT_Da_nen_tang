import React from 'react';
import { TextInput } from 'react-native';
import { styles } from './style';
import { SearchBarProps } from './type';
export default function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  return <TextInput style={styles.box} value={value} onChangeText={onChangeText} placeholder={`⌕  ${placeholder}`} placeholderTextColor="#9AA7BC" />;
}
