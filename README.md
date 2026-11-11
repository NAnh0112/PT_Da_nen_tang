# AdvancedChatApp - Bài thực hành 6

Ứng dụng chat nhóm bằng **React Native CLI + Firebase Realtime Database**.

## 1. Tạo dự án mới từ đầu

Đây là các lệnh Windows PowerShell. Nếu đã có thư mục `AdvancedChatApp`, có thể bỏ qua bước tạo dự án và chép mã nguồn vào đúng cấu trúc bên dưới.

```powershell
npx @react-native-community/cli@latest init AdvancedChatApp
Set-Location .\AdvancedChatApp

npm install firebase @react-native-async-storage/async-storage
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @react-native-community/geolocation
npm install react-native-image-picker @react-native-clipboard/clipboard

npx react-native start --reset-cache
```

Mở cửa sổ PowerShell thứ hai:

```powershell
Set-Location .\AdvancedChatApp
npx react-native run-android
```

## 2. Bật máy ảo Android

1. Mở Android Studio.
2. Chọn **More Actions > Virtual Device Manager**.
3. Tạo máy ảo Pixel với Android API 35 hoặc API 36.
4. Nhấn nút **Play** để bật máy ảo.
5. Kiểm tra thiết bị:

```powershell
adb devices
```

Nếu thấy trạng thái `device`, chạy:

```powershell
npx react-native run-android
```

Nếu Metro không tự kết nối:

```powershell
adb reverse tcp:8081 tcp:8081
```

## 3. Cấu trúc mã nguồn

```text
AdvancedChatApp/
├─ App.tsx
├─ database.rules.json
├─ src/
│  ├─ components/
│  │  ├─ MessageActionModal.js
│  │  └─ MessageBubble.js
│  ├─ navigation/
│  │  ├─ MainTabs.js
│  │  └─ RootNavigator.js
│  ├─ screens/
│  │  ├─ ChatScreen.js
│  │  ├─ CreateGroupScreen.js
│  │  ├─ HomeScreen.js
│  │  ├─ NotificationsScreen.js
│  │  ├─ LoginScreen.js
│  │  └─ RegisterScreen.js
│  ├─ services/
│  │  ├─ firebase.js
│  │  ├─ authService.js
│  │  ├─ chatService.js
│  │  ├─ groupService.js
│  │  ├─ notificationService.js
│  │  ├─ uploadService.js
│  │  └─ locationService.js
│  └─ utils/
│     └─ format.js
└─ __tests__/
   └─ App.test.tsx
```

Các thư mục có thể tạo bằng PowerShell:

```powershell
New-Item -ItemType Directory -Force `
  src\components,src\navigation,src\screens,src\services,src\utils,__mocks__
New-Item -ItemType File -Force `
  src\services\firebase.js,src\services\chatService.js,src\services\groupService.js,`
  src\services\notificationService.js,src\services\uploadService.js,`
  src\services\locationService.js,database.rules.json
```

## 4. Cấu hình Firebase

1. Vào Firebase Console và tạo project.
2. Bật **Authentication > Sign-in method > Email/Password**.
3. Tạo **Realtime Database**.
4. Vào **Project settings > Your apps**, tạo Web app.
5. Chép `firebaseConfig` vào `src/services/firebase.js`.
6. Dùng toàn bộ nội dung trong `database.rules.json` cho tab **Realtime Database > Rules**.
7. Nhấn **Publish**.

`firebase.js` dùng `initializeAuth` với AsyncStorage để phiên đăng nhập không mất khi đóng ứng dụng. Không dùng import `firebase/auth/react-native`; với Firebase 10 dùng:

```js
import { initializeAuth, getReactNativePersistence } from '@firebase/auth';
```

## 5. Cấu hình Cloudinary

1. Tạo tài khoản Cloudinary.
2. Vào **Settings > Upload > Upload presets**.
3. Tạo một preset mới và chọn **Signing mode: Unsigned**.
4. Ghi `cloud name` và `upload preset` vào `src/services/uploadService.js`.
5. Không ghi API Secret vào mã nguồn.

Ảnh được giới hạn cạnh dài tối đa 1024px trước khi tải lên. Firebase chỉ lưu URL Cloudinary.

## 6. Các tính năng đã cài đặt

- Đăng ký, đăng nhập, đăng xuất bằng Firebase Auth.
- Danh bạ và trạng thái online/offline theo thời gian thực.
- Chat 1-1 và chat nhóm.
- Gửi tin nhắn, vị trí và ảnh.
- Trạng thái `đang soạn tin…` tự tắt sau 3 giây.
- Trạng thái `Đã gửi`, `Đã xem` và số người đã xem trong nhóm.
- `onDisconnect()` cho online, active conversation và typing.
- Thu hồi tin nhắn bằng `recalled: true`.
- Sao chép tin nhắn và thả 5 loại cảm xúc.
- Tải tin nhắn theo trang 20 tin.
- Thông báo thật, badge chưa đọc và đánh dấu tất cả đã đọc.
- Multi-path `update()` và `increment(1)` cho unread.

## 7. Kiểm tra trước khi nộp

```powershell
npm run lint
npm test -- --runInBand
npx react-native bundle --platform android --dev false `
  --entry-file index.js `
  --bundle-output .tmp\index.android.bundle `
  --assets-dest .tmp\assets
```

Không nộp các thư mục `node_modules`, `android/build`, `ios/Pods` và `.tmp`.

## 8. Kịch bản quay video

1. Đăng nhập hai tài khoản trên hai máy ảo.
2. Tài khoản A mở chat với B, B gõ để A thấy `đang soạn tin…`.
3. A gửi tin, mở chat trên B để A thấy `Đã xem`.
4. A giữ tin nhắn, chọn cảm xúc rồi thu hồi một tin khác.
5. A gửi ảnh và mở ảnh toàn màn hình.
6. Tài khoản A tạo nhóm với B và tài khoản C.
7. Gửi tin trong nhóm, kiểm tra tên người gửi, online count và unread.
8. Mở tab Thông báo, kiểm tra badge và nút đánh dấu tất cả đã đọc.