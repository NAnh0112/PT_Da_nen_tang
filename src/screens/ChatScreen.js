import React, { useEffect, useRef, useState } from 'react';
import {
  Alert, FlatList, Linking, PermissionsAndroid, Platform, Pressable,
  SafeAreaView, StyleSheet, Text, TextInput, View,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { auth } from '../services/firebaseConfig';
import {
  listenToMessages, makeChatId, markConversationRead,
  sendLocationMessage, sendTextMessage,
  listenToUsers,
} from '../services/chatService';

const formatTime = timestamp => timestamp
  ? new Date(timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  : '';

export default function ChatScreen({ route, navigation }) {
  const { receiver } = route.params;
  const senderId = auth.currentUser.uid;
  const chatId = makeChatId(senderId, receiver.uid);
  const [messages, setMessages] = useState([]);
  const [receiverOnline, setReceiverOnline] = useState(receiver.status === 'online');
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      title: `${receiver.name} · ${receiverOnline ? 'online' : 'offline'}`,
      headerBackTitle: 'Quay lại',
    });
    const unsubscribe = listenToMessages(chatId, setMessages);
    markConversationRead(senderId, receiver.uid);
    return unsubscribe;
  }, [chatId, navigation, receiver.name, receiver.uid, receiverOnline, senderId]);

  useEffect(() => {
    const unsubscribe = listenToUsers(users => {
      const currentReceiver = users.find(user => user.uid === receiver.uid);
      setReceiverOnline(currentReceiver?.status === 'online');
    });
    return unsubscribe;
  }, [receiver.uid]);

  const handleSend = async () => {
    const cleanText = text.trim();
    if (!cleanText) return;
    try {
      await sendTextMessage(receiver, cleanText);
      setText('');
    } catch (error) {
      Alert.alert('Không thể gửi', error.message);
    }
  };

  const handleSendLocation = async () => {
    if (Platform.OS === 'android') {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        { title: 'Quyền vị trí', message: 'Cho phép ứng dụng gửi vị trí hiện tại của bạn?' },
      );
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert('Chưa được cấp quyền', 'Bạn cần cho phép vị trí để gửi tin này.');
        return;
      }
    }
    Geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await sendLocationMessage(receiver, coords.latitude, coords.longitude);
        } catch (error) {
          Alert.alert('Không thể gửi', error.message);
        }
      },
      () => Alert.alert('Không lấy được vị trí', 'Hãy bật GPS và cấp quyền vị trí cho ứng dụng.'),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const mine = item.senderId === senderId;
          return (
            <View style={[styles.row, mine ? styles.myRow : styles.otherRow]}>
              <View style={[styles.bubble, mine ? styles.myBubble : styles.otherBubble]}>
                {item.type === 'location' ? (
                  <Pressable onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`)}>
                    <Text style={styles.locationText}>📍 Vị trí hiện tại</Text>
                    <Text style={styles.mapHint}>Chạm để mở Google Maps</Text>
                  </Pressable>
                ) : <Text style={mine ? styles.myText : styles.otherText}>{item.text}</Text>}
                <Text style={mine ? styles.myTime : styles.otherTime}>{formatTime(item.timestamp)}</Text>
              </View>
            </View>
          );
        }}
      />
      <View style={styles.composer}>
        <Pressable onPress={handleSendLocation} style={styles.locationButton}><Text style={styles.pin}>📍</Text></Pressable>
        <TextInput style={styles.input} placeholder="Nhập tin nhắn..." value={text}
          onChangeText={setText} onSubmitEditing={handleSend} returnKeyType="send" />
        <Pressable onPress={handleSend} style={styles.sendButton}><Text style={styles.sendText}>Gửi</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  messageList: { padding: 12, paddingBottom: 8 },
  row: { flexDirection: 'row', marginVertical: 4 },
  myRow: { justifyContent: 'flex-end' },
  otherRow: { justifyContent: 'flex-start' },
  bubble: { maxWidth: '78%', padding: 10, borderRadius: 14 },
  myBubble: { backgroundColor: '#228be6', borderBottomRightRadius: 3 },
  otherBubble: { backgroundColor: '#e2e8f0', borderBottomLeftRadius: 3 },
  myText: { color: '#fff', fontSize: 15 },
  otherText: { color: '#1e293b', fontSize: 15 },
  myTime: { color: '#dbeafe', fontSize: 10, textAlign: 'right', marginTop: 4 },
  otherTime: { color: '#64748b', fontSize: 10, textAlign: 'right', marginTop: 4 },
  locationText: { color: '#fff', fontWeight: '600' },
  mapHint: { color: '#dbeafe', fontSize: 11, marginTop: 3 },
  composer: { flexDirection: 'row', alignItems: 'center', padding: 8, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' },
  locationButton: { padding: 7 },
  pin: { fontSize: 21 },
  input: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 20, paddingHorizontal: 14, height: 42 },
  sendButton: { backgroundColor: '#228be6', borderRadius: 20, paddingHorizontal: 15, paddingVertical: 11, marginLeft: 7 },
  sendText: { color: '#fff', fontWeight: '700' },
});
