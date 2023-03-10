import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Services } from '../utils/constants/services';
import { IConversationService } from './interfaces/conversation.service';
import { Routes } from '../utils/constants/routes';
import { GetUser } from '../user/decorators/user.decorator';
import { CreateConversationDto } from './dto/createConversation.dto';
import { AuthGuard } from '../auth/guards/AuthGuard';
import { UserEntity } from '../user/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationService,
    private readonly events: EventEmitter2,
  ) {}

  @Post()
  async createConversation(
    @GetUser() user: UserEntity,
    @Body() payload: CreateConversationDto,
  ) {
    const conversation = await this.conversationService.createConversation(
      user,
      payload,
    );
    this.events.emit('conversation.create', conversation);
    return conversation;
  }

  @Get()
  async getConversations(@GetUser('id') id: string) {
    return this.conversationService.getConversations(id);
  }

  @Get(':id')
  async getConversationById(@Param('id') id: string) {
    return this.conversationService.findById(id);
  }
}
