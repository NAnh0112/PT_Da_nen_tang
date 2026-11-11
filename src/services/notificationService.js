import { ref, push, onValue, update, serverTimestamp } from '@firebase/database';
import { auth, db } from './firebase';

export function makeNotification(updates, toUid, data) {
  const key = push(ref(db, `notifications/${toUid}`)).key; 
  updates[`notifications/${toUid}/${key}`] = {
    ...data,
    createdAt: serverTimestamp(),
    read: false,
  };
}

export function listenNotifications(callback) {
  return onValue(ref(db, `notifications/${auth.currentUser.uid}`), (snap) => {
    const list = [];
    snap.forEach((child) => {
      list.push({ id: child.key, ...child.val() });
    });
    list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    callback(list);
  });
}

export function markNotificationsRead(ids) {
  const uid = auth.currentUser.uid;
  const updates = {};
  ids.forEach((id) => {
    updates[`notifications/${uid}/${id}/read`] = true;
  });
  return update(ref(db), updates);
}