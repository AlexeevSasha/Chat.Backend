import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../database/typeorm.config';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    PassportModule.register({}),
    AuthModule,
    UserModule,
    ConversationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
