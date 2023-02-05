import { CreateUserDto } from '../dtos/createUser.dto';

export interface IUserService {
  createUser(userDetails: CreateUserDto);
}
