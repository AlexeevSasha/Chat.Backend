import {
  MessageBody,
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway(+process.env.SOCKET_PORT, {
  transport: ['websocket'],
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class MessagingGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketService) {}

  async handleConnection(socket: Socket) {
    await this.socketService.getUserFromSocket(socket);
    socket.emit('connected', { status: 'good' });
  }

  //message
  @OnEvent('send_message')
  async listenForMessages(@MessageBody() content: string) {
    this.server.sockets.emit('receive_message', {
      content,
    });
  }
}
