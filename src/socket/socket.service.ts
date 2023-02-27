import { Inject, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { Services } from '../utils/constants/services';
import { IUserService } from '../user/interfaces/user.service';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketService {
  constructor(
    @Inject(Services.USERS) private readonly userService: IUserService,
  ) {}

  async getUserFromSocket(socket: Socket) {
    const { id } = parse(socket.handshake.headers.cookie);
    const user = await this.userService.findUser({ id });

    if (!user) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }
}
