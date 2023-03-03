import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { OnEvent } from '@nestjs/event-emitter';
import { ConversationEntity } from '../conversation/conversation.entity';
import { MessageEntity } from '../message/message.entity';

@WebSocketGateway(+process.env.SOCKET_PORT, {
  transport: ['websocket'],
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingInterval: 1000,
})
export class SocketGateway implements OnGatewayConnection {
  private connectedUsers: Map<string, any> = new Map();
  @WebSocketServer()
  server: Server;

  constructor(private readonly socketService: SocketService) {}

  async handleConnection(socket: Socket) {
    const user = await this.socketService.getUserFromSocket(socket);
    this.connectedUsers.set(socket.id, user);
    socket.emit('connected', user.id);
    console.log('connect', this.connectedUsers);
  }

  handleDisconnect(socket: Socket): void {
    this.connectedUsers.delete(socket.id);
    console.log('disconect', this.connectedUsers);
    socket.disconnect();
  }

  //message
  @OnEvent('message.send')
  async listenForMessages(payload: MessageEntity) {
    this.server.sockets.emit('message', payload);
  }

  //conversation
  @OnEvent('conversation.create')
  handleConversationCreateEvent(payload: ConversationEntity) {
    this.server.sockets.emit('conversation', payload);
  }
}
