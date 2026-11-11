import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, StyleSheet } from 'react-native';
import { auth } from '../services/firebase';
import { logout } from '../services/authService';
import { getMyName } from '../services/userService';

export default function SettingsScreen() {
  const [name, setName] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getMyName().then(setName);
  }, []);

  const onLogout = () => {
    Alert.alert('Đăng xuất?', 'Bạn sẽ quay về màn hình đăng nhập.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            await logout();
          } catch (e) {
            setBusy(false);
            Alert.alert('Lỗi', e.message);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.email}>{auth.currentUser?.email}</Text>
      </View>

      <Pressable style={styles.logout} onPress={onLogout} disabled={busy}>
        <Text style={styles.logoutText}>{busy ? 'Đang đăng xuất...' : 'Đăng xuất'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16 },
  name: { fontSize: 18, fontWeight: '700' },
  email: { color: '#6b7280', marginTop: 4 },
  logout: { backgroundColor: '#dc2626', padding: 14, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: '600' },
});