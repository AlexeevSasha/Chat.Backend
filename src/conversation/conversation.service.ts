import { BadRequestException, Injectable } from '@nestjs/common';
import { IConversationService } from './interfaces/conversation.service';
import { CreateConversationDto } from './dto/createConversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { ConversationEntity } from './conversation.entity';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async createConversation(
    user: UserEntity,
    conversationsDetails: CreateConversationDto,
  ) {
    const { recipientId } = conversationsDetails;

    if (user.id === recipientId)
      throw new BadRequestException('Cannot create conversation');

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
      throw new BadRequestException('Conversation exists');

    const recipient = await this.userRepository.findOneBy({ id: recipientId });

    if (!recipient) throw new BadRequestException('Recipient not found');

    const conversation = this.conversationRepository.create({
      creator: user,
      recipient: recipient,
    });

    return this.conversationRepository.save(conversation);
  }

  async getConversations(id: string): Promise<ConversationEntity[]> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .where('creator.id = :id', { id })
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .orWhere('recipient.id = :id', { id })
      .orderBy('conversation.id', 'DESC')
      .getMany();
  }

  async getConversationById(id: string): Promise<ConversationEntity> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'recipient', 'messages', 'messages.author'],
    });
    if (!conversation) throw new BadRequestException('Conversation not fount');
    return conversation;
  }
}
