import React, { useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../../components/Avatar';
import ChatBubble from '../../components/ChatBubble';
import { styles } from './style';
import { ChatScreenProps } from './type';
export default function ChatScreen({ route }: ChatScreenProps) {
  const navigation = useNavigation(); const { user } = route.params; const [text, setText] = useState('');
  const [messages, setMessages] = useState([{ text: 'Chào bạn, hôm nay thế nào?', time: '09:20', mine: false }, { text: 'Mình khỏe, cảm ơn bạn! Còn bạn?', time: '09:21', mine: true }, { text: 'Mình cũng rất ổn 😊', time: '09:24', mine: false }]);
  const send = () => { if (!text.trim()) return; setMessages(current => [...current, { text: text.trim(), time: 'Bây giờ', mine: true }]); setText(''); };
  return <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}><View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.back}>‹</Text></TouchableOpacity><Avatar emoji={user.avatar} online={user.online} size={40} /><View style={styles.headerUser}><Text style={styles.name}>{user.name}</Text><Text style={styles.status}>{user.online ? 'Đang trực tuyến' : 'Ngoại tuyến'}</Text></View></View><FlatList style={styles.messages} data={messages} keyExtractor={(_, index) => String(index)} renderItem={({ item }) => <ChatBubble {...item} />} /><View style={styles.composer}><TextInput style={styles.input} value={text} onChangeText={setText} placeholder="Nhập tin nhắn..." placeholderTextColor="#9AA7BC" onSubmitEditing={send} /><TouchableOpacity style={styles.send} onPress={send}><Text style={styles.sendText}>➤</Text></TouchableOpacity></View></SafeAreaView>;
}
