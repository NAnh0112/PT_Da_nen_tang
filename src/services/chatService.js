import { auth, database } from './firebaseConfig';
import {
  onDisconnect,
  onValue,
  push,
  ref,
  serverTimestamp,
  set,
  transaction,
  update,
} from 'firebase/database';

export const makeChatId = (firstUid, secondUid) =>
  firstUid < secondUid ? `${firstUid}_${secondUid}` : `${secondUid}_${firstUid}`;

export const listenToUsers = (callback) =>
  onValue(ref(database, 'users'), snapshot => {
    const data = snapshot.val() || {};
    callback(Object.values(data));
  });

export const listenToConversations = (uid, callback) =>
  onValue(ref(database, `conversations/${uid}`), snapshot => {
    const data = snapshot.val() || {};
    const list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
    callback(list.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
  });

export const listenToMessages = (chatId, callback) =>
  onValue(ref(database, `chats/${chatId}/messages`), snapshot => {
    const data = snapshot.val() || {};
    const list = Object.entries(data).map(([id, value]) => ({ id, ...value }));
    callback(list.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0)));
  });

export const markConversationRead = (uid, partnerUid) =>
  update(ref(database, `conversations/${uid}/${partnerUid}`), { unreadCount: 0 });

const saveConversation = (uid, partnerUid, summary) =>
  update(ref(database, `conversations/${uid}/${partnerUid}`), summary);

const sendMessage = async (receiver, message, preview) => {
  const sender = auth.currentUser;
  if (!sender) throw new Error('Phiên đăng nhập đã hết. Vui lòng đăng nhập lại.');

  const chatId = makeChatId(sender.uid, receiver.uid);
  await push(ref(database, `chats/${chatId}/messages`), {
    ...message,
    senderId: sender.uid,
    timestamp: serverTimestamp(),
  });

  const senderSummary = {
    partnerId: receiver.uid,
    partnerName: receiver.name,
    partnerAvatar: receiver.avatar || '',
    lastMessage: preview,
    timestamp: serverTimestamp(),
  };
  const receiverSummary = {
    partnerId: sender.uid,
    partnerName: sender.displayName || sender.email || 'Người dùng',
    partnerAvatar: '',
    lastMessage: preview,
    timestamp: serverTimestamp(),
  };

  await saveConversation(sender.uid, receiver.uid, senderSummary);
  await saveConversation(receiver.uid, sender.uid, receiverSummary);
  await transaction(
    ref(database, `conversations/${receiver.uid}/${sender.uid}/unreadCount`),
    current => (current || 0) + 1,
  );
};

export const sendTextMessage = (receiver, text) =>
  sendMessage(receiver, { type: 'text', text }, text);

export const sendLocationMessage = (receiver, latitude, longitude) =>
  sendMessage(
    receiver,
    { type: 'location', latitude, longitude },
    '[Vị trí]',
  );

export const watchPresence = (uid) => {
  const connectedRef = ref(database, '.info/connected');
  const userStatusRef = ref(database, `users/${uid}/status`);
  return onValue(connectedRef, snapshot => {
    if (snapshot.val() === true) {
      onDisconnect(userStatusRef).set('offline');
      set(userStatusRef, 'online');
    }
  });
};

export const setOffline = (uid) =>
  update(ref(database, `users/${uid}`), { status: 'offline' });
