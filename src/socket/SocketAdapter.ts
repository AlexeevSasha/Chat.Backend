import { IoAdapter } from '@nestjs/platform-socket.io';
import * as cookie from 'cookie';
import { Socket } from 'socket.io';

export class WebsocketAdapter extends IoAdapter {
  createIOServer(port: number, options?: any) {
    const server = super.createIOServer(port, options);
    server.use(async (socket: Socket, next) => {
      const { cookie: clientCookie } = socket.handshake.headers;
      if (!clientCookie) {
        return next(new Error('Not Authenticated. No cookies were sent'));
      }
      const { id, refresh_token } = cookie.parse(clientCookie);
      if (!id && !refresh_token) {
        return next(new Error('Not Authenticated'));
      }
      next();
    });
    return server;
  }
}
