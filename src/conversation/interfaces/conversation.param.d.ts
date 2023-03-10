import { MessageEntity } from '../../message/message.entity';

export interface IGetMessages {
  id: string;
  limit: number;
}

export interface IUpdateLastMessage {
  id: string;
  lastMessage: MessageEntity | null;
}
