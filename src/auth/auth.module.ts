import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Services } from '../utils/constants/services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access.token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh.token.strategy';

@Module({
  imports: [JwtModule.register({}), TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [
    {
      provide: Services.AUTH,
      useClass: AuthService,
    },
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
})
export class AuthModule {}
