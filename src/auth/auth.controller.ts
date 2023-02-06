import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../utils/constants/routes';
import { Services } from '../utils/constants/services';
import { IAuthService } from './interfaces/auth.service';
import { IUserService } from '../user/interfaces/user.service';
import { CreateUserDto } from '../user/dtos/createUser.dto';
import { LocalAuthGuard } from './guards/localAuthGuard';
import { Response } from 'express';
import { UserEntity } from '../user/user.entity';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  @Post('register')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  loginUser(@Res() res: Response, @Session() session: Record<string, any>) {
    console.log(session.cookie);
    return res.send(session.passport.user);
  }

  @Get('status')
  statusUser() {}

  @Post('logout')
  logoutUser() {}
}
