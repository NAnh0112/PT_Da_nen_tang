import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  View, Text, TextInput, FlatList, Pressable, Modal, Image, ActivityIndicator,
  Alert, Linking, KeyboardAvoidingView, Platform, StyleSheet,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { auth } from '../services/firebase';
import * as chat from '../services/chatService';
import { listenUser, getMyName } from '../services/userService';
import { listenOnlineCount } from '../services/groupService';
import { pickImage, uploadImage } from '../services/uploadService';
import { getCurrentLocation } from '../services/locationService';
import MessageBubble from '../components/MessageBubble';
import MessageActionModal from '../components/MessageActionModal';
import { formatTime, timeAgo } from '../utils/format';

export default function ChatScreen({ route, navigation }) {
  const { convId } = route.params;
  const myUid = auth.currentUser.uid;

  const [conv, setConv] = useState(null);            
  const [partner, setPartner] = useState(null);      
  const [onlineCount, setOnlineCount] = useState(0); 
  const [latest, setLatest] = useState({});          
  const [older, setOlder] = useState({});            
  const [pending, setPending] = useState([]);        
  const [typers, setTypers] = useState([]);          
  const [readStatus, setReadStatus] = useState({});  
  const [myName, setMyName] = useState('');
  const [text, setText] = useState('');
  const [menuMsg, setMenuMsg] = useState(null);      
  const [viewerUrl, setViewerUrl] = useState(null);  
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [, setTick] = useState(0);                  
  const typingTimer = useRef(null);
  const isTyping = useRef(false);

  const memberList = conv ? Object.keys(conv.members) : [];
  const isGroup = conv?.type === 'group';

  useEffect(() => {
    getMyName().then(setMyName);
    chat.setActiveConv(convId);

    const unsubs = [
      chat.listenConversation(convId, setConv),
      chat.listenLatestMessages(convId, setLatest),
      chat.listenTyping(convId, setTypers),
      chat.listenReadStatus(convId, setReadStatus),
    ];

    return () => {
      unsubs.forEach((u) => u());
      clearTimeout(typingTimer.current);
      chat.setTyping(convId, false);
      chat.setActiveConv(null);
    };
  }, [convId]);

  useEffect(() => {
    if (!conv) return;
    if (isGroup) {
      return listenOnlineCount(Object.keys(conv.members), setOnlineCount);
    }
    const partnerUid = Object.keys(conv.members).find((u) => u !== myUid);
    return listenUser(partnerUid, setPartner);
  }, [conv, isGroup, myUid]);

  const sortedLatest = useMemo(
    () => Object.values(latest).sort((a, b) => (a.id < b.id ? -1 : 1)),
    [latest],
  );
  const newestKey = sortedLatest.length ? sortedLatest[sortedLatest.length - 1].id : '';

  useEffect(() => {
    chat.markAsRead(convId);
  }, [convId, newestKey]);

  useEffect(() => {
    const timer = setInterval(() => setTick((n) => n + 1), 30000);
    return () => clearInterval(timer);
  }, []);

  const typingNow = typers.some((u) => u !== myUid);
  const title = isGroup ? conv.name : partner?.name || '';
  let subtitle = '';
  if (typingNow) subtitle = 'đang soạn tin…';
  else if (isGroup) subtitle = `${memberList.length} thành viên · ${onlineCount} đang online`;
  else if (partner) subtitle = partner.online ? 'Đang hoạt động' : timeAgo(partner.lastSeen);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
          <Text style={styles.headerSub}>{subtitle}</Text>
        </View>
      ),
    });
  }, [navigation, title, subtitle]);

  const lastMine = [...sortedLatest]
    .reverse()
    .find((m) => m.senderId === myUid && !m.recalled);

  let statusText = '';
  if (lastMine) {
    const seenTimes = memberList
      .filter((u) => u !== myUid)
      .map((u) => readStatus[u])
      .filter((t) => t && t >= lastMine.createdAt);

    if (seenTimes.length === 0) statusText = 'Đã gửi';
    else if (isGroup) statusText = `Đã xem bởi ${seenTimes.length} người`;
    else statusText = `Đã xem ${formatTime(Math.max(...seenTimes))}`;
  }

  const messageList = useMemo(
    () => Object.values({ ...older, ...latest }).sort((a, b) => (a.id < b.id ? -1 : 1)),
    [older, latest],
  );

  const data = [...pending].reverse().concat(messageList.slice().reverse());

  const loadOlder = async () => {
    if (loadingOlder || noMore || messageList.length === 0) return;
    setLoadingOlder(true);
    try {
      const oldestKey = messageList[0].id;
      const more = await chat.loadOlderMessages(convId, oldestKey);
      if (Object.keys(more).length === 0) setNoMore(true);
      setOlder((prev) => ({ ...more, ...prev }));
    } finally {
      setLoadingOlder(false);
    }
  };

  const stopTyping = () => {
    clearTimeout(typingTimer.current);
    if (isTyping.current) {
      isTyping.current = false;
      chat.setTyping(convId, false);
    }
  };

  const onChangeText = (value) => {
    setText(value);
    if (!isTyping.current) {
      isTyping.current = true;
      chat.setTyping(convId, true);
    }
    clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(stopTyping, 3000);
  };

  const send = (payload) =>
    chat.sendMessage({
      convId,
      members: memberList,
      senderId: myUid,
      senderName: myName,
      ...payload,
    });

  const sendText = async () => {
    const content = text.trim();
    if (!content || !conv) return; 
    setText('');
    stopTyping(); 
    try {
      await send({ type: 'text', text: content });
    } catch (e) {
      setText(content);
      Alert.alert('Gửi thất bại', e.message);
    }
  };

  const sendLocation = async () => {
    try {
      const { lat, lng } = await getCurrentLocation();
      await send({ type: 'location', lat, lng });
    } catch (e) {
      Alert.alert(
        'Không gửi được vị trí',
        e.message === 'LOCATION_DENIED'
          ? 'Bạn đã từ chối quyền vị trí.'
          : 'Hãy bật GPS và thử lại.',
      );
    }
  };

  const chooseImage = () => {
    Alert.alert('Gửi ảnh', 'Chọn nguồn ảnh', [
      { text: '📷 Chụp ảnh', onPress: () => startImage('camera') },
      { text: '🖼️ Thư viện', onPress: () => startImage('library') },
      { text: 'Hủy', style: 'cancel' },
    ]);
  };

  const startImage = async (source) => {
    let asset;
    try {
      asset = await pickImage(source);
    } catch (e) {
      Alert.alert(
        'Không thể chọn ảnh',
        e.message === 'CAMERA_DENIED' ? 'Bạn đã từ chối quyền camera.' : e.message,
      );
      return;
    }
    if (!asset) return; 

    const item = {
      id: `local_${Date.now()}`,
      senderId: myUid,
      senderName: myName,
      type: 'image',
      localUri: asset.uri,
      asset,
      status: 'uploading',
      createdAt: Date.now(),
    };
    setPending((p) => [...p, item]);
    uploadPending(item);
  };

  const uploadPending = async (item) => {
    setPending((p) =>
      p.map((x) => (x.id === item.id ? { ...x, status: 'uploading' } : x)),
    );
    try {
      const url = await uploadImage(item.asset);
      await send({ type: 'image', imageUrl: url });
      setPending((p) => p.filter((x) => x.id !== item.id));
    } catch (e) {
      setPending((p) =>
        p.map((x) => (x.id === item.id ? { ...x, status: 'error' } : x)),
      );
    }
  };

  const closeMenu = () => setMenuMsg(null);

  const copyMsg = () => {
    Clipboard.setString(menuMsg.text);
    closeMenu();
  };

  const recallMsg = () => {
    const msg = menuMsg;
    closeMenu();
    Alert.alert('Thu hồi tin nhắn?', 'Mọi người sẽ không xem được nội dung này.', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Thu hồi',
        style: 'destructive',
        onPress: () => chat.recallMessage(convId, msg.id, memberList),
      },
    ]);
  };

  const reactTo = (emoji) => {
    const msg = menuMsg;
    closeMenu();
    const current = msg.reactions?.[myUid];
    chat.setReaction({
      convId,
      msgId: msg.id,
      ownerUid: msg.senderId,
      emoji: current === emoji ? null : emoji, 
      myName,
    });
  };

  const openMap = (msg) => {
    Linking.openURL(`https://www.google.com/maps?q=${msg.lat},${msg.lng}`);
  };

  const renderItem = ({ item }) => (
    <MessageBubble
      msg={item}
      isMine={item.senderId === myUid}
      showName={isGroup && item.senderId !== myUid}
      statusText={lastMine && item.id === lastMine.id ? statusText : ''}
      onLongPress={() => {
        // Tin đang tải lên hoặc đã thu hồi thì không mở menu
        if (!item.localUri && !item.recalled) setMenuMsg(item);
      }}
      onPressImage={setViewerUrl}
      onPressLocation={() => openMap(item)}
      onRetry={() => uploadPending(item)}
    />
  );

  if (!conv) return <ActivityIndicator style={{ flex: 1 }} />;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <FlatList
        data={data}
        inverted
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onEndReached={loadOlder}
        onEndReachedThreshold={0.2}
        contentContainerStyle={{ padding: 10 }}
        ListFooterComponent={
          loadingOlder ? (
            <ActivityIndicator style={{ margin: 10 }} />
          ) : noMore ? (
            <Text style={styles.noMore}>Đã hết tin nhắn</Text>
          ) : null
        }
      />

      <View style={styles.inputBar}>
        <Pressable style={styles.iconBtn} onPress={chooseImage}>
          <Text style={styles.icon}>📷</Text>
        </Pressable>
        <Pressable style={styles.iconBtn} onPress={sendLocation}>
          <Text style={styles.icon}>📍</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={text}
          onChangeText={onChangeText}
          multiline
        />
        <Pressable style={styles.sendBtn} onPress={sendText}>
          <Text style={styles.sendText}>Gửi</Text>
        </Pressable>
      </View>

      <MessageActionModal
        visible={!!menuMsg}
        isMine={menuMsg?.senderId === myUid}
        canCopy={menuMsg?.type === 'text'}
        myReaction={menuMsg?.reactions?.[myUid]}
        onClose={closeMenu}
        onCopy={copyMsg}
        onRecall={recallMsg}
        onReact={reactTo}
      />

      <Modal visible={!!viewerUrl} transparent onRequestClose={() => setViewerUrl(null)}>
        <Pressable style={styles.viewer} onPress={() => setViewerUrl(null)}>
          {viewerUrl && (
            <Image source={{ uri: viewerUrl }} style={styles.fullImage} resizeMode="contain" />
          )}
        </Pressable>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f3f4f6' },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSub: { fontSize: 12, color: '#6b7280' },
  noMore: { textAlign: 'center', color: '#9ca3af', marginVertical: 8 },
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', padding: 8,
    backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e5e7eb',
  },
  iconBtn: { padding: 6 },
  icon: { fontSize: 22 },
  input: {
    flex: 1, maxHeight: 100, borderWidth: 1, borderColor: '#d1d5db',
    borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8, marginHorizontal: 4,
  },
  sendBtn: { backgroundColor: '#2563eb', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  sendText: { color: '#fff', fontWeight: '600' },
  viewer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center' },
  fullImage: { width: '100%', height: '100%' },
});