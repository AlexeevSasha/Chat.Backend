import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IConversationsService } from './interfaces/conversation.service';
import { CreateConversationDto } from './dto/createConversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Injectable()
export class ConversationService implements IConversationsService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async createConversation(
    id: string,
    conversationsDetails: CreateConversationDto,
  ) {
    const { recipientId } = conversationsDetails;
    const user = await this.userRepository.findOneBy({ id });

    if (user.id === recipientId)
      throw new HttpException(
        'Cannot Create Conversation',
        HttpStatus.BAD_REQUEST,
      );

    const existingConversation = await this.conversationRepository.findOne({
      where: [
        {
          creator: { id: user.id },
          recipient: { id: recipientId },
        },
        {
          creator: { id: recipientId },
          recipient: { id: user.id },
        },
      ],
    });

    if (existingConversation)
      throw new HttpException('Conversation exists', HttpStatus.CONFLICT);

    const recipient = await this.userRepository.findOneBy({ id: recipientId });

    if (!recipient)
      throw new HttpException('Recipient not found', HttpStatus.BAD_REQUEST);

    const conversation = this.conversationRepository.create({
      creator: user,
      recipient: recipient,
    });

    return this.conversationRepository.save(conversation);
  }
}
