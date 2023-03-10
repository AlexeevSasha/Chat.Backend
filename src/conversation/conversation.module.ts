import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { Services } from '../utils/constants/services';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ConversationEntity } from './conversation.entity';
import { MessageEntity } from '../message/message.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConversationEntity, UserEntity, MessageEntity]),
  ],
  controllers: [ConversationController],
  providers: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationService,
    },
  ],
  exports: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationService,
    },
  ],
})
export class ConversationModule {}
