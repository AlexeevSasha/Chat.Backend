import { BadRequestException, Injectable } from '@nestjs/common';
import { IMessageService } from './interfaces/message.service';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from './dto/createMessage.dto';
import { ConversationEntity } from '../conversation/conversation.entity';
import { UserEntity } from '../user/user.entity';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @InjectRepository(ConversationEntity)
    private readonly conversationRepository: Repository<ConversationEntity>,
  ) {}

  async createMessage({
    user,
    content,
    conversationId,
  }: CreateMessageDto & { user: UserEntity }) {
    const conversation = await this.conversationRepository.findOne({
      where: { id: conversationId },
      relations: ['creator', 'recipient', 'lastMessage'],
    });

    if (!conversation) throw new BadRequestException('Conversation not found');

    if (
      conversation.creator.id !== user.id &&
      conversation.recipient.id !== user.id
    ) {
      throw new BadRequestException('Cannot Create Message');
    }

    const message = await this.messageRepository.save(
      this.messageRepository.create({
        content,
        conversation,
        author: user,
      }),
    );

    conversation.lastMessage = message;
    const updatedConversation = await this.conversationRepository.save(
      conversation,
    );

    return { message: message, conversation: updatedConversation };
  }

  getMessagesByConversationId(id: string): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      relations: ['author'],
      where: { conversation: { id } },
      order: { createdAt: 'DESC' },
    });
  }
}
