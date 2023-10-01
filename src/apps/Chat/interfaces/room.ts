import { Message } from '@Interfaces/message.interface';

export interface Room {
  name: string,
  image: string,
  usersIds: number[],
  createdAt: Date,
  numberOfNewMessages: number,
  lastMessage: Message,
  id: number,
}
