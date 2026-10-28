import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebaseConfig';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Thiếu thông tin', 'Bạn hãy nhập email và mật khẩu.');
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (error) {
      Alert.alert('Đăng nhập thất bại', 'Email hoặc mật khẩu không đúng.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Chat realtime</Text>
      <Text style={styles.subtitle}>Đăng nhập để bắt đầu trò chuyện</Text>
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mật khẩu" secureTextEntry
        value={password} onChangeText={setPassword} />
      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng nhập</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', color: '#1e293b' },
  subtitle: { textAlign: 'center', color: '#64748b', marginTop: 8, marginBottom: 28 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe3ec', borderRadius: 8, padding: 13, marginBottom: 12 },
  button: { backgroundColor: '#228be6', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  link: { color: '#228be6', textAlign: 'center', marginTop: 18 },
});
