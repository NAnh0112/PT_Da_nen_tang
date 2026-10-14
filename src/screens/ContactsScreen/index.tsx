import React, { useMemo, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { users } from '../../data/mockData';
import ContactItem from '../../components/ContactItem';
import ScreenHeader from '../../components/ScreenHeader';
import SearchBar from '../../components/SearchBar';
import { styles } from './style';
import { ContactsScreenProps } from './type';
export default function ContactsScreen({ onChat }: ContactsScreenProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => users.filter(item => item.name.toLowerCase().includes(query.toLowerCase())), [query]);
  return <FlatList style={styles.container} contentContainerStyle={styles.list} data={filtered} keyExtractor={item => item.id} ListHeaderComponent={<><ScreenHeader title="Danh bạ" subtitle={`${users.length} người dùng`} /><SearchBar value={query} onChangeText={setQuery} placeholder="Tìm danh bạ" /></>} renderItem={({ item }) => <ContactItem item={item} onPress={() => onChat(item.id)} />} ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy người dùng</Text>} />;
}
