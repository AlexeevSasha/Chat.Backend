import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from './interfaces/auth.service';
import { Services } from '../utils/constants/services';
import { IUserService } from '../user/interfaces/user.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}
  validateUser() {}
}
