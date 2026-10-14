import { AppNotification, Conversation, User } from '../types';

export const users: User[] = [
  { id: '1', name: 'Nguyễn Minh Anh', avatar: '👩🏻', online: true },
  { id: '2', name: 'Trần Thị Bích', avatar: '👩🏻‍🦰', online: true },
  { id: '3', name: 'Lê Văn Nam', avatar: '👨🏻', online: false },
  { id: '4', name: 'Phạm Thu Hà', avatar: '👩🏻‍🦱', online: true },
  { id: '5', name: 'Hoàng Đức', avatar: '👨🏼', online: true },
  { id: '6', name: 'Nguyễn Thảo', avatar: '👩🏻‍🦳', online: false },
];

export const conversations: Conversation[] = users.map((user, index) => ({
  ...user,
  message: ['Chào bạn, hôm nay thế nào?', 'Bạn đã nhận được chưa?', 'Cảm ơn bạn nhiều', 'Hôm qua', 'Được rồi, mình sẽ xem lại', 'Bạn ổn, cảm ơn'][index],
  time: ['09:24', '08:56', '08:32', 'Hôm qua', 'Hôm qua', 'Thứ 6'][index],
  unread: index < 4 ? index + 1 : 0,
}));

export const initialNotifications: AppNotification[] = [
  { id: '1', title: 'Nguyễn Minh Anh', message: 'Đã gửi cho bạn một tin nhắn mới', time: '09:24', read: false },
  { id: '2', title: 'Hệ thống', message: 'Bạn đã đăng nhập vào thiết bị mới', time: '08:58', read: false },
  { id: '3', title: 'Trần Thị Bích', message: 'Đã thích tin nhắn của bạn', time: '08:32', read: true },
  { id: '4', title: 'Lê Văn Nam', message: 'Đã gọi cho bạn một lần', time: 'Hôm qua', read: true },
  { id: '5', title: 'Hoàng Đức', message: 'Đã nhắc bạn trong nhóm', time: 'Thứ 6', read: true },
];
