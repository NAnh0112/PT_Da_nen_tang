import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
import { listenContacts, getMyName } from '../services/userService';
import { createGroup } from '../services/groupService';

export default function CreateGroupScreen({ navigation }) {
  const [name, setName] = useState('');
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = listenContacts(setUsers);
    return () => unsub();
  }, []);

  const toggle = (uid) => setSelected((prev) => ({ ...prev, [uid]: !prev[uid] }));
  const memberUids = Object.keys(selected).filter((uid) => selected[uid]);

  const create = async () => {
    if (!name.trim()) {
      Alert.alert('Thiếu tên nhóm', 'Hãy nhập tên nhóm.');
      return;
    }
    if (memberUids.length < 2) {
      Alert.alert('Chưa đủ thành viên', 'Chọn tối thiểu 2 người (không tính bạn).');
      return;
    }
    setSaving(true);
    try {
      const myName = await getMyName();
      const convId = await createGroup({ name: name.trim(), memberUids, myName });
      navigation.replace('Chat', { convId });
    } catch (e) {
      Alert.alert('Tạo nhóm thất bại', e.message);
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Tên nhóm" value={name} onChangeText={setName} />
      <Text style={styles.label}>Chọn thành viên từ Danh bạ:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <Pressable style={styles.item} onPress={() => toggle(item.uid)}>
            <Text style={styles.box}>{selected[item.uid] ? '☑' : '☐'}</Text>
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
        )}
      />
      <Pressable style={styles.button} onPress={create} disabled={saving}>
        <Text style={styles.buttonText}>Tạo nhóm ({memberUids.length} thành viên)</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  label: { color: '#6b7280', marginBottom: 6 },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  box: { fontSize: 22, marginRight: 12, color: '#2563eb' },
  name: { fontSize: 16 },
  button: { backgroundColor: '#2563eb', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '600' },
});