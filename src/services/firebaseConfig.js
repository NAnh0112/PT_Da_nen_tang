import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA1M2ajbTwecTZ0aXiPrO43_BBSlTRb2eM',
  authDomain: 'chat-1-d837d.firebaseapp.com',
  databaseURL: 'https://chat-1-d837d-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'chat-1-d837d',
  storageBucket: 'chat-1-d837d.firebasestorage.app',
  messagingSenderId: '233115622764',
  appId: '1:233115622764:web:b12245861d24e54c09e749',
};

const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

const database = getDatabase(app);

export { auth, database };