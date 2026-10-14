export type User = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
};

export type Conversation = User & {
  message: string;
  time: string;
  unread: number;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
};
