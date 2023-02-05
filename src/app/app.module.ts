import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from '../database/typeorm.config';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), AuthModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
