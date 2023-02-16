import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../database/typeorm.config';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConversationModule } from '../conversation/conversation.module';
import { MessageModule } from '../message/message.module';
import { SocketModule } from '../socket/socket.module';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    PassportModule.register({}),
    EventEmitterModule.forRoot(),
    AuthModule,
    UserModule,
    ConversationModule,
    MessageModule,
    SocketModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
