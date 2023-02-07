import { UserEntity } from '../../user/user.entity';
import { CreateUserDto } from '../dto/createUser.dto';
import { LoginUserDto } from '../dto/loginUser.dto';

export interface IAuthService {
  createUser(payload: CreateUserDto): Promise<UserEntity>;
  validateUser(payload: LoginUserDto): Promise<UserEntity>;
  logout(id: string): Promise<boolean>;
  refreshToken();
}
