import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Services } from '../../utils/constants/services';
import { IAuthService } from '../interfaces/auth.service';
import { UserEntity } from '../../user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<UserEntity> {
    return this.authService.validateUser({ email, password });
  }
}
