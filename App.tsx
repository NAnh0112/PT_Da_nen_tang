import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Platform,
} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8F9FE',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 0,
  },
});