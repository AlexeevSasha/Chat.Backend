import { Socket } from 'socket.io';
import { UserEntity } from '../../user/user.entity';

export interface ISocketService {
  getUserFromSocket: (socket: Socket) => Promise<UserEntity>;
}
