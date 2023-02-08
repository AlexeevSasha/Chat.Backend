import { CreateConversationDto } from '../dto/createConversation.dto';

export interface IConversationsService {
  createConversation(id: string, createConversation: CreateConversationDto);
}
