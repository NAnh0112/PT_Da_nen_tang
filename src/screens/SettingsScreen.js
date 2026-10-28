import React from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';
import { setOffline } from '../services/chatService';

export default function SettingsScreen() {
  const handleLogout = async () => {
    try {
      if (auth.currentUser) await setOffline(auth.currentUser.uid);
      await signOut(auth);
    } catch (error) {
      Alert.alert('Không thể đăng xuất', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.email}>Tài khoản: {auth.currentUser?.email}</Text>
      <Pressable style={styles.button} onPress={handleLogout}><Text style={styles.buttonText}>Đăng xuất</Text></Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: 20 },
  email: { color: '#334155', fontSize: 16, marginBottom: 20 },
  button: { backgroundColor: '#dc2626', borderRadius: 8, paddingVertical: 13, paddingHorizontal: 28 },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
