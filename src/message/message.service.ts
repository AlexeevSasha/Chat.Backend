import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IMessageService } from './interfaces/message.service';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ICreateMessageParam,
  IDeleteMessageParams,
} from './interfaces/message.param';
import { Services } from '../utils/constants/services';
import { IConversationService } from '../conversation/interfaces/conversation.service';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messageRepository: Repository<MessageEntity>,
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationService,
  ) {}

  async createMessage({ user, content, conversationId }: ICreateMessageParam) {
    const conversation = await this.conversationService.findById(
      conversationId,
    );
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
    const updatedConversation = await this.conversationService.save(
      conversation,
    );

    return { message: message, conversation: updatedConversation };
  }

  getMessages(id: string): Promise<MessageEntity[]> {
    return this.messageRepository.find({
      relations: ['author'],
      where: { conversation: { id } },
      order: { createdAt: 'DESC' },
    });
  }

  async deleteMessage({
    userId,
    conversationId,
    messageId,
  }: IDeleteMessageParams) {
    const conversation = await this.conversationService.getMessages({
      id: conversationId,
      limit: 5,
    });
    if (!conversation) throw new BadRequestException('Conversation not found');

    const message = await this.messageRepository.findOne({
      where: {
        id: messageId,
        author: { id: userId },
        conversation: { id: conversationId },
      },
    });

    if (!message) throw new BadRequestException('Cannot delete message');

    if (conversation.lastMessage.id === message.id) {
      await this.conversationService.updateLastMessage({
        id: conversation.id,
        lastMessage: conversation.messages?.[1] || null,
      });
    }
    return this.messageRepository.delete({ id: message.id });
  }

  async editMessage(params: any) {
    const message = await this.messageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
      },
      relations: [
        'conversation',
        'conversation.creator',
        'conversation.recipient',
        'author',
        'author.profile',
      ],
    });
    if (!message) throw new BadRequestException('Cannot Edit Message');
    message.content = params.content;
    return this.messageRepository.save(message);
  }
}
