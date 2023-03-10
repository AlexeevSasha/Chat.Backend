import { CreateConversationDto } from '../dto/createConversation.dto';
import { UserEntity } from '../../user/user.entity';
import { ConversationEntity } from '../conversation.entity';
import { IGetMessages, IUpdateLastMessage } from './conversation.param';

export interface IConversationService {
  createConversation: (
    user: UserEntity,
    createConversation: CreateConversationDto,
  ) => Promise<ConversationEntity>;
  getConversations: (id: string) => Promise<ConversationEntity[]>;
  findById: (id: string) => Promise<ConversationEntity>;
  save(conversation: ConversationEntity): Promise<ConversationEntity>;
  getMessages({ id, limit }: IGetMessages): Promise<ConversationEntity>;
  updateLastMessage({ id, lastMessage }: IUpdateLastMessage);
}
