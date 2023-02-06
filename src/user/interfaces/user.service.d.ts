import { CreateUserDto } from '../dtos/createUser.dto';
import { IUserFindParam } from './user';
import { UserEntity } from '../user.entity';

export interface IUserService {
  createUser(userDetails: CreateUserDto): Promise<UserEntity>;
  findUser(param: IUserFindParam): Promise<UserEntity>;
}
