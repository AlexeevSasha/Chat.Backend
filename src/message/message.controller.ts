import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../utils/constants/routes';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { Services } from '../utils/constants/services';
import { IMessageService } from './interfaces/message.service';
import { GetUser } from '../user/decorators/user.decorator';
import { CreateMessageDto } from './dto/createMessage.dto';
import { UserEntity } from '../user/user.entity';
import { MessageEntity } from './message.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.MESSAGES)
@UseGuards(AuthGuard)
export class MessageController {
  constructor(
    @Inject(Services.MESSAGES)
    private readonly messageService: IMessageService,
    private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @GetUser() user: UserEntity,
    @Body() createMessage: CreateMessageDto,
  ) {
    const message = await this.messageService.createMessage({
      user,
      ...createMessage,
    });
    this.eventEmitter.emit('send_message', message);
  }

  @Get(':conversationId')
  async getMessagesByConversationId(
    @Param('conversationId') id: string,
  ): Promise<{ id: string; messages: MessageEntity[] }> {
    const messages = await this.messageService.getMessagesByConversationId(id);
    return { id, messages };
  }
}
