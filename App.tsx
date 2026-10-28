import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './src/services/firebaseConfig';
import { watchPresence } from './src/services/chatService';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ContactsScreen from './src/screens/ContactsScreen';
import ChatScreen from './src/screens/ChatScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

type RootStackParamList = {
  MainTabs: undefined;
  Chat: { receiver: { uid: string; name: string; avatar?: string } };
  Login: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: '#228be6' }}>
      <Tab.Screen name="Chats" component={HomeScreen} options={{ title: 'Trò chuyện', headerShown: false }} />
      <Tab.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Danh bạ' }} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} options={{ title: 'Thông báo' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let stopPresence = () => {};
    const subscriber = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
      stopPresence();
      if (usr) stopPresence = watchPresence(usr.uid);
      if (initializing) setInitializing(false);
    });
    return () => {
      subscriber();
      stopPresence();
    };
  }, [initializing]);

  if (initializing) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerStyle: { backgroundColor: '#228be6' }, headerTintColor: '#fff' }}>
        {user ? (
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatScreen} options={({ route }) => ({ title: route.params.receiver.name })} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng ký tài khoản' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}