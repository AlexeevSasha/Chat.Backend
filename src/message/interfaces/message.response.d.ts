import { MessageEntity } from '../message.entity';
import { ConversationEntity } from '../../conversation/conversation.entity';

export interface ICreateMessageResponse {
  message: MessageEntity;
  conversation: ConversationEntity;
}
