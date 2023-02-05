import { Controller, Inject } from '@nestjs/common';
import { Services } from '../utils/constants/services';
import { IUserService } from './interfaces/user.service';
import { Routes } from '../utils/constants/routes';

@Controller(Routes.USERS)
export class UserController {
  constructor(@Inject(Services.USERS) private userService: IUserService) {}
}
