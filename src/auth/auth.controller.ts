import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Routes } from '../utils/constants/routes';
import { Services } from '../utils/constants/services';
import { IAuthService } from './interfaces/auth.service';
import { CreateUserDto } from './dto/createUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { AuthGuard as AuthGuardPassport } from '@nestjs/passport';
import { AuthGuard } from './guards/AuthGuard';
import { GetUser } from '../user/decorators/user.decorator';
import { IJwtPayloadRefresh } from './interfaces/jwt.payload';
import { IUserResponse } from './interfaces/user.responce';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() payload: CreateUserDto): Promise<IUserResponse> {
    const user = await this.authService.createUser(payload);
    return await this.authService.buildUserResponseWithTokens(user);
  }

  @Post('login')
  async loginUser(@Body() payload: LoginUserDto): Promise<IUserResponse> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.buildUserResponseWithTokens(user);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logoutUser(@GetUser('id') id: string) {
    return await this.authService.logout(id);
  }

  @UseGuards(AuthGuardPassport('jwt-refresh'))
  @Post('refresh')
  refreshToken(@GetUser() data: IJwtPayloadRefresh) {
    return this.authService.refreshToken(data.id, data.refreshToken);
  }
}
