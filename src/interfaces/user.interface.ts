import { Message } from '@Interfaces/message.interface';

export interface User {
  id: number;
  username: string;
  online: boolean;
  lastVisit: Date;
  lastMessage: Message;
  numberOfNewMessages: number;
}
