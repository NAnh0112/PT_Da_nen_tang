import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styles } from './style';
import { LoginScreenProps } from './type';
export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [account, setAccount] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState('');
  const submit = () => { if (!account.trim() || !password.trim()) { setError('Vui lòng nhập đầy đủ tài khoản và mật khẩu'); return; } setError(''); onLogin(); };
  return <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}><View><View style={styles.logo}><View style={styles.logoIcon}><Text style={styles.logoText}>C</Text></View><Text style={styles.title}>ChatConnect</Text><Text style={styles.subtitle}>Kết nối với mọi người</Text></View><Text style={styles.label}>Tài khoản</Text><TextInput style={styles.input} value={account} onChangeText={setAccount} placeholder="Nhập tài khoản" placeholderTextColor="#A7B1C2" autoCapitalize="none" /><Text style={styles.label}>Mật khẩu</Text><TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="Nhập mật khẩu" placeholderTextColor="#A7B1C2" secureTextEntry /><TouchableOpacity style={styles.button} onPress={submit}><Text style={styles.buttonText}>Đăng nhập</Text></TouchableOpacity>{!!error && <Text style={styles.error}>{error}</Text>}</View></SafeAreaView>;
}
