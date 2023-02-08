import { UserEntity } from '../../user/user.entity';
import { ITokens } from './tokens';

export interface IUserResponse extends ITokens {
  user: UserEntity;
}
