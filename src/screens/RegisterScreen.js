import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { register, authErrorMessage } from '../services/authService';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onRegister = async () => {
    let msg = '';
    if (!name.trim() || !email.trim() || !password) msg = 'Vui lòng nhập đầy đủ thông tin';
    else if (password.length < 6) msg = 'Mật khẩu phải có ít nhất 6 ký tự';
    else if (password !== confirm) msg = 'Mật khẩu nhập lại không khớp';
    if (msg) {
      setError(msg);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e) {
      setError(authErrorMessage(e));
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Họ và tên" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mật khẩu (tối thiểu 6 ký tự)" secureTextEntry
        value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Nhập lại mật khẩu" secureTextEntry
        value={confirm} onChangeText={setConfirm} />
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={onRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Đang tạo tài khoản...' : 'Đăng ký'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  error: { color: '#dc2626', marginBottom: 10 },
});