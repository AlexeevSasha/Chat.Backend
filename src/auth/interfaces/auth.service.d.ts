import { UserEntity } from '../../user/user.entity';
import { CreateUserDto } from '../dto/createUser.dto';
import { LoginUserDto } from '../dto/loginUser.dto';
import { ITokens } from './tokens';
import { IUserResponse } from './user.responce';
import { Response } from 'express';

export interface IAuthService {
  createUser(payload: CreateUserDto): Promise<UserEntity>;

  validateUser(payload: LoginUserDto): Promise<UserEntity>;

  logout(id: string): Promise<boolean>;

  refreshToken(id: string, rt: string): Promise<ITokens>;

  buildUserResponseWithTokens(
    user: UserEntity,
    res: Response,
  ): Promise<IUserResponse>;
}
