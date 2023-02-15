import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { Services } from '../utils/constants/services';
import { IConversationService } from './interfaces/conversation.service';
import { Routes } from '../utils/constants/routes';
import { GetUser } from '../user/decorators/user.decorator';
import { CreateConversationDto } from './dto/createConversation.dto';
import { AuthGuard } from '../auth/guards/AuthGuard';

@Controller(Routes.CONVERSATIONS)
@UseGuards(AuthGuard)
export class ConversationController {
  constructor(
    @Inject(Services.CONVERSATIONS)
    private readonly conversationService: IConversationService,
  ) {}

  @Post()
  async createConversation(
    @GetUser('id') id: string,
    @Body() payload: CreateConversationDto,
  ) {
    return await this.conversationService.createConversation(id, payload);
  }

  @Get('test')
  async getConf() {
    return { test: 'а вот и я' };
  }
}
