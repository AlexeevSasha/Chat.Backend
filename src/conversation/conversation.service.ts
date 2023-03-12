import { BadRequestException, Injectable } from '@nestjs/common';
import { IConversationService } from './interfaces/conversation.service';
import { CreateConversationDto } from './dto/createConversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { Repository } from 'typeorm';
import { ConversationEntity } from './conversation.entity';
import { MessageEntity } from '../message/message.entity';
import {
  IGetMessages,
  IUpdateLastMessage,
} from './interfaces/conversation.param';

@Injectable()
export class ConversationService implements IConversationService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,

    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async createConversation(
    user: UserEntity,
    conversationsDetails: CreateConversationDto,
  ) {
    const { recipientId, message } = conversationsDetails;

    const recipient = await this.userRepository.findOneBy({ id: recipientId });
    if (!recipient) throw new BadRequestException('Recipient not found');

    if (user.id === recipientId)
      throw new BadRequestException('Cannot create conversation with yourself');

    const exists = await this.isCreated(user.id, recipient.id);
    if (exists) throw new BadRequestException('Conversation already exists');

    const conversation = await this.conversationRepository.save(
      this.conversationRepository.create({
        creator: user,
        recipient,
      }),
    );

    await this.messageRepository.save(
      this.messageRepository.create({
        content: message,
        conversation,
        author: user,
      }),
    );

    return conversation;
  }

  async getConversations(id: string): Promise<ConversationEntity[]> {
    return await this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .where('creator.id=:id', { id })
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .leftJoinAndSelect('conversation.lastMessage', 'lastMessage')
      .orWhere('recipient.id=:id', { id })
      .orderBy('lastMessage.createdAt', 'DESC')
      .getMany();
  }

  async findById(id: string): Promise<ConversationEntity> {
    const conversation = await this.conversationRepository.findOne({
      where: { id },
      relations: [
        'creator',
        'recipient',
        'messages',
        'messages.author',
        'lastMessage',
      ],
    });
    if (!conversation) throw new BadRequestException('Conversation not fount');
    return conversation;
  }

  getMessages({ id, limit }: IGetMessages): Promise<ConversationEntity> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('id=:id', { id })
      .leftJoinAndSelect('conversation.lastMessage', 'lastMessage')
      .leftJoinAndSelect('conversation.messages', 'message')
      .where('conversation.id=:id', { id })
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getOne();
  }

  private async isCreated(userId: string, recipientId: string) {
    return this.conversationRepository.findOne({
      where: [
        { creator: { id: userId }, recipient: { id: recipientId } },
        { creator: { id: recipientId }, recipient: { id: userId } },
      ],
    });
  }

  save(conversation: ConversationEntity): Promise<ConversationEntity> {
    return this.conversationRepository.save(conversation);
  }

  updateLastMessage({ id, lastMessage }: IUpdateLastMessage) {
    return this.conversationRepository.update(id, { lastMessage });
  }
}
