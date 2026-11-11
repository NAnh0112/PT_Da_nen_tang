import { ref, onValue, get } from '@firebase/database';
import { auth, db } from './firebase';

export function listenContacts(callback) {
  const myUid = auth.currentUser.uid;
  return onValue(ref(db, 'users'), (snap) => {
    const list = [];
    snap.forEach((child) => {
      if (child.key !== myUid) list.push({ uid: child.key, ...child.val() });
    });
    list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    callback(list);
  });
}

export function listenUser(uid, callback) {
  return onValue(ref(db, `users/${uid}`), (snap) => callback(snap.val() || {}));
}

export async function getMyName() {
  const snap = await get(ref(db, `users/${auth.currentUser.uid}/name`));
  return snap.val() || 'Người dùng';
}