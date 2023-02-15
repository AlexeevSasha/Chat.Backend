import { CreateConversationDto } from '../dto/createConversation.dto';

export interface IConversationService {
  createConversation(id: string, createConversation: CreateConversationDto);
}
