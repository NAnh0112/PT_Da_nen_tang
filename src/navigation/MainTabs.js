import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ContactsScreen from '../screens/ContactsScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { listenNotifications } from '../services/notificationService';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    const unsub = listenNotifications((list) => {
      setUnread(list.filter((n) => !n.read).length);
    });
    return () => unsub();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Trò chuyện' }} />
      <Tab.Screen name="Contacts" component={ContactsScreen} options={{ title: 'Danh bạ' }} />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Thông báo', tabBarBadge: unread > 0 ? unread : undefined }}
      />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Cài đặt' }} />
    </Tab.Navigator>
  );
}