import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { Services } from '../utils/constants/services';
import { ConversationService } from './conversation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { ConversationEntity } from './conversation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ConversationEntity, UserEntity])],
  controllers: [ConversationController],
  providers: [
    {
      provide: Services.CONVERSATIONS,
      useClass: ConversationService,
    },
  ],
})
export class ConversationModule {}
