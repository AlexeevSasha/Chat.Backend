import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { Routes } from '../utils/constants/routes';
import { Services } from '../utils/constants/services';
import { IAuthService } from './interfaces/auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UserEntity } from '../user/user.entity';
import { LoginUserDto } from './dto/loginUser.dto';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Post('register')
  async createUser(@Body() payload: CreateUserDto): Promise<UserEntity> {
    return await this.authService.createUser(payload);
  }

  @Post('login')
  async loginUser(@Body() payload: LoginUserDto): Promise<UserEntity> {
    return await this.authService.validateUser(payload);
  }

  @Get('status')
  statusUser() {}

  @Get('logout')
  async logoutUser(@Param() id: string) {
    console.log(id);
    return await this.authService.logout(id);
  }

  @Post('refresh')
  refreshToken() {}
}
