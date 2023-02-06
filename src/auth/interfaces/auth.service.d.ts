import { IUserLogin } from '../../user/interfaces/user';
import { UserEntity } from '../../user/user.entity';

export interface IAuthService {
  validateUser(login: IUserLogin): Promise<UserEntity>;
}
