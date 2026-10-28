import React, { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import { auth } from '../services/firebaseConfig';
import { listenToUsers } from '../services/chatService';

const avatar = 'https://ui-avatars.com/api/?background=228be6&color=fff&name=User';

export default function ContactsScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const currentUid = auth.currentUser.uid;

  useEffect(() => {
    const unsubscribe = listenToUsers(list => setUsers(list.filter(user => user.uid !== currentUid)));
    return unsubscribe;
  }, [currentUid]);

  const visibleUsers = users.filter(user =>
    (user.name || '').toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput style={styles.search} placeholder="Tìm theo tên..." value={query} onChangeText={setQuery} />
      <FlatList
        data={visibleUsers}
        keyExtractor={item => item.uid}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('Chat', { receiver: item })}>
            <View>
              <Image source={{ uri: item.avatar || avatar }} style={styles.avatar} />
              <View style={[styles.dot, item.status === 'online' ? styles.online : styles.offline]} />
            </View>
            <View><Text style={styles.name}>{item.name}</Text><Text style={styles.status}>{item.status === 'online' ? 'Đang online' : 'Offline'}</Text></View>
          </Pressable>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Chưa tìm thấy người dùng.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 12 },
  search: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dbe3ec', borderRadius: 8, padding: 12, marginBottom: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8 },
  avatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  dot: { position: 'absolute', right: 10, bottom: 1, width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: '#fff' },
  online: { backgroundColor: '#22c55e' }, offline: { backgroundColor: '#94a3b8' },
  name: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  status: { color: '#64748b', marginTop: 3 },
  empty: { textAlign: 'center', color: '#64748b', marginTop: 30 },
});
