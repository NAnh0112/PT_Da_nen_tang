import React, { useMemo, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { conversations } from '../../data/mockData';
import ConversationItem from '../../components/ConversationItem';
import ScreenHeader from '../../components/ScreenHeader';
import SearchBar from '../../components/SearchBar';
import { styles } from './style';
import { HomeScreenProps } from './type';
export default function HomeScreen({ onChat }: HomeScreenProps) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => conversations.filter(item => item.name.toLowerCase().includes(query.toLowerCase())), [query]);
  return <FlatList style={styles.container} contentContainerStyle={styles.list} data={filtered} keyExtractor={item => item.id} ListHeaderComponent={<><ScreenHeader title="Tin nhắn" subtitle="Các cuộc trò chuyện gần đây" /><SearchBar value={query} onChangeText={setQuery} placeholder="Tìm cuộc trò chuyện" /></>} renderItem={({ item }) => <ConversationItem item={item} onPress={() => onChat(item.id)} />} ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy cuộc trò chuyện</Text>} />;
}
