import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const tabs = [
  { id: 'home', label: 'Trang chủ', icon: '🏠' },
  { id: 'courses', label: 'Môn học', icon: '📖' },
  { id: 'assignments', label: 'Bài tập', icon: '📝' },
  { id: 'profile', label: 'Cá nhân', icon: '👤' },
];

export default function BottomTab() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <View style={styles.container}>
      {tabs.map(item => {
        const isActive = activeTab === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={styles.tabItem}
            activeOpacity={0.7}
            onPress={() => setActiveTab(item.id)}
          >
            <Text style={[styles.tabIcon, isActive && styles.activeIcon]}>
              {item.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
            {isActive && <View style={styles.activeDot} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#EBECF0',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 6,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabIcon: {
    fontSize: 20,
    color: '#7A869A',
  },
  activeIcon: {
    color: '#0052CC',
  },
  tabLabel: {
    fontSize: 11,
    color: '#7A869A',
    marginTop: 2,
  },
  activeLabel: {
    color: '#0052CC',
    fontWeight: '700',
  },
  activeDot: {
    width: 14,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#0052CC',
    marginTop: 3,
  },
});