import {
  ref, push, get, set, remove, update, onValue, query, orderByKey,
  limitToLast, endBefore, onDisconnect, serverTimestamp, increment,
} from '@firebase/database';
import { auth, db } from './firebase';
import { makeNotification } from './notificationService';
import { previewOf } from '../utils/format';

const PAGE_SIZE = 20;
const myUid = () => auth.currentUser?.uid;

export function directConvId(a, b) {
  return `direct_${[a, b].sort().join('_')}`;
}

export async function openDirectChat(me, myName, other) {
  const convId = directConvId(me, other.uid);
  const existed = await get(ref(db, `userChats/${me}/${convId}`));
  if (existed.exists()) return convId;

  await set(ref(db, `conversations/${convId}`), {
    type: 'direct',
    members: { [me]: true, [other.uid]: true },
    createdBy: me,
    createdAt: serverTimestamp(),
  });

  const updates = {};
  updates[`userChats/${me}/${convId}`] = {
    type: 'direct', title: other.name, unread: 0, updatedAt: serverTimestamp(),
  };
  updates[`userChats/${other.uid}/${convId}`] = {
    type: 'direct', title: myName, unread: 0, updatedAt: serverTimestamp(),
  };
  await update(ref(db), updates);
  return convId;
}

export function listenConversation(convId, callback) {
  return onValue(ref(db, `conversations/${convId}`), (snap) => callback(snap.val()));
}

function toMap(snap) {
  const map = {};
  snap.forEach((child) => {
    map[child.key] = { id: child.key, ...child.val() };
  });
  return map;
}

export function listenLatestMessages(convId, callback) {
  const q = query(ref(db, `messages/${convId}`), orderByKey(), limitToLast(PAGE_SIZE));
  return onValue(q, (snap) => callback(toMap(snap)));
}

export async function loadOlderMessages(convId, oldestKey) {
  const q = query(
    ref(db, `messages/${convId}`),
    orderByKey(),
    endBefore(oldestKey),
    limitToLast(PAGE_SIZE),
  );
  return toMap(await get(q));
}

async function getActiveConvs(uids) {
  const result = {};
  await Promise.all(
    uids.map(async (uid) => {
      const snap = await get(ref(db, `users/${uid}/activeConvId`));
      result[uid] = snap.val();
    }),
  );
  return result;
}

export async function sendMessage({
  convId, members, senderId, senderName, type, text = '', imageUrl = '', lat, lng,
}) {
  const msgId = push(ref(db, `messages/${convId}`)).key;

  const msg = { senderId, senderName, type, createdAt: serverTimestamp(), recalled: false };
  if (type === 'text') msg.text = text;
  if (type === 'image') msg.imageUrl = imageUrl;
  if (type === 'location') {
    msg.lat = lat;
    msg.lng = lng;
  }

  const updates = {};
  updates[`messages/${convId}/${msgId}`] = msg;
  updates[`readStatus/${convId}/${senderId}`] = serverTimestamp();

  const activeMap = await getActiveConvs(members);
  const preview = previewOf(type, text);

  members.forEach((uid) => {
    const base = `userChats/${uid}/${convId}`;
    updates[`${base}/lastMessage`] = type === 'text' ? text : '';
    updates[`${base}/lastType`] = type;
    updates[`${base}/lastMessageId`] = msgId;
    updates[`${base}/lastSenderId`] = senderId;
    updates[`${base}/updatedAt`] = serverTimestamp();

    if (uid === senderId) {
      updates[`${base}/unread`] = 0;
    } else if (activeMap[uid] !== convId) {
      updates[`${base}/unread`] = increment(1);
      makeNotification(updates, uid, {
        type: 'message',
        convId,
        fromUid: senderId,
        text: `${senderName}: ${preview}`,
      });
    }
  });

  await update(ref(db), updates);
  return msgId;
}

export async function recallMessage(convId, msgId, members) {
  const me = myUid();
  const updates = { [`messages/${convId}/${msgId}/recalled`]: true };

  const last = await get(ref(db, `userChats/${me}/${convId}/lastMessageId`));
  if (last.val() === msgId) {
    members.forEach((uid) => {
      updates[`userChats/${uid}/${convId}/lastType`] = 'recalled';
      updates[`userChats/${uid}/${convId}/lastMessage`] = '';
    });
  }
  await update(ref(db), updates);
}

export async function setReaction({ convId, msgId, ownerUid, emoji, myName }) {
  const me = myUid();
  const reactRef = ref(db, `messages/${convId}/${msgId}/reactions/${me}`);
  if (!emoji) return remove(reactRef);

  await set(reactRef, emoji);
  if (ownerUid !== me) {
    const updates = {};
    makeNotification(updates, ownerUid, {
      type: 'reaction',
      convId,
      fromUid: me,
      text: `${myName} đã thả ${emoji} vào tin nhắn của bạn`,
    });
    await update(ref(db), updates);
  }
}

export function setTyping(convId, isTyping) {
  const me = myUid();
  if (!me) return;
  const typingRef = ref(db, `typing/${convId}/${me}`);
  if (isTyping) {
    onDisconnect(typingRef).remove();
    return set(typingRef, true);
  }
  return remove(typingRef);
}

export function listenTyping(convId, callback) {
  return onValue(ref(db, `typing/${convId}`), (snap) =>
    callback(Object.keys(snap.val() || {})),
  );
}

export function listenReadStatus(convId, callback) {
  return onValue(ref(db, `readStatus/${convId}`), (snap) => callback(snap.val() || {}));
}

export function markAsRead(convId) {
  const me = myUid();
  if (!me) return;
  return update(ref(db), {
    [`readStatus/${convId}/${me}`]: serverTimestamp(),
    [`userChats/${me}/${convId}/unread`]: 0,
  });
}

export function setActiveConv(convId) {
  const me = myUid();
  if (!me) return;
  const activeRef = ref(db, `users/${me}/activeConvId`);
  if (convId) {
    onDisconnect(activeRef).remove();
    return set(activeRef, convId);
  }
  return remove(activeRef);
}

export function listenUserChats(callback) {
  return onValue(ref(db, `userChats/${myUid()}`), (snap) => {
    const list = [];
    snap.forEach((child) => {
      list.push({ id: child.key, ...child.val() });
    });
    list.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
    callback(list);
  });
}