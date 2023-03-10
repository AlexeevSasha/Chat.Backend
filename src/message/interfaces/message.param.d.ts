import { CreateMessageDto } from '../dto/createMessage.dto';
import { UserEntity } from '../../user/user.entity';

export interface IDeleteMessageParams {
  userId: string;
  conversationId: string;
  messageId: string;
}

export interface ICreateMessageParam extends CreateMessageDto {
  user: UserEntity;
  conversationId: string;
}
