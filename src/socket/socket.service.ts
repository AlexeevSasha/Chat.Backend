import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { Services } from '../utils/constants/services';
import { IUserService } from '../user/interfaces/user.service';
import { ISocketService } from './interfaces/socket.service';

@Injectable()
export class SocketService implements ISocketService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const { id } = parse(String(socket.handshake.headers.cookie));
    return await this.userService.findUser({ id });
  }
}
