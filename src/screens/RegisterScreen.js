import React, { useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { auth, database } from '../services/firebaseConfig';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Thiếu thông tin', 'Bạn hãy điền đủ các trường.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Mật khẩu chưa hợp lệ', 'Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Mật khẩu chưa khớp', 'Hai lần nhập mật khẩu phải giống nhau.');
      return;
    }
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(user, { displayName: name.trim() });
      await set(ref(database, `users/${user.uid}`), {
        uid: user.uid, name: name.trim(), email: email.trim(), status: 'online', avatar: '',
      });
      Alert.alert('Thành công', 'Tài khoản đã được tạo.');
    } catch (error) {
      const message = error.code === 'auth/email-already-in-use'
        ? 'Email này đã được đăng ký.'
        : 'Không thể đăng ký. Hãy kiểm tra lại thông tin.';
      Alert.alert('Đăng ký thất bại', message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản</Text>
      <TextInput style={styles.input} placeholder="Họ và tên" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" autoCapitalize="none"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Mật khẩu (ít nhất 6 ký tự)"
        secureTextEntry value={password} onChangeText={setPassword} />
      <TextInput style={styles.input} placeholder="Nhập lại mật khẩu"
        secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} />
      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Đăng ký</Text>
      </Pressable>
      <Pressable onPress={() => navigation.goBack()}>
        <Text style={styles.link}>Đã có tài khoản? Đăng nhập</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f8fafc' },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 24, color: '#1e293b' },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe3ec', borderRadius: 8, padding: 13, marginBottom: 12 },
  button: { backgroundColor: '#228be6', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { color: '#228be6', textAlign: 'center', marginTop: 18 },
});
