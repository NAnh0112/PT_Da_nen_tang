import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { auth } from '../services/firebase';
import { listenContacts, getMyName } from '../services/userService';
import { openDirectChat } from '../services/chatService';
import { timeAgo } from '../utils/format';

export default function ContactsScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const unsub = listenContacts(setUsers);
    return () => unsub();
  }, []);

  const shown = users.filter((u) =>
    (u.name || '').toLowerCase().includes(keyword.trim().toLowerCase()),
  );

  // Nhấn một người: mở (hoặc tạo) chat 1-1
  const chatWith = async (user) => {
    try {
      const myName = await getMyName();
      const convId = await openDirectChat(auth.currentUser.uid, myName, user);
      navigation.navigate('Chat', { convId });
    } catch (e) {
      Alert.alert('Không mở được cuộc trò chuyện', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.groupBtn} onPress={() => navigation.navigate('CreateGroup')}>
        <Text style={styles.groupText}>👥 Tạo nhóm mới</Text>
      </Pressable>
      <TextInput style={styles.search} placeholder="Tìm kiếm..." value={keyword} onChangeText={setKeyword} />
      <FlatList
        data={shown}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => chatWith(item)}>
            <View style={[styles.dot, { backgroundColor: item.online ? '#22c55e' : '#9ca3af' }]} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.sub}>{item.online ? 'Đang hoạt động' : timeAgo(item.lastSeen)}</Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  groupBtn: { margin: 12, padding: 12, borderRadius: 8, backgroundColor: '#eff6ff', alignItems: 'center' },
  groupText: { color: '#1d4ed8', fontWeight: '600' },
  search: { marginHorizontal: 12, marginBottom: 8, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 12 },
  name: { fontSize: 16, fontWeight: '600' },
  sub: { fontSize: 12, color: '#6b7280', marginTop: 2 },
});