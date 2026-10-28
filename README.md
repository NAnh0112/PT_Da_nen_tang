# Bài thực hành 5 - Chat 1-1 realtime

Ứng dụng dùng React Native CLI, React Navigation, Firebase Authentication,
Realtime Database và `@react-native-community/geolocation`. Code Firebase nằm
trong `src/services/` để dễ học và dễ sửa.

## 1. Khởi tạo project mới (nếu chưa có Bài 4)

```powershell
npx @react-native-community/cli@latest init CHAT
cd CHAT
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install firebase @react-native-async-storage/async-storage @react-native-community/geolocation
npm install react-native-screens react-native-safe-area-context
```

Nếu đang dùng đúng project này thì chỉ cần:

```powershell
cd D:\APP\CHAT
npm install
```

## 2. Tạo Firebase

1. Vào Firebase Console, tạo project mới.
2. Chọn **Authentication > Sign-in method**, bật **Email/Password**.
3. Chọn **Realtime Database > Create database**. Trong lúc làm bài có thể
   chọn Test mode, nhưng trước khi nộp nên thay bằng luật ở phần dưới.
4. Vào **Project settings > Your apps > Web app**, tạo một ứng dụng Web.
5. Sao chép `firebaseConfig` vào
   [`firebaseConfig.js`](./src/services/firebaseConfig.js). Không ghi mật khẩu
   Firebase vào code; các giá trị config web này không phải mật khẩu.

## 3. Luật Realtime Database

Trong Realtime Database > Rules, dùng luật đơn giản sau. Người dùng chỉ đọc
được dữ liệu khi đã đăng nhập; mỗi tài khoản chỉ được sửa hồ sơ của mình.

```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null",
    "users": {
      "$uid": {
        ".write": "auth.uid === $uid"
      }
    }
  }
}
```

Trong sản phẩm thật nên viết luật chi tiết hơn cho `chats` và
`conversations`. Luật trên phù hợp để minh họa trong bài thực hành, dễ kiểm
tra từ hai thiết bị.

## 4. Quyền vị trí

- Android: quyền đã được thêm vào `android/app/src/main/AndroidManifest.xml`.
- iOS: nội dung xin quyền đã được thêm vào `ios/CHAT/Info.plist`.
- Khi bấm nút `📍`, app xin quyền Android lúc chạy. Nếu từ chối, app báo rõ
  và không tạo tin nhắn rỗng.

## 5. Chạy ứng dụng

Mở hai terminal:

```powershell
cd D:\APP\CHAT
npm start
```

Terminal thứ hai:

```powershell
cd D:\APP\CHAT
npm run android
```

Đăng ký hai email khác nhau trên hai emulator/điện thoại. Sau đó kiểm tra:

1. Hai tài khoản xuất hiện trong Danh bạ (trừ tài khoản hiện tại).
2. Trạng thái online đổi ngay khi đăng nhập/đăng xuất.
3. Tin nhắn và vị trí xuất hiện ở cả hai máy.
4. Home sắp xếp cuộc trò chuyện mới nhất lên đầu.
5. Tin đến khi đang ở Home làm tăng badge chưa đọc; mở chat sẽ đưa về 0.
6. Tab Thông báo giữ danh sách của Bài 4; chạm một dòng để đánh dấu đã đọc.

## 6. Giải thích các phần chính

- `src/services/chatService.js`: tạo `chatId` ổn định cho hai UID, đăng ký
  listener và trả về hàm hủy listener trong `useEffect`, gửi tin nhắn, tăng
  unread bằng `transaction`, cập nhật presence.
- `ChatScreen.js`: tin của mình ở bên phải, tin đối phương bên trái; tin
  vị trí mở Google Maps bằng latitude/longitude.
- `HomeScreen.js`: lắng nghe `conversations/{uid}` nên không cần tải lại màn
  hình.
- `App.tsx`: `onAuthStateChanged` quyết định hiển thị nhóm màn hình đăng nhập
  hay nhóm màn hình chính.

Kiểm tra mã:

```powershell
cd D:\APP\CHAT
npm run lint
npx tsc --noEmit
```
