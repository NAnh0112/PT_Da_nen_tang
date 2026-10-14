import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import BottomNav from '../components/BottomNav';
import { conversations, users } from '../data/mockData';
import ContactsScreen from '../screens/ContactsScreen';
import HomeScreen from '../screens/HomeScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { RootStackParamList } from '../../App';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type MainTabsProps = { onLogout: () => void };
const styles = StyleSheet.create({ safeArea: { flex: 1 } });
export default function MainTabs({ onLogout }: MainTabsProps) {
  const [active, setActive] = useState('Home');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const openChat = (userId: string) => {
    const user = users.find(item => item.id === userId) || conversations[0];
    navigation.navigate('Chat', { user });
  };
  const screen = active === 'Home'
    ? <HomeScreen onChat={openChat} />
    : active === 'Danh bạ'
      ? <ContactsScreen onChat={openChat} />
      : active === 'Thông báo'
        ? <NotificationsScreen />
        : <SettingsScreen onLogout={onLogout} />;

  return <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>{screen}<BottomNav active={active} onSelect={setActive} /></SafeAreaView>;
}
