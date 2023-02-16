import { CreateMessageDto } from '../dto/createMessage.dto';
import { UserEntity } from '../../user/user.entity';
import { MessageEntity } from '../message.entity';

export interface IMessageService {
  createMessage: (
    param: CreateMessageDto & { user: UserEntity },
  ) => Promise<MessageEntity>;
  getMessagesByConversationId: (id: string) => Promise<MessageEntity[]>;
}
