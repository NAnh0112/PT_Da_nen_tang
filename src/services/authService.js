import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@firebase/auth';
import { ref, set, onValue, onDisconnect, serverTimestamp } from '@firebase/database';
import { auth, db } from './firebase';

export async function register(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await set(ref(db, `users/${cred.user.uid}`), {
    name,
    email,
    online: false,
    lastSeen: serverTimestamp(),
  });
}

export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function logout() {
  const uid = auth.currentUser?.uid;
  if (uid) {
    await set(ref(db, `users/${uid}/online`), false);
    await set(ref(db, `users/${uid}/lastSeen`), serverTimestamp());
  }
  await signOut(auth);
}

export function startPresence(uid) {
  const onlineRef = ref(db, `users/${uid}/online`);
  const lastSeenRef = ref(db, `users/${uid}/lastSeen`);
  const activeRef = ref(db, `users/${uid}/activeConvId`);

  return onValue(ref(db, '.info/connected'), (snap) => {
    if (snap.val() !== true) return;
    onDisconnect(onlineRef).set(false);
    onDisconnect(lastSeenRef).set(serverTimestamp());
    onDisconnect(activeRef).remove();
    set(onlineRef, true);
  });
}

export function authErrorMessage(e) {
  switch (e.code) {
    case 'auth/invalid-email':
      return 'Email không hợp lệ';
    case 'auth/email-already-in-use':
      return 'Email này đã được đăng ký';
    case 'auth/weak-password':
      return 'Mật khẩu quá yếu (tối thiểu 6 ký tự)';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Sai tài khoản hoặc mật khẩu';
    default:
      return 'Có lỗi xảy ra: ' + e.message;
  }
}