import { CreateMessageDto } from '../dto/createMessage.dto';
import { UserEntity } from '../../user/user.entity';
import { MessageEntity } from '../message.entity';
import { ICreateMessageResponse } from './message.response';

export interface IMessageService {
  createMessage: (
    param: CreateMessageDto & { user: UserEntity },
  ) => Promise<ICreateMessageResponse>;
  getMessagesByConversationId: (id: string) => Promise<MessageEntity[]>;
}
