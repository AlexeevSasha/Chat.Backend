import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { Services } from '../utils/constants/services';
import { MessageService } from './message.service';
import { ConversationEntity } from '../conversation/conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageEntity, ConversationEntity])],
  controllers: [MessageController],
  providers: [
    {
      provide: Services.MESSAGES,
      useClass: MessageService,
    },
  ],
})
export class MessageModule {}
