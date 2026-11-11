import { ref, push, set, update, onValue, serverTimestamp, increment } from '@firebase/database';
import { auth, db } from './firebase';
import { makeNotification } from './notificationService';

export async function createGroup({ name, memberUids, myName }) {
  const me = auth.currentUser.uid;
  const convId = push(ref(db, 'conversations')).key;

  const members = { [me]: true };
  memberUids.forEach((uid) => {
    members[uid] = true;
  });

  await set(ref(db, `conversations/${convId}`), {
    type: 'group',
    name,
    members,
    createdBy: me,
    createdAt: serverTimestamp(),
  });

  const updates = {};
  Object.keys(members).forEach((uid) => {
    const base = `userChats/${uid}/${convId}`;
    updates[`${base}/type`] = 'group';
    updates[`${base}/title`] = name;
    updates[`${base}/lastMessage`] = 'Nhóm đã được tạo';
    updates[`${base}/lastType`] = 'text';
    updates[`${base}/lastSenderId`] = me;
    updates[`${base}/updatedAt`] = serverTimestamp();
    updates[`${base}/unread`] = uid === me ? 0 : increment(1);

    if (uid !== me) {
      makeNotification(updates, uid, {
        type: 'group',
        convId,
        fromUid: me,
        text: `${myName} đã thêm bạn vào nhóm "${name}"`,
      });
    }
  });

  await update(ref(db), updates);
  return convId;
}

export function listenOnlineCount(memberUids, callback) {
  const status = {};
  const unsubs = memberUids.map((uid) =>
    onValue(ref(db, `users/${uid}/online`), (snap) => {
      status[uid] = snap.val() === true;
      callback(Object.values(status).filter(Boolean).length);
    }),
  );
  return () => unsubs.forEach((unsub) => unsub());
}