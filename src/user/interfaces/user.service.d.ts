import { IUserFindParam } from './user';
import { UserEntity } from '../user.entity';

export interface IUserService {
  findUser(param: IUserFindParam): Promise<UserEntity>;
}
