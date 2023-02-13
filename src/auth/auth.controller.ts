import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Res,
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
import { Response } from 'express';

@Controller(Routes.AUTH)
export class AuthController {
  constructor(
    @Inject(Services.AUTH) private readonly authService: IAuthService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() payload: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    const user = await this.authService.createUser(payload);
    return await this.authService.buildUserResponseWithTokens(user, res);
  }

  @Post('login')
  async loginUser(
    @Body() payload: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IUserResponse> {
    const user = await this.authService.validateUser(payload);
    return await this.authService.buildUserResponseWithTokens(user, res);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logoutUser(
    @GetUser('id') id: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    res.cookie('refresh_token', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
    });

    return await this.authService.logout(id);
  }

  @UseGuards(AuthGuardPassport('jwt-refresh'))
  @Post('refresh')
  async refreshToken(
    @GetUser() data: IJwtPayloadRefresh,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, refresh_token } = await this.authService.refreshToken(
      data.id,
      data.refreshToken,
    );

    res.cookie('refresh_token', refresh_token, {
      path: '/',
      maxAge: 15 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    return { access_token, refresh_token };
  }
}
