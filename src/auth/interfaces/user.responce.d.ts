import { UserEntity } from '../../user/user.entity';
import { ITokens } from './tokens';

export interface IUserResponse extends Pick<ITokens, 'access_token'> {
  user: UserEntity;
}
