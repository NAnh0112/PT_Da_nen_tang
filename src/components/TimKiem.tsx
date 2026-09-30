import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

export default function TimKiem() {
  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          placeholder="Tìm kiếm môn học..."
          placeholderTextColor="#98A2B3"
          style={styles.input}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#EAECF0',
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 10,
    opacity: 0.6,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#101828',
    paddingVertical: 0,
  },
});