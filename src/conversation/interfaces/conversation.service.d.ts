import { CreateConversationDto } from '../dto/createConversation.dto';
import { UserEntity } from '../../user/user.entity';
import { ConversationEntity } from '../conversation.entity';

export interface IConversationService {
  createConversation: (
    user: UserEntity,
    createConversation: CreateConversationDto,
  ) => Promise<ConversationEntity>;
  getConversations: (id: string) => Promise<ConversationEntity[]>;
  getConversationById: (id: string) => Promise<ConversationEntity>;
}
