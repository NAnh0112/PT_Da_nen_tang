import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { listenToConversations, markConversationRead } from '../services/chatService';

const avatar = 'https://ui-avatars.com/api/?background=228be6&color=fff&name=User';

export default function HomeScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const uid = auth.currentUser.uid;

  useEffect(() => {
    const unsubscribe = listenToConversations(uid, setConversations);
    return unsubscribe;
  }, [uid]);

  const openConversation = item => {
    markConversationRead(uid, item.partnerId);
    navigation.navigate('Chat', {
      receiver: { uid: item.partnerId, name: item.partnerName, avatar: item.partnerAvatar },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Đoạn chat</Text>
      <FlatList
        data={conversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => openConversation(item)}>
            <Image source={{ uri: item.partnerAvatar || avatar }} style={styles.avatar} />
            <View style={styles.info}>
              <View style={styles.top}><Text style={styles.name}>{item.partnerName}</Text><Text style={styles.time}>{item.timestamp ? new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : ''}</Text></View>
              <View style={styles.bottom}><Text numberOfLines={1} style={[styles.last, item.unreadCount > 0 && styles.bold]}>{item.lastMessage || 'Bắt đầu trò chuyện'}</Text>{item.unreadCount > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{item.unreadCount}</Text></View>}</View>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Chưa có cuộc trò chuyện nào. Hãy mở Danh bạ để nhắn tin.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 12, borderRadius: 10, marginBottom: 8 },
  avatar: { width: 52, height: 52, borderRadius: 26, marginRight: 12 },
  info: { flex: 1, justifyContent: 'center' },
  top: { flexDirection: 'row', justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  time: { fontSize: 12, color: '#94a3b8' },
  bottom: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  last: { flex: 1, color: '#64748b' },
  bold: { color: '#1e293b', fontWeight: '700' },
  badge: { backgroundColor: '#228be6', minWidth: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginLeft: 8 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  empty: { textAlign: 'center', color: '#64748b', marginTop: 30, lineHeight: 22 },
});
