import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { Routes } from '../utils/constants/routes';
import { Services } from '../utils/constants/services';
import { IAuthService } from './interfaces/auth.service';
import { IUserService } from '../user/interfaces/user.service';
import { CreateUserDto } from '../user/dtos/createUser.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    this.userService.createUser(createUserDto);
  }

  @Post('login')
  loginUser() {}

  @Get('status')
  statusUser() {}

  @Post('logout')
  logoutUser() {}
}
