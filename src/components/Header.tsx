import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

export default function Header() {
  return (
    <View style={styles.container}>
      <View style={styles.leftRow}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200' }}
          style={styles.avatar}
        />
        <View style={styles.infoWrapper}>
          <Text style={styles.greeting}>Xin chào,</Text>
          <Text style={styles.name}>Nguyễn Phương Anh</Text>
          <Text style={styles.role}>Sinh viên năm 3 - CNTT</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.bellButton} activeOpacity={0.7}>
        <Text style={styles.bellIcon}>🔔</Text>
        <View style={styles.badge} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: 14,
  },
  infoWrapper: {
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 13,
    color: '#8C96A8',
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#101828',
    marginTop: 2,
  },
  role: {
    fontSize: 12,
    color: '#667085',
    marginTop: 2,
  },
  bellButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  bellIcon: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});